import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemTag,
  MarkupKind,
  TextDocumentPositionParams
} from 'vscode-languageserver/node'

import { slugify, DOCS_URL } from '../shared/utils'
import vclHeaders from '../metadata/headers.json'
import vclSubroutines from '../metadata/subroutines.json'
import vclVariables from '../metadata/variables.json'

const HEADERS: CompletionItem[] = []

const HEADER_COMPLETIONS: Map<string, CompletionItem> = new Map()

for (const hName of Object.keys(vclHeaders)) {
  const token = vclHeaders[hName] as any
  token.methods = token.methods?.filter(m => !!vclSubroutines[m])
  // Cover all scopes.
  for (const scope of [`obj`, `req`, `resp`, `bereq`, `beresp`]) {
    if (
      scope !== 'obj' &&
      !token.available?.some((a: string) => scope.endsWith(a))
    ) {
      continue
    }
    const { methods } = (vclVariables[`${scope}.http.{NAME}`] as any) || {}

    HEADERS.push({
      label: `${scope}.http.${hName}`,
      labelDetails: {
        detail: ` STRING`
      },
      data: {
        name: hName,
        available: token.available,
        methods: methods || []
      },
      kind: CompletionItemKind.EnumMember
    })
  }

  HEADER_COMPLETIONS.set(hName, {
    label: hName,
    tags: token.deprecated ? [CompletionItemTag.Deprecated] : [],
    detail: `${hName} HEADER`,
    documentation: {
      kind: MarkupKind.Markdown,
      value: [
        token.desc,
        `[Documentation](${DOCS_URL}/http/http-headers/${slugify(hName)}/)`
      ]
        .filter(Boolean)
        .join('\n\n')
    }
  })
}

export function query (
  _params: TextDocumentPositionParams,
  currentWord: string,
  scope?: string
): CompletionItem[] {
  console.debug('completion:query:headers')
  const H = scope
    ? HEADERS.filter(
        f => !f.data.methods.length || f.data.methods.includes(scope)
      )
    : HEADERS
  if (/^(be)?req/.test(currentWord)) {
    return H.filter(h =>
      h.data.available ? h.data.available.includes('req') : true
    )
  }
  if (/^(be)?resp/.test(currentWord)) {
    return H.filter(h =>
      h.data.available ? h.data.available.includes('resp') : true
    )
  }
  return H
}

export function resolve (completionItem: CompletionItem): CompletionItem {
  console.debug('completion:resolve:variables', completionItem.label)
  if (HEADER_COMPLETIONS.has(completionItem.data.name)) {
    return HEADER_COMPLETIONS.get(completionItem.data.name)
  }
  return completionItem
}
