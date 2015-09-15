/// <reference path="CharacterReference.ts" />
/// <reference path="TextLine.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="../Parser/ParserHelpers.ts" />

namespace Razor.Text
{
  import ParserHelpers = Razor.Parser.ParserHelpers;
  
  /**
   * Provides string buffering through tracked lines
   * @class
   */
  export class LineTrackingStringBuffer
  {
    private _currentLine: TextLine;
    private _endLine: TextLine;
    private _lines: TextLine[];
    
    /**
     * Initialises a new instance of a line tracking string buffer
     * @constructor
     */
    constructor()
    {
      this._endLine = new TextLine(0, 0);
      this._lines = [this._endLine];
    }
    
    /**
     * Gets the end location
     * @property
     * @readonly
     * @returns {SourceLocation}
     */
    public get endLocation(): SourceLocation
    {
      return new SourceLocation(this.length, this._lines.length - 1, this._lines[this._lines.length - 1].length);
    }
    
    /**
     * Gets the length of the buffer.
     * @property
     * @readonly
     * @returns {number}
     */
    public get length(): number
    {
      return this._endLine.end;
    }
    
    /**
     * Appends the current line to the buffer
     * @function
     * @param {string} content - The content to append
     */
    public append(content: string): void
    {
      for (var i = 0; i < content.length; i++)
      {
        this._lines[this._lines.length -1].content += content[i];
        
        if ((content[i] === '\r' && (i + 1 === content.length || content[i + 1] !== '\n')) || (content[i] !== '\r' && ParserHelpers.isNewLine(content[i])))
        {
          this.pushNewLine();
        }
      }
    }
    
    /**
     * Gets a reference to the character at the given absolute index.
     * @function
     * @param {number} absoluteIndex - The absolute index
     * @returns {CharacterReferece}
     */
    public charAt(absoluteIndex: number): CharacterReference
    {
      var line = this.findLine(absoluteIndex);
      if (line === null)
      {
        throw "Argument out of range: " + absoluteIndex;
      }
      var idx = absoluteIndex - line.start;
      return new CharacterReference(line.content[idx], new SourceLocation(absoluteIndex, line.index, idx));
    }
    
    /**
     * Finds a line in the buffer that contains the given absolute index.
     * @function
     * @param {number} absoluteIndex - The absolute index
     * @returns {TextLine}
     */
    private findLine(absoluteIndex: number): TextLine
    {
      var selected: TextLine = null;
      
      if (this._currentLine != null)
      {
        if (this._currentLine.contains(absoluteIndex))
        {
          selected = this._currentLine;
        }
        else if (absoluteIndex > this._currentLine.index && this._currentLine.index + 1 < this._lines.length)
        {
          selected = this.scanLines(absoluteIndex, this._currentLine.index);
        }
      }
      
      if (selected === null)
      {
        selected = this.scanLines(absoluteIndex, 0);
      }
      
      this._currentLine = selected;
      return selected;
    }
    
    /**
     * Scans all the lines in the buffer to find the line containing the absolute index
     * @function
     * @param {number} absoluteIndex - The absolute index
     * @param {number} start - The start line index
     * @returns {TextLine}
     */
    private scanLines(absoluteIndex: number, start: number): TextLine
    {
      for (var i = 0; i < this._lines.length; i++)
      {
        var idx = (i + start) % this._lines.length;
        
        if (this._lines[idx].contains(absoluteIndex))
        {
          return this._lines[idx];
        }
      }
      return null;
    }
    
    /**
     * Pushes a new line on the buffer
     * @function
     */
    private pushNewLine(): void
    {
      this._endLine = new TextLine(this._endLine.end, this._endLine.index + 1);
      this._lines.push(this._endLine);
    }
  }
}