import {
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams
} from 'vscode-languageserver/node'

import { documentCache } from '../shared/documentCache'

import * as vclFunctions from './functions'
import * as vclVariables from './variables'
import * as vclSubroutines from './subroutines'
import * as vclHeaders from './headers'

// Context-aware token completion based on the enclosing builtin subroutine.

// Returns a list of completion items for the given position.
export function query (params: TextDocumentPositionParams): CompletionItem[] {
  const activeDoc = documentCache.get(params.textDocument.uri)
  
  const textOnCurrentLine = activeDoc.getLine(params.position)
  console.debug('completion:query', {
    in: params.textDocument.uri,
    textOnCurrentLine
  })

  if (textOnCurrentLine === 'sub ') {
    return vclSubroutines.query(params)
  }

  const scope = activeDoc.getSubroutine(params.position)

  if (textOnCurrentLine.trim().toLowerCase().startsWith('#f')) {
    // TODO: Fastly macro autocomplete
  }

  if (/^\s+(#|\/\/)/.test(textOnCurrentLine)) {
    return []
  }

  const builtinSubroutine = scope ? scope.replace(`vcl_`, ``) : null
  const currentWord = activeDoc.getWord(params.position)
  console.debug('completion:query:word', {
    in: params.textDocument.uri,
    currentWord,
    scope,
    builtinSubroutine
  })  
  
  return [
    ...vclFunctions.query(params, currentWord, builtinSubroutine),
    ...vclVariables.query(params, currentWord, builtinSubroutine),
    ...vclHeaders.query(params, currentWord, builtinSubroutine)
  ]
}

// Resolves additional information for the item selected in the completion list.
export function resolve (completionItem: CompletionItem): CompletionItem {
  console.debug('completion:resolve')
  if (completionItem.kind === CompletionItemKind.EnumMember) {
    return vclHeaders.resolve(completionItem)
  }
  if (completionItem.kind === CompletionItemKind.Snippet) {
    return vclSubroutines.resolve(completionItem)
  }
  if (completionItem.kind === CompletionItemKind.Method) {
    return vclFunctions.resolve(completionItem)
  }
  if (completionItem.kind === CompletionItemKind.Variable) {
    return vclVariables.resolve(completionItem)
  }
  return completionItem
}
