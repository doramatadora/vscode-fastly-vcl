import { SignatureHelp } from 'vscode-languageserver/node'

import * as functions from './functions'

export function help (sigHelpParams): SignatureHelp {
  return functions.signatureHelpProvider(sigHelpParams)
}
