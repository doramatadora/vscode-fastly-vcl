import {
  createConnection,
  TextDocuments,
  CodeAction,
  CodeActionKind,
  Command,
  TextDocumentEdit,
  TextEdit,
  Position,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  CompletionList,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  InitializeResult,
  CodeActionParams,
  CompletionParams,
  SignatureHelp,
  WorkDoneProgressReporter,
  CancellationToken,
  DefinitionLink,
  DeclarationLink,
  Definition,
  Location
} from 'vscode-languageserver/node'

import { ConfigSettings, CONFIG } from './config'
import { documentCache } from './shared/documentCache'

import * as completionsProvider from './completion-provider'
import * as signatureHelpProvider from './signature-help-provider'
import * as hoverProvider from './hover-provider'
import * as linter from './linter'

// Create a connection for the server (Node-IPC transport).
export const connection = createConnection(ProposedFeatures.all)

let globalConfig: ConfigSettings = CONFIG
let hasConfigurationCapability = false
let hasWorkspaceFolderCapability = false
export let hasDiagnosticRelatedInformationCapability = false

connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities

  // If client doesn't support the `workspace/configuration`, fall back on global settings.
  hasConfigurationCapability = !!capabilities.workspace?.configuration
  hasWorkspaceFolderCapability = !!capabilities.workspace?.workspaceFolders
  
  hasDiagnosticRelatedInformationCapability =
    !!capabilities.textDocument?.publishDiagnostics?.relatedInformation

  // Announce server capabilities.
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['#'],
        allCommitCharacters: [';', '{'],
        completionItem: {
          labelDetailsSupport: true
        }
      },
      signatureHelpProvider: {
        triggerCharacters: ['(', ',']
      },
      hoverProvider: true
    }
  }
  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true
      }
    }
  }
  return result
})

connection.onInitialized(() => {
  if (hasConfigurationCapability) {
    // Register for all configuration changes.
    connection.client.register(
      DidChangeConfigurationNotification.type,
      undefined
    )
  }
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders(_event => {
      connection.console.log('Workspace folder changed.')
    })
  }
})

// Cache the settings of all open documents.
const documentSettings: Map<string, Thenable<ConfigSettings>> = new Map()

export function getDocumentSettings(
  resource: string
): Thenable<ConfigSettings> {
  if (!hasConfigurationCapability) {
    return Promise.resolve(globalConfig)
  }
  let result = documentSettings.get(resource)
  if (!result) {
    result = connection.workspace.getConfiguration({
      scopeUri: resource,
      section: 'fastly.vcl'
    })
    documentSettings.set(resource, result)
  }
  return result
}

connection.onDidChangeConfiguration(change => {
  if (hasConfigurationCapability) {
    // Reset all cached document settings.
    documentSettings.clear()
  } else {
    globalConfig = <ConfigSettings>(change.settings.fastly.vcl || CONFIG)
  }
  if (!documentCache.isEmpty() || !hasDiagnosticRelatedInformationCapability)
    return
  // Revalidate all open documents.
  for (const document of documentCache.all()) {
    linter.validateVCLDocument(document)
  }
})

connection.onDidOpenTextDocument(params => {
  // Lint the newly opened document.
  documentCache.set(params.textDocument)
  const document = documentCache.get(params.textDocument.uri)
  if (!document) return
  linter.validateVCLDocument(document)
})

connection.onDidChangeTextDocument(async params => {
  // Apply incremental changes to the cached document.
  documentCache.applyChanges(params)
  const document = documentCache.get(params.textDocument.uri)
  if (!document || !hasDiagnosticRelatedInformationCapability) return
  linter.debouncedVCLLint(document)
})

connection.onDidSaveTextDocument(params => {
  // The content of a text document has changed.
})

connection.onDidCloseTextDocument(params => {
  // Only cache open documents and their settings.
  // TODO: hows this work for ASTs?
  documentSettings.delete(params.textDocument.uri)
  documentCache.delete(params.textDocument.uri)
})

connection.onDidChangeWatchedFiles(_changes => {
  // TODO: Implement config file parsing and validation.
  // Config files changed (e.g. .vclrc, .falcorc), may need to revalidate all open documents.
  // Noop for now.
})

connection.onCompletion(completionsProvider.query)

connection.onCompletionResolve(completionsProvider.resolve)

connection.onSignatureHelp(signatureHelpProvider.help)

connection.onHover(hoverProvider.resolve)

connection.listen()
