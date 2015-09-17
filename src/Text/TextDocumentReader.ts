/// <reference path="../SourceLocation.ts" />
/// <reference path="ITextDocument.ts" />
/// <reference path="TextReader.ts" />"

namespace Razor.Text
{
  /**
   * Provides text reader services for reading text documents
   * @class
   */
  export class TextDocumentReader extends TextReader implements ITextDocument
  {
    private _document: ITextDocument;
    
    /**
     * Initialises a new instance of a text document reader
     */
    constructor(source: ITextDocument)
    {
      super();
      
      this._document = source;
    }
    
    /**
     * Gets the source document.
     * @property
     * @readonly
     */
    public get document(): ITextDocument
    {
      return this._document;
    }
    
    /**
     * Gets the length of the document.
     * @property
     * @readonly
     */
    public get length(): number
    {
      return this._document.length;
    }
    
    /**
     * Gets the location in the source document.
     */
    public get location(): SourceLocation
    {
      return this._document.location;
    }
    
    /**
     * Gets or sets the position in the document.
     * @property
     * @returns {number}
     */
    public get position(): number
    {
      return this._document.position;
    }    
    
    /**
     * @param {number} value - The position
     */
    public set position(value: number)
    {
      this._document.position = value;
    }
    
    /**
     * Begins a lookahead operaiton on the buffer.
     * @returns {LookaheadToken}
     */
    public beginLookahead(): LookaheadToken
    {
      var start = this.position;
      return new LookaheadToken(() => this.position = start);
    }
    
    /**
     * Peeks at the next character from the buffer without advancing the position.
     */
    public peek() : string|number
    {
      return this._document.peek();
    }
    
    /**
     * Reads the next character from the stream
     * @function
     * @param {string[]} [buffer] - The output buffer if reading to a buffer
     * @param {number} [index] - The start index if reading to a buffer
     * @param {number} [count] - The number of characters to read
     * @returns {string|number}
     */
    public read(buffer?: string[], index?: number, count?: number): string|number
    {
      if (arguments.length === 3)
      {
        return super.read(buffer, index, count);
      }
      
      return this._document.read();
    }
    
    /**
     * Seeks the buffer
     * @function
     * @param {number} The number of characters to seek
     */
    public seek(count: number): void
    {
      this.position += count;
    }
    
    /**
     * Returns the current buffer as a text document.
     * @returns {ITextDocument}
     */
    public toDocument(): ITextDocument
    {
      return this;
    }
  }
}