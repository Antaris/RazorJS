/// <reference path="../../Internals/IEquatable.ts" />
/// <reference path="ChunkGeneratorContext.ts" />
/// <reference path="../../Parser/SyntaxTree/Span.ts" />

namespace Razor.Chunks.Generators
{
  import Span = Razor.Parser.SyntaxTree.Span;
  
  /**
   * Defines the required contract for implementing a span chunk generator
   * @interface
   */
  export interface ISpanChunkGenerator
  {    
    /**
     * Generates the chunk for the given span
     * @function
     * @param {Span} span - The span
     * @param {ChunkGeneratorContext} context - The chunk generator context.
     */
    generateChunk(span: Span, context: ChunkGeneratorContext): void;
    
    /**
     * Determines if the given object is equal to the current object
     * @function
     * @param {any} other - The other object
     * @returns {boolean}
     */
    equals(other: any): boolean;
  }
}