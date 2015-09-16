/// <reference path="../Text/ITextBuffer.ts" />

namespace Razor.Tests
{
  import ITextBuffer = Razor.Text.ITextBuffer;
  
  var EOF = -1;
  
  /**
   * Provides a test class implementation of a text buffer.
   * @class
   */
  export class StringTextBuffer implements ITextBuffer
  {
    private _position: number;
    private _length: number;
    private _buffer: string;
    
    /**
     * Initialises a new instance of a string text buffer
     * @constructor
     * @param {string} [buffer] - The buffer content.
     */
    constructor(buffer?: string)
    {
      this._buffer = buffer || '';
      this._position = 0;
      this._length = this._buffer.length;
    }
    
    /**
     * Gets the length of the buffer
     * @property
     * @returns {number}
     * @readonly
     */
    public get length(): number
    {
      return this._length;
    }
    
    /**
     * Gets or sets the position in the buffer
     * @property
     * @returns {number}
     */
    public get position(): number
    {
      return this._position;
    }
    
    /**
     * @param {number} value - The new position in the buffer
     */
    public set position(value: number)
    {
      this._position = value;
    }
    
    /**
     * Peeks at the next character in the buffer
     * @function
     * @returns {string|number}
     */
    public peek(): string|number
    {
      if (this.position >= this._buffer.length)
      {
        return EOF;
      }
      
      return this._buffer[this.position];
    }
    
    /**
     * Reads the next character from the buffer
     * @function
     * @returns {string|number}
     */
    public read(): string|number
    {
      if (this.position >= this._buffer.length)
      {
        return EOF;
      }
      
      return this._buffer[this.position++];
    }
    
    /**
     * Reads the content to the end of the buffer.
     */
    public readToEnd(): string
    {
      return this._buffer.substr(this.position);
    }
  }
}