/// <reference path="TextReader.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="../Internals/IDisposable.ts" />

namespace Razor.Text
{
  /**
   * Represents a text reader that supports lookahead operations.
   */
  export class LookaheadTextReader extends TextReader
  {
    /**
     * Gets the current location
     */
    public get currentLocation(): SourceLocation
    {
      return null;
    }
    
    /** 
     * Begins a lookahead operation
     */
    public beginLookahead(): IDisposable
    {
      return null;
    }
    
    /**
     * Cancels a backtrack operation
     */
    public cancelBacktrack(): void
    {
      
    }
  }
}