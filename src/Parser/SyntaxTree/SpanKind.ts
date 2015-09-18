namespace Razor.Parser.SyntaxTree
{
  /**
   * Represents the possible span kinds.
   * @enum
   */
  export enum SpanKind
  {
    Transition,
    MetaCode,
    Comment,
    Code,
    Markup
  }
}