/// <reference path="TextReader.ts" />
/// <reference path="ITextBuffer.ts" />
/// <reference path="ITextDocument.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="LineTrackingStringBuffer.ts" />
/// <reference path="CharacterReference.ts" />

namespace Razor.Text
{
  var EOF: number = -1;
  
  export class SeekableTextReader extends TextReader implements ITextDocument
  {
    private _position: number = 0;
    private _buffer: LineTrackingStringBuffer = new LineTrackingStringBuffer();
    private _location: SourceLocation = SourceLocation.Zero;
    private _current: string;
    
    /**
     * Initialises a new instance of a seekable text reader
     * @constructor
     * @param {string|TextReader|ITextBuffer} content - The content 
     */
    constructor(content: string|TextReader|ITextBuffer)
    {
      super();
      
      if (content instanceof TextReader)
      {
        content = (<TextReader>content).readToEnd();
      }
      else if (typeof content === "object") // ITextBuffer
      {
        content = (<ITextBuffer>content).readToEnd();
      }
      
      this._buffer.append(<string>content);
      this.updateState();
    }
    
    /**
     * Gets the buffer
     * @property
     * @readonly
     * @returns {LineTrackingStringBuffer}
     */
    public get buffer(): LineTrackingStringBuffer
    {
      return this._buffer;
    }
    
    /**
     * Gets the location
     * @property
     * @readonly
     * @returns {SourceLocation}
     */
    public get location(): SourceLocation
    {
      return this._location;
    }
    
    /**
     * Gets the length of the stream.
     */
    public get length(): number
    {
      return this._buffer.length;
    }
    
    /**
     * Gets or sets the position
     * @property
     * @returns {number}
     */
    public get position(): number
    {
      return this._position;
    }
    
    /**
     * @param {number} value - The position
     */
    public set position(value: number)
    {
      if (this._position !== value)
      {
        this._position = value;
        this.updateState();
      }
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
     * Peeks at the next character in the buffer
     * @function
     * @returns {string|number}
     */
    public peek(): string|number
    {
      if (!this._current)
      {
        return EOF;
      }
      
      return this._current;
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
      
      if (!this._current)
      {
        return EOF;
      }
      
      var chr = this._current;
      this._position++;
      this.updateState();
      return chr;
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
     * Updates the internal state of the reader.
     */
    private updateState(): void
    {
      if (this._position < this._buffer.length)
      {
        var ref = this._buffer.charAt(this._position);
        this._current = ref.character;
        this._location = ref.location;
      }
      else if (this._buffer.length === 0)
      {
        this._current = null;
        this._location = SourceLocation.Zero;
      }
      else
      {
        this._current = null;
        this._location = this._buffer.endLocation;
      }
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