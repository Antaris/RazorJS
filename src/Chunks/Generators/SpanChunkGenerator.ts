/// <reference path="ChunkGeneratorContext.ts" />
/// <reference path="ISpanChunkGenerator.ts" />
/// <reference path="../../Parser/SyntaxTree/Span.ts" />

namespace Razor.Chunks.Generators
{
  import Span = Razor.Parser.SyntaxTree.Span;
  
  /**
   * Provides a base implementation of a span chunk generator
   * @class
   */
  export class SpanChunkGenerator implements ISpanChunkGenerator
  {    
    /**
     * Gets the runtime type name for the current instance.
     * @function
     * @returns {string}
     */
    public get runtimeTypeName(): string
    {
      return "SpanChunkGenerator";
    }
    
    /**
     * Generates the chunk for the given span
     * @function
     * @param {Span} span - The span
     * @param {ChunkGeneratorContext} context - The chunk generator context.
     */
    public generateChunk(span: Span, context: ChunkGeneratorContext): void
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
      
      if (!(other instanceof SpanChunkGenerator))
      {
        return false;
      }
      
      return this.runtimeTypeName === (<SpanChunkGenerator>other).runtimeTypeName;
    }
    
    /**
     * Returns the string representation of this span chunk generator.
     */
    public toString(): string
    {
      var typeName = this.runtimeTypeName;
      return (typeName === "SpanChunkGenerator" ? "None" : typeName);
    }
  }
}