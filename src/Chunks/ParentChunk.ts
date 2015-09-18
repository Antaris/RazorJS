/// <reference path="Chunk.ts" />

namespace Razor.Chunks
{
  /**
   * Represents a parent chunk
   * @class
   */
  export class ParentChunk extends Chunk
  {
    /**
     * Gets or sets the children of the current chunk
     * @property
     * @type {Chunk[]}
     */
    public children: Chunk[] = [];
  }
}