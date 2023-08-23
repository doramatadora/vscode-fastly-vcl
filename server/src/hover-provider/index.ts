import { Hover, TextDocumentPositionParams } from 'vscode-languageserver/node'

import { activeDoc } from '../shared/activeDoc'
import { HEADER_RX } from '../shared/utils'

import * as vclFunctions from './functions'
import * as vclVariables from './variables'
import * as vclSubroutines from './subroutines'
import * as vclHeaders from './headers'

export function resolve ({
  textDocument: _vclDoc,
  position
}: TextDocumentPositionParams): Hover {
  const hoverWord = activeDoc.getWord(position)
  console.log('hover:resolve', { hoverWord, position })
  if (HEADER_RX.test(hoverWord)) {
    return vclHeaders.HOVER.get(hoverWord.replace(HEADER_RX, ''))
  }
  const hoverMd =
    vclFunctions.HOVER.get(hoverWord) ||
    vclVariables.HOVER.get(hoverWord) ||
    vclSubroutines.HOVER.get(hoverWord)
  return hoverMd
}
