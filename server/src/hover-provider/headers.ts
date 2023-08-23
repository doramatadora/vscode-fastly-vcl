import {
  Hover,
  MarkupKind,
} from 'vscode-languageserver/node'

import { slugify, DOCS_URL } from '../shared/utils'
import vclHeaders from '../metadata/headers.json'

export const HOVER: Map<string, Hover> = new Map()

for (const hName of Object.keys(vclHeaders)) {
  const token = vclHeaders[hName] as any
  HOVER.set(hName, {
    contents: {
      kind: MarkupKind.Markdown,
      value: [
        `## HTTP header: ${hName}`,
        token.desc,
        `[Documentation](${DOCS_URL}/http/http-headers/${slugify(hName)}/)`
      ]
        .filter(Boolean)
        .join('\n\n')
    }
  })
}
