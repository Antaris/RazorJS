/// <reference path="../Internals/Environment.ts" />

namespace Razor.Text
{
  import Environment = Razor.Environment;
  
  /**
   * A utility class for building string instances.
   * @class
   */
  export class StringBuilder
  {
    private _buffer: string[];
    
    /**
     * Initialises a new instance of a string builder.
     * @constructor
     * @param {string} content - The starting content of the builder.
     */
    constructor(content?: string)
    {
      if (!!content)
      {
        this._buffer = content.split('');
      }
      else
      {
        this._buffer = [];
      }
    }
    
    /**
     * Gets the length of the buffer
     * @property
     * @readonly
     * @returns {number}
     */
    public get length(): number
    {
      return this._buffer.length;
    }
    
    /**
     * Appends the given content to the buffer.
     * @function
     * @param {string} content - The content to append
     * @param {number} [startIndexOrRepeat] - The start index, or the number of times to append a single character (if calling with two arguments)
     * @param {number} [count] - The number of characters to append.
     */
    public append(content: string, startIndexOrRepeat?: number, count?: number): StringBuilder
    {
      if (!!content && content.length > 1) 
      {
        this.appendCore(content, 0, content.length);
      } 
      else if (!!count)
      {
          this.appendCore(content, startIndexOrRepeat, count);
      }
      else if (!!startIndexOrRepeat)
      {
        for (var i = 0; i < startIndexOrRepeat; i++)
        {
          this.appendCore(content[0], 0, 1);
        } 
      }
      else if (!!content)
      {
        this.appendCore(content[0], 0, 1);
      }
      return this;
    }
    
    /**
     * Appends the given content followed by a new line to the string builder.
     * @function
     * @param {string} content - The content to append
     * @returns {StringBuilder}
     */
    public appendLine(content: string): StringBuilder
    {
      return this.append((content || '') + Environment.NewLine);
    }
    
    private appendCore(content: string, startIndex: number, count: number)
    {
      for (var i = startIndex; i < content.length && i < (startIndex + count); i++)
      {
        this._buffer.push(content[i]);
      }
    }
    
    /**
     * Gets the character at the given index.
     * @function
     * @param {number} index - The index
     * @returns {string}
     */
    public charAt(index: number) : string
    {
      if (index >= this.length)
      {
        throw "Index out of range: " + index;
      }
      
      return this._buffer[index];
    }
    
    /**
     * Clears the string builder.
     * @function
     */
    public clear(): void
    {
      this._buffer = [];
    }
    
    /**
     * Returns the content of the buffer
     * @function
     * @returns {string}
     */
    public toString(): string
    {
      return this._buffer.join("");
    }
  }
}