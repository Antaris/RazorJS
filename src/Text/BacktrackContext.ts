/// <reference path="../SourceLocation.ts" />

namespace Razor.Text
{
  /**
   * Represents a context for backtracking
   * @class
   */
  export class BacktrackContext
  {
    /**
     * Initialises a new instance of a backtrack context
     * @constructor
     * @param {SourceLocation} location - The source location
     * @param {number} [bufferIndex] - The buffer index.
     */
    constructor(public location: SourceLocation, public bufferIndex?: number)
    {
      this.bufferIndex = this.bufferIndex || 0;
    }
  }
}