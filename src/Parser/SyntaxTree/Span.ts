/// <reference path="../../SourceLocation.ts" />

namespace Razor.Parser.SyntaxTree
{
  /**
   * Represents a span of content in a syntax tree
   */
  export class Span
  {
    public content: string;
    public start: SourceLocation;
  }
}