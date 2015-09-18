namespace Razor.Parser.SyntaxTree
{
  /**
   * Defines the possibe block types
   * @enum
   */
  export enum BlockType
  {
    // Code
    Statement,
    Directive,
    Functions,
    Expression,
    Helper,
    
    // Markup
    Markup,
    Section,
    Template,
    
    // Special
    Comment,
    Tag
  }
}