import { Hover, HoverParams, TextDocumentPositionParams } from 'vscode-languageserver/node'

import { documentCache } from '../shared/documentCache'
import { HEADER_RX } from '../shared/utils'

import * as vclFunctions from './functions'
import * as vclVariables from './variables'
import * as vclSubroutines from './subroutines'
import * as vclHeaders from './headers'

export function resolve (params: HoverParams): Hover {
  const activeDoc = documentCache.get(params.textDocument.uri)
  
  const hoverWord = activeDoc.getWord(params.position)
  console.log('hover:resolve', { hoverWord, position: params.position })
  if (HEADER_RX.test(hoverWord)) {
    return vclHeaders.HOVER.get(hoverWord.replace(HEADER_RX, ''))
  }
  const hoverMd =
    vclFunctions.HOVER.get(hoverWord) ||
    vclVariables.HOVER.get(hoverWord) ||
    vclSubroutines.HOVER.get(hoverWord)
  return hoverMd
}
