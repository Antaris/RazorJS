/// <reference path="BacktrackContext.ts" />
/// <reference path="SourceLocationTracker.ts" />
/// <reference path="TextReader.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="../Internals/DisposableAction.ts" />
/// <reference path="LookaheadTextReader.ts" />
/// <reference path="StringBuilder.ts" />

namespace Razor.Text
{
  var EOF: number = -1;
  
  /**
   * Provides buffered reading from a text reader
   * @class
   */
  export class BufferingTextReader extends LookaheadTextReader
  {
    private _backtrackStack: BacktrackContext[] = [];
    private _currentBufferPosition: number;
    private _currentCharacter: string|number;
    private _locationTracker: SourceLocationTracker;
    private _source: TextReader;
    
    /**
     * Initialises a new instance of a buffered text reader
     * @constructor
     * @param {TextReader} source - The text reader
     */
    constructor(source: TextReader)
    {
      super();
      
      this.buffer = null;
      this._source = source;
      this._locationTracker = new SourceLocationTracker();
      
      this.updateCurrentCharacter();
    }
    
    /**
     * Gets or sets the buffer
     * @property
     * @returns {string[]}
     */
    public buffer: StringBuilder;
    
    /**
     * Gets or sets whether we are currently buffering
     * @property
     * @returns {boolean}
     */
    public buffering: boolean;
    
    /**
     * Gets the current character
     * @property
     * @returns {string|number}
     */
    public get currentCharacter(): string|number
    {
      return this._currentCharacter;
    }
    
    /**
     * Gets the current location
     * @property
     * @returns {SourceLocation}
     */
    public get currentLocation(): SourceLocation
    {
      return this._locationTracker.currentLocation;
    }
    
    /**
     * Gets the inner reader
     * @property
     * @returns {TextReader}
     */
    public get innerReader(): TextReader
    {
      return this._source;
    }
    
    /** 
     * Begins a lookahead operation
     * @function
     * @returns {IDisposable}
     */
    public beginLookahead(): IDisposable
    {
      // Is this our first lookahead?
      if (this.buffer === null)
      {
        // Start the backtrack buffer
        this.buffer = new StringBuilder();
      }
      
      if (!this.buffering)
      {
        // We're not already buffering, so we need to expand the buffer to hold the first character
        this.expandBuffer();
        this.buffering = true;
      }
      
      var context = new BacktrackContext(this.currentLocation, this._currentBufferPosition);
      this._backtrackStack.push(context);
      
      return new DisposableAction(() => this.endLookahead(context), this);
    }
    
    /**
     * Cancels a backtrack operation.
     * @function
     */
    public cancelBacktrack(): void
    {
      this._backtrackStack.pop();
    }
    
    /**
     * Disposes of the instance.
     */
    public dispose(): void
    {
      this._source.dispose();
      super.dispose();  
    }
    
    /**
     * Ends a lookahead operation
     * @function
     * @param {BacktrackContext} context - The backtract context
     */
    private endLookahead(context: BacktrackContext): void
    {
      if (this._backtrackStack.length > 0 && this._backtrackStack[this._backtrackStack.length - 1] === context)
      {
        this._backtrackStack.pop();
        this._currentBufferPosition = context.bufferIndex;
        this._locationTracker.currentLocation = context.location;
        
        this.updateCurrentCharacter();
      }
    }
    
    /**
     * Expands the buffer
     * @function
     * @returns {boolean}
     */
    private expandBuffer(): boolean
    {
      // Pull another character into the buffer and update the position
      var ch = this.innerReader.read();
      
      // Only append the character to the buffer if there actually is one
      if (ch !== EOF)
      {
        this.buffer.append(<string>ch);
        this._currentBufferPosition = this.buffer.length - 1;
        return true;
      }
      
      return false;
    }
    
    /**
     * Reads the next character from the stream
     * @function
     */
    private nextCharacter(): void
    {
      var prevChar = this.currentCharacter;
      if (prevChar === EOF)
      {
        // We're at the end of the source
        return;
      }
      
      if (this.buffering)
      {
        if (this._currentBufferPosition >= this.buffer.length - 1)
        {
          // If there are no more lookaheads (thus no need to continue with the buffer), we can just clean up the buffer
          if (this._backtrackStack.length === 0)
          {
            this.buffer.clear();
            this._currentBufferPosition = 0;
            this.buffering = false;
          }
          else if (!this.expandBuffer())
          {
            // Failed to expand the buffer, because we're at teh end of the source
            this._currentBufferPosition = this.buffer.length; // Force the position past the end of the buffer
          }
        }
        else
        {
          // Not at the end yet so just advance the buffer
          this._currentBufferPosition++;
        }
      }
      else
      {
        this.innerReader.read();
      }
      
      this.updateCurrentCharacter();
      this._locationTracker.updateLocation(<string>prevChar, <string>this.currentCharacter);
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
      
      var chr = this.currentCharacter;
      this.nextCharacter();
      return chr;
    }
    
    /**
     * Peeks at the next character in stream
     * @function
     * @returns {string|number}
     */
    public peek(): string|number
    {
      return this.currentCharacter;
    }
    
    /**
     * Updates the current character based on the internal state of the reader
     * @function
     */
    private updateCurrentCharacter(): void
    {
      if (this.buffering && this._currentBufferPosition < this.buffer.length)
      {
        this._currentCharacter = this.buffer.charAt(this._currentBufferPosition);
      } 
      else
      {
        this._currentCharacter = this.innerReader.peek();
      }
    }
  }
}