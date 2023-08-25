import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as vsctm from 'vscode-textmate'
import * as vsconi from 'vscode-oniguruma'

const GRAMMAR_SCOPE = 'source.vcl'

const GRAMMAR_PATH = join(__dirname, '../grammars/vcl.tmLanguage.json')

const RAW_GRAMMAR = vsctm.parseRawGrammar(
  readFileSync(GRAMMAR_PATH).toString(),
  GRAMMAR_PATH
)

const ONIGURUMA_WASM_BIN = readFileSync(
  join(__dirname, '../../node_modules/vscode-oniguruma/release/onig.wasm')
).buffer

const registry = new vsctm.Registry({
  onigLib: vsconi.loadWASM(ONIGURUMA_WASM_BIN).then(() => {
    return {
      createOnigScanner (patterns: string[]) {
        return new vsconi.OnigScanner(patterns)
      },
      createOnigString (s: string) {
        return new vsconi.OnigString(s)
      }
    }
  }),
  loadGrammar: async () => {
    return RAW_GRAMMAR
  }
})

export async function tokenize (
  text: Iterable<string>,
  ruleStack: vsctm.StateStack = vsctm.INITIAL
) {
  try {
    const grammar = await registry.loadGrammar(GRAMMAR_SCOPE)
    if (!grammar) return
    for (const line of text) {
      const lineTokens = grammar.tokenizeLine(line, ruleStack)
      lineTokens.tokens.forEach(token => {
        console.info(
          ` - ${token.startIndex}-${token.endIndex} (${line.substring(
            token.startIndex,
            token.endIndex
          )}) with scopes ${token.scopes.join(', ')}`
        )
      })
      ruleStack = lineTokens.ruleStack
    }
  } catch (e) {
    console.error(e)
  }
}
