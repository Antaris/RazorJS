/// <reference path="ChunkGeneratorContext.ts" />
/// <reference path="../../Parser/SyntaxTree/Block.ts" />

namespace Razor.Chunks.Generators
{
  import Block = Razor.Parser.SyntaxTree.Block;
  
  /**
   * Defines the required contract for implementing a parent chunk generator
   * @interface
   */
  export interface IParentChunkGenerator
  {
    /**
     * Generates the start parent chunk for the given block
     * @function
     * @param {Block} block - The block
     * @param {ChunkGeneratorContext} context - The chunk generator context.
     */
    generateStartParentChunk(block: Block, context: ChunkGeneratorContext): void;

    /**
     * Generates the end parent chunk for the given block
     * @function
     * @param {Block} block - The block
     * @param {ChunkGeneratorContext} context - The chunk generator context.
     */
    generateEndParentChunk(block: Block, context: ChunkGeneratorContext): void;
    
    /**
     * Determines if the given object is equal to the current object
     * @function
     * @param {any} other - The other object
     * @returns {boolean}
     */
    equals(other: any): boolean;
  }
}