import {
  TextDocument,
  Range,
  Position
} from 'vscode-languageserver-textdocument'

// This is a naive doc cache pointing to a single active document,
// to use whenever we need to retrieve the text that's being edited.
// Think activeDoc.getText(range?: Range): string
// range = { start: { line: 1, character: 5 }, end: { ... } }

class ActiveDoc {
  private _doc: TextDocument = null

  get doc (): TextDocument {
    return this._doc
  }

  set (doc: TextDocument): void {
    this._doc = doc
  }

  getText (range?: Range): string {
    return this._doc?.getText(range)
  }

  getLine (position: Position, entireLine?: boolean): string {
    return this._doc?.getText({
      start: {
        line: position.line,
        character: 0
      },
      end: entireLine
        ? {
            line: position.line,
            character: Number.MAX_SAFE_INTEGER
          }
        : position
    })
  }

  getWord (position: Position): string {
    const line = this.getLine(position, true)
    const [wordStart] = line
      .slice(0, position.character)
      .match(/[\w\d._-]+$/) || ['']
    const [wordEnd] = line.slice(position.character).match(/^[\w\d._-]+/) || [
      ''
    ]
    return `${wordStart}${wordEnd}`
  }

  getSubroutine (position: Position): string {
    const brackets = {
      open: 0,
      close: 0
    }
    for (let l = position.line - 1; l >= 0; l--) {
      const line = this.getLine({ line: l, character: 0 }, true)
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

export const activeDoc = new ActiveDoc()
