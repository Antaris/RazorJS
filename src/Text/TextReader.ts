/// <reference path="../Internals/IDisposable.ts" />

namespace Razor.Text
{
  var EOF: number = -1;
  
  /**
   * Provides a base implementation of a text reader
   * @class
   */
  export class TextReader implements IDisposable
  {    
    /**
     * Disposes of the instance.
     */
    public dispose(): void
    {
      
    }
    
    /**
     * Peeks at the next character in the stream.
     * @function
     * @returns {string|number}
     */
    public peek(): string|number
    {
      return EOF;
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
        var n: number = 0, ch: string|number;
        do
        {
          ch = this.read();
          if (ch === EOF)
          {
            break;
          }
          buffer[index + n++] = <string>ch;
        }
        while (n < count);
        return n;
      }
      
      return EOF;
    }
    
    /**
     * Block version of read
     * @function
     * @param {string[]} buffer - The output buffer
     * @param {number} index - The start index
     * @param {number} count - The number of characters to read
     * @returns {number}
     */
    public readBlock(buffer: string[], index: number, count: number): number
    {
      var i: number, n: number = 0;
      do
      {
        n += (i = <number>this.read(buffer, index + n, count - n));
      }
      while (i > 0 && n < count);
      return n;
    }
    
    /**
     * Reads the next line from the stream.
     * @function
     * @returns {string}
     */
    public readLine(): string
    {
      var buffer: string[] = [], ch: string|number;
      while (true)
      {
        ch = this.read();
        if (ch === EOF)
        {
          break;
        }
        if (ch === '\r' || ch === '\n')
        {
          if (ch === '\r' && this.peek() === '\n')
          {
            this.read();
          }
          return buffer.join('');
        }
        buffer.push(<string>ch);
      }
      if (buffer.length)
      {
        return buffer.join('');
      }
      return null;
    }
    
    /**
     * Reads to the end of the stream
     * @function
     * @returns {string}
     */
    public readToEnd(): string
    {
      var size = 4096;
      var buffer: string[] = <string[]>(new Array(size)),
          len: number, 
          res: string[] = [];
          
      while ((len = <number>this.read(buffer, 0, size)) !== 0)
      {
        res = res.concat(buffer.slice(0, len));
      }
      return res.join('');
    }
  }
}