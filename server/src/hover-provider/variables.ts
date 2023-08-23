import {
  Hover,
  MarkupKind,
} from 'vscode-languageserver/node'

import { slugify, DOCS_URL } from '../shared/utils'
import vclVariables from '../metadata/variables.json'

export const HOVER: Map<string, Hover> = new Map()

for (const vName of Object.keys(vclVariables)) {
  const token = vclVariables[vName] as any
  HOVER.set(vName, {
    contents: {
      kind: MarkupKind.Markdown,
      value: [
        `## ${token.type} ${vName}`,
        token.desc,
        `[Documentation](${DOCS_URL}/variables/${slugify(vName)}/)`
      ]
        .filter(Boolean)
        .join('\n\n')
    }
  })
}