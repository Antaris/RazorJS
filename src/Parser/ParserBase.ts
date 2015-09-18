/// <reference path="ParserContext.ts" />
/// <reference path="SyntaxTree/SpanBuilder.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="../Internals/Tuple.ts" />

namespace Razor.Parser
{
  import SpanBuilder = Razor.Parser.SyntaxTree.SpanBuilder;
  import SourceLocation = Razor.SourceLocation;
  import Tuple = Razor.Tuple;
  
  /**
   * Provides a base implementation of a parser
   * @class
   */
  export class ParserBase
  {
    /**
     * Gets or sets the parser context
     * @property
     * @type {ParserContext}
     */
    public context: ParserContext;
    
    /**
     * Gets whether the parser is a markup parser.
     * @property
     * @readonly
     * @returns {boolean}
     */
    public get isMarkupParser(): boolean
    {
      return false;
    }
    
    /**
     * Gets the other parser instance.
     * @property
     * @readonly
     * @returns {ParserBase}
     */
    public get otherParser(): ParserBase
    {
      return null;
    }
    
    /**
     * Builds a span using the given builder, source location and content.
     * @function
     * @param {SpanBuilder} span - The span builder
     * @param {SourceLocation} start - The start location
     * @param {string} content - The content of the span
     */
    public buildSpan(span: SpanBuilder, start: SourceLocation, content: string): void
    {
      return null;
    }
    
    /**
     * Parses a block
     */
    public parseBlock(): void { }
    
    /**
     * Parses a document
     * @function
     */
    public parseDocument(): void
    {
      throw "Not a markup parser";
    }
    
    /**
     * Parses a section
     * @function
     * @param {Tuple<string, string>} nestingSequences - The nesting sequences
     * @param {boolean} - caseSensitive - Case sensitive parse?
     */
    public parseSection(nestingSequences: Tuple<string, string>, caseSensitive: boolean): void
    {
      throw "Not a markup parser";
    }
  }
}