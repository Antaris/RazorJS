/// <reference path="Chunk.ts" />

namespace Razor.Chunks
{
  /**
   * Represents a tree of chunks
   * @class
   */
  export class ChunkTree
  {
    /**
     * Gets or sets the set of chunks
     * @property
     * @type {Chunk[]}
     */
    public chunks: Chunk[] = [];
  }
}