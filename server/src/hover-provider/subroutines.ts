import {
  Hover,
  MarkupKind,
} from 'vscode-languageserver/node'

import { slugify, DOCS_URL, VCL_FLOW_URL, BOILERPLATE } from '../shared/utils'

export const HOVER: Map<string, Hover> = new Map()

for (const sName of Object.keys(BOILERPLATE)) {
  const token = BOILERPLATE[sName] as any
  HOVER.set(`vcl_${sName}`, {
    contents: {
      kind: MarkupKind.Markdown,
      value: [
        `## sub vcl_${sName} { ... }`,
        token.desc,
        `[Documentation](${DOCS_URL}/subroutines/${slugify(sName)}/) | [VCL request lifecycle](${VCL_FLOW_URL})`
      ]
        .filter(Boolean)
        .join('\n\n')
    }
  })
}