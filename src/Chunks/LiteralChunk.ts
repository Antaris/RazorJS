/// <reference path="Chunk.ts" />

namespace Razor.Chunks
{
  /**
   * Represents a literal chunk.
   */
  export class LiteralChunk extends Chunk
  {
    /**
     * Gets or sets the text of the literal chunk
     * @property
     * @type {string}
     */
    public text: string;
    
    /**
     * Returns the string representation of this literal chunk
     * @function
     * @returns {string}
     */
    public toString(): string
    {
      return [this.start.toString(), ' = ', this.text].join('');
    }
  }
}