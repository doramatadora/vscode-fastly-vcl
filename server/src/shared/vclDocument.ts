import {
  TextDocument,
  TextDocumentContentChangeEvent,
  Range,
  Position
} from 'vscode-languageserver-textdocument'

export class VclDocument {
  private _doc: TextDocument

  constructor (
    uri: string,
    languageId: string,
    version: number,
    content: string
  ) {
    this._doc = TextDocument.create(uri, languageId, version, content)
  }

  get doc (): TextDocument {
    return this._doc
  }

  get uri (): string {
    return this._doc.uri
  }

  set (doc: TextDocument): void {
    this._doc = doc
  }

  update (changes: TextDocumentContentChangeEvent[], version: number) {
    // TextDocument.update() handles nonsequential changes with mergesort
    this.set(TextDocument.update(this._doc, changes, version))
    return this
  }

  getText (range?: Range): string {
    return this._doc.getText(range)
  }

  getLineTo (position: Position): string {
    return this._doc.getText({
      start: {
        line: position.line,
        character: 0
      },
      end: position
    })
  }

  getLine (position: Position): string {
    return this._doc
      .getText({
        start: {
          line: position.line,
          character: 0
        },
        end: {
          line: position.line + 1,
          character: 0
        }
      })
      .replace(/\r?\n$/, '')
  }

  *getLines () {
    for (let i = 0; i < this._doc.lineCount; i++) {
      yield this.getLine({ line: i, character: 0 })
    }
  }

  getWord (position: Position): string {
    const line = this.getLine(position)
    const [wordStart] = line
      .slice(0, position.character)
      .match(/[\w\d._-]+$/) || ['']
    const [wordEnd] = line.slice(position.character).match(/^[\w\d._-]+/) || [
      ''
    ]
    return `${wordStart}${wordEnd}`
  }

  getSubroutine (position: Position): string | null {
    const brackets = {
      open: 0,
      close: 0
    }
    for (let l = position.line - 1; l >= 0; l--) {
      const line = this.getLine({ line: l, character: 0 })
      brackets.open += (line.match(/\{/g) || []).length
      brackets.close += (line.match(/\}/g) || []).length
      const [_, subroutine] = line.match(/^sub (\w+)\s*{/) || []
      if (subroutine && brackets.open >= brackets.close) {
        return subroutine
      }
    }
    return null
  }
}
