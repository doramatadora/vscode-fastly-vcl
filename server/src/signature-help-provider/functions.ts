import {
  SignatureHelp,
  SignatureInformation,
  MarkupKind
} from 'vscode-languageserver/node'

import { slugify, DOCS_URL } from '../shared/utils'
import { activeDoc } from '../shared/activeDoc'
import vclFunctions from '../metadata/functions.json'
import vclSubroutines from '../metadata/subroutines.json'

const FUNCTIONS: Map<string, SignatureInformation> = new Map()

for (const fnName of Object.keys(vclFunctions)) {
  const token = vclFunctions[fnName] as any
  if (!token.args?.length) continue
  token.methods = token.methods?.filter(m => !!vclSubroutines[m])

  FUNCTIONS.set(fnName, {
    label: `${token.type} ${fnName}(${
      token.args.length
        ? token.args.map(arg => `${arg.type} ${arg.name}`).join(', ')
        : ``
    })`,
    parameters: token.args.map(arg => ({ label: `${arg.type} ${arg.name}` })),
    documentation: {
      kind: MarkupKind.Markdown,
      value: [
        token.desc,
        token.methods?.length &&
          '**Scope:** `' + token.methods.join('`, `') + '`',
        `[Documentation](${DOCS_URL}/functions/${slugify(fnName)}/)`
      ]
        .filter(Boolean)
        .join('\n\n')
    }
  })
}

export function signatureHelpProvider (sigHelpParams): SignatureHelp {
  console.debug('sighelp:functions')
  const textOnCurrentLine = activeDoc.getLine(sigHelpParams.position)
  const fnCandidates = textOnCurrentLine.match(/\b((?:\w|\.)+)\({1}/g)
  if (!fnCandidates) return
  const fnName = fnCandidates[fnCandidates.length - 1].slice(0, -1)
  const sig = FUNCTIONS.get(fnName)
  const argCount = textOnCurrentLine
    .slice(textOnCurrentLine.lastIndexOf(`${fnName}(`))
    .split(',')
  return {
    signatures: [sig],
    activeSignature: 0,
    activeParameter: argCount.length - 1
  }
}
