/// <reference path="LookaheadTextReader.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="../Internals/IDisposable.ts" />
/// <reference path="LookaheadToken.ts" />
/// <reference path="ITextBuffer.ts" />
/// <reference path="BacktrackContext.ts" />
/// <reference path="SourceLocationTracker.ts" />

namespace Razor.Text
{
  var EOF: number = -1;
  
  /**
   * Provides read services for text buffers
   */
  export class TextBufferReader extends LookaheadTextReader
  {
    private _bookmarks: BacktrackContext[] = [];
    private _tracker: SourceLocationTracker = new SourceLocationTracker();
    private _buffer: ITextBuffer;
    
    /**
     * Initialises a new instance of a text buffer reader
     * @constructor
     * @param {ITextBuffer} buffer - The text buffer
     */
    constructor(buffer: ITextBuffer)
    {
      super();
      
      this._buffer = buffer;
    }
    
    /**
     * Gets the text buffer
     * @readonly
     * @returns {ITextBuffer}
     */
    public get buffer(): ITextBuffer
    {
      return this._buffer;
    }
    
    /**
     * Gets the source location
     * @readonly
     * @returns {SourceLocation}
     */
    public get currentLocation(): SourceLocation
    {
      return this._tracker.currentLocation;
    }
    
    /** 
     * Begins a lookahead operation
     * @function
     * @returns {IDisposable}
     */
    public beginLookahead(): IDisposable
    {
      var context = new BacktrackContext(this.currentLocation);
      this._bookmarks.push(context);
      
      return new DisposableAction(() => 
      {
        this.endLookahead(context);  
      });
    }
    
    /**
     * Cancels a backtrack operation
     * @function
     */
    public cancelBacktrack(): void
    {
      this._bookmarks.pop();
    }
    
    /**
     * Ends a lookahead operation
     * @param {BacktrackContext} context - The backtrack context
     */
    private endLookahead(context: BacktrackContext): void
    {
      if (this._bookmarks.length > 0 && this._bookmarks[this._bookmarks.length -1] === context)
      {
        this._bookmarks.pop();
        this._tracker.currentLocation = context.location;
        this._buffer.position = context.location.absoluteIndex;
      }
    }
    
    /**
     * Disposes of the instance.
     * @function
     */
    public dispose(): void
    {
      var dis = <Function>this._buffer['dispose'];
      if (!!dis)
      {
        dis.apply(this._buffer, []);
      }
    }
    
    /**
     * Peeks at the next character in the buffer
     * @function
     * @returns {string|number}
     */
    public peek(): string|number
    {
      return this._buffer.peek();
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
      
      var read = this._buffer.read();
      if (read !== EOF)
      {
        var nextChar: string = '\0', next: string|number = this.peek();
        if (next !== EOF)
        {
          nextChar = <string>next; 
        }
        this._tracker.updateLocation(<string>read, nextChar);
      }
      return read;
    }
  }
}