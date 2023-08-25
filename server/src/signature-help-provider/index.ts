import { SignatureHelpParams, SignatureHelp } from 'vscode-languageserver/node'

import * as functions from './functions'

export function help (params: SignatureHelpParams): SignatureHelp {
  return functions.signatureHelpProvider(params)
}
