/// <reference path="ChunkGeneratorContext.ts" />
/// <reference path="IParentChunkGenerator.ts" />
/// <reference path="../../Parser/SyntaxTree/Block.ts" />

namespace Razor.Chunks.Generators
{
  import Block = Razor.Parser.SyntaxTree.Block;
  
  /**
   * Provides a base implementation of a parent chunk generator
   * @class
   */
  export class ParentChunkGenerator implements IParentChunkGenerator
  {    
    /**
     * Gets the runtime type name for the current instance.
     * @function
     * @returns {string}
     */
    public get runtimeTypeName(): string
    {
      return "ParentChunkGenerator";
    }
    
    /**
     * Generates the start parent chunk for the given block
     * @function
     * @param {Block} block - The block
     * @param {ChunkGeneratorContext} context - The chunk generator context.
     */
    public generateStartParentChunk(block: Block, context: ChunkGeneratorContext): void
    {
      
    }

    /**
     * Generates the end parent chunk for the given block
     * @function
     * @param {Block} block - The block
     * @param {ChunkGeneratorContext} context - The chunk generator context.
     */
    public generateEndParentChunk(block: Block, context: ChunkGeneratorContext): void
    {
      
    }
    
    /**
     * Determines if the given object is equal to the current object
     * @function
     * @param {any} other - The other object
     * @returns {boolean}
     */
    public equals(other: any): boolean
    {
      if (!other)
      {
        return false;
      }
      
      if (!(other instanceof ParentChunkGenerator))
      {
        return false;
      }
      
      return this.runtimeTypeName === (<ParentChunkGenerator>other).runtimeTypeName;
    }
  }
}