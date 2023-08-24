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

import { TextDocument } from 'vscode-languageserver-textdocument'
import { ConfigSettings, CONFIG } from './config'
import { activeDoc } from './shared/activeDoc'

import * as completionsProvider from './completion-provider'
import * as signatureHelpProvider from './signature-help-provider'
import * as hoverProvider from './hover-provider'
import * as linter from './linter'

// Create a connection for the server (IPC transport).
export const connection = createConnection(ProposedFeatures.all)

// Create a text document manager.
export const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument)

let globalConfig: ConfigSettings = CONFIG
let hasConfigurationCapability = false
let hasWorkspaceFolderCapability = false
export let hasDiagnosticRelatedInformationCapability = false

connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities

  // If client doesn't support the `workspace/configuration`, fall back on global settings.
  hasConfigurationCapability = !!(
    capabilities.workspace && !!capabilities.workspace.configuration
  )
  hasWorkspaceFolderCapability = !!(
    capabilities.workspace && !!capabilities.workspace.workspaceFolders
  )
  hasDiagnosticRelatedInformationCapability = !!(
    capabilities.textDocument &&
    capabilities.textDocument.publishDiagnostics &&
    capabilities.textDocument.publishDiagnostics.relatedInformation
  )

  // Announce server capabilities.
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: [' '],
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
      connection.console.log('Workspace folder change event received.')
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
  // Revalidate all open documents.
  documents.all().forEach(linter.validateVCLDocument)
})

// Only keep settings for open documents.
documents.onDidClose(e => {
  documentSettings.delete(e.document.uri)
})

// The content of a text document has changed, or a doc was first opened. 
documents.onDidChangeContent(change => {
  activeDoc.set(change.document)
  linter.debouncedVCLLint(change.document)
})

// Unsaved document with Fastly VCL language setting.
documents.onWillSave(event => {
  activeDoc.set(event.document)
  linter.debouncedVCLLint(event.document)
})

connection.onDidChangeWatchedFiles((_changes) => {
  // TODO: Implement config file parsing and validation.
  // Config files changed (e.g. .vclrc, .falcorc), may need to revalidate all open documents.
  // Noop for now.
})

connection.onCompletion(completionsProvider.query)

connection.onCompletionResolve(completionsProvider.resolve)

connection.onSignatureHelp(signatureHelpProvider.help)

connection.onHover(hoverProvider.resolve)

documents.listen(connection)
connection.listen()
