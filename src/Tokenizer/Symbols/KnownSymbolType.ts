namespace Razor.Tokenizer.Symbols
{
  /**
   * Defiines common well-known symbol types.
   * @enum
   */
  export enum KnownSymbolType
  {
    WhiteSpace,
    Newline,
    Identifier,
    Keyword,
    Transition,
    Unknown,
    CommentStart,
    CommentStar,
    CommentBody
  }
}