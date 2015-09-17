namespace Razor.Tokenizer.Symbols
{
  /**
   * Represents the possible HTML symbol types.
   * @enum
   */
  export enum HtmlSymbolType
  {
    Unknown,
    Text, // Text which isn't one of the below
    WhiteSpace,
    NewLine,
    OpenAngle,
    Bang,
    ForwardSlash,
    QuestionMark,
    DoubleHyphen,
    LeftBracket,
    CloseAngle,
    RightBracket,
    Equals,
    DoubleQuote,
    SingleQuote,
    Transition,
    Colon,
    RazorComment,
    RazorCommentStar,
    RazorCommentTransition
  }
}