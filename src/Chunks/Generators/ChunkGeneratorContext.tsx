/// <reference path="../ChunkTreeBuilder.ts" />

namespace Razor.Chunks.Generators
{
  /**
   * Provides a context for chunk generation
   * @class
   */
  export class ChunkGeneratorContext
  {    
    /**
     * Initialises a new instance of a chunk generator context
     * @constructor
     * @param {ChunkGeneratorContext} [context] - The existing context
     */
    constructor(context?: ChunkGeneratorContext)
    {
      if (!context)
      {
        this.chunkTreeBuilder = new ChunkTreeBuilder();
      }
      else
      {
        this.chunkTreeBuilder = context.chunkTreeBuilder;
      }
    }
    
    /**
     * Gets or sets the chunk tree builder.
     * @property
     * @type {ChunkTreeBuilder}
     */
    public chunkTreeBuilder: ChunkTreeBuilder;
  }
}