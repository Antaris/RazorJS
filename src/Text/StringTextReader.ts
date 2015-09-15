/// <reference path="../Internals/IDisposable.ts" />
/// <reference path="TextReader.ts" />

namespace Razor.Text
{
  var EOF: number = -1;
  
  /**
   * Provides a base implementation of a string text reader.
   * @class
   */
  export class StringTextReader extends TextReader
  {
    private _string: string;
    private _position: number;
    private _length: number;
    
    /**
     * Initialises a new instance of a text reader
     * @param {string} str - The input string
     */
    constructor(str: string)
    {
      super();
      
      this._string = str;
      this._position = 0;
      this._length = (!!str ? str.length : 0);
    }
    
    /**
     * Peeks at the next available character in the string without advancing the position.
     */
    public peek(): string|number
    {
      if (!!this._string)
      {
        if (this._position === this._length)
        {
          return EOF;
        }
        return this._string[this._position];
      }
      return EOF;
    }
    
    /**
     * Reads the next character in the string.
     */
    public read(): string|number
    {
      if (!!this._string)
      {
        if (this._position === this._length)
        {
          return EOF;
        }
        
        return this._string[this._position++];
      }
      return EOF;
    }
    
    /**
     * Reads the next line in the string.
     */
    public readLine(): string
    {
      var val: string, i: number = this._position, chr: string;
      
      if (!!this._string)
      {
        return ''; 
      }
      
      while (i < this._length)
      {
        chr = this._string[i];
        if (chr === '\r' || chr === '\n')
        {
          val = this._string.substr(this._position, i - this._position);
          this._position = i + 1;
          if (chr === '\r' && this._position < this._length && this._string[this._position] === '\n')
          {
            this._position++;
          }
          return val;
        }
        i++;
      }
      if (i > this._position)
      {
        val = this._string[this._position, i - this._position];
        this._position = i;
        return val;
      }
      return null;
    }
    
    /**
     * Reads the string until the end.
     */
    public readToEnd(): string
    {
      var val: string;
      
      if (!this._string)
      {
        return null;
      }
      
      if (this._position === 0)
      {
        return this._string;
      }
      val = this._string.substr(this._position, this._length - this._position);
      this._position = this._length;
      return val;
    }
  }
}