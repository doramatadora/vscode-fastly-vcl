import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupKind,
  TextDocumentPositionParams
} from 'vscode-languageserver/node'

import { slugify, DOCS_URL, VCL_FLOW_URL, BOILERPLATE } from '../shared/utils'

import vclSubroutines from '../metadata/subroutines.json'

const SUBROUTINES: CompletionItem[] = []

export const SUBROUTINE_COMPLETIONS: Map<string, CompletionItem> = new Map()

for (const sName of Object.keys(vclSubroutines)) {
  const token = vclSubroutines[sName] as any

  SUBROUTINES.push({
    label: `sub vcl_${sName}`,
    kind: CompletionItemKind.Snippet
  })

  SUBROUTINE_COMPLETIONS.set(`sub vcl_${sName}`, {
    label: sName,
    detail: `vcl_${sName} { ... }`,
    insertTextFormat: InsertTextFormat.Snippet,
    insertText: BOILERPLATE[sName]?.snippet || `sub vcl_${sName}`,
    documentation: {
      kind: MarkupKind.Markdown,
      value: [
        BOILERPLATE[sName]?.desc,
        token.returns &&
          token.returns.length &&
          '### Allowed return values \n' +
            token.returns.map(rtn => `* \`${rtn}\``).join('\n'),
        `[Documentation](${DOCS_URL}/subroutines/${slugify(
          sName
        )}/) | [VCL request lifecycle](${VCL_FLOW_URL})`
      ]
        .filter(Boolean)
        .join('\n\n')
    }
  })
}

export function query (
  _params: TextDocumentPositionParams
): CompletionItem[] {
  console.debug('completion:query:snippets')
  return SUBROUTINES
}

export function resolve (completionItem: CompletionItem): CompletionItem {
  console.debug('completion:resolve:snippets', completionItem.label)
  if (SUBROUTINE_COMPLETIONS.has(completionItem.label)) {
    return SUBROUTINE_COMPLETIONS.get(completionItem.label)
  }
  return completionItem
}
