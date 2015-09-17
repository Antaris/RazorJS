namespace Razor.Tokenizer.Symbols
{
  /**
   * Defines the possible JavaScript symbol types
   * @enum
   */
  export enum JavaScriptSymbolType
  {
    Unknown,
    Identifier,
    Keyword,
    Transition,
    IntegerlLiteral,
    BinaryLiteral,
    OctalLiteral,
    HexLiteral,
    RealLiteral,
    StringLiteral,
    RegularExpressionLiteral,
    NewLine,
    WhiteSpace,
    Comment,
    
    Dot,                              // .
    Assignment,                       // =
    LeftBracket,                      // [
    RightBracket,                     // ]
    LeftParen,                        // (
    RightParen,                       // )
    LeftBrace,                        // {
    RightBrace,                       // }
    Plus,                             // +
    Minus,                            // -
    Modulo,                           // %
    Increment,                        // ++
    Decrement,                        // --
    BitwiseNot,                       // ~
    LogicalNot,                       // !
    Divide,                           // /
    Multiply,                         // *
    Exponentiation,                   // **
    LessThan,                         // <
    LessThanEqualTo,                  // <=
    GreaterThan,                      // >
    GreaterThenEqualTo,               // >=,
    Equal,                            // ==
    StrictEqual,                      // ===
    NotEqual,                         // !=
    StrictNotEqual,                   // !==,
    BitwiseLeftShift,                 // <<
    BitwiseRightShift,                // >>
    BitwiseUnsignedRightShift,        // >>>
    BitwiseAnd,                       // &
    BitwiseOr,                        // |
    BitwiseXor,                       // ^
    LogicalAnd,                       // &&
    LogicalOr,                        // ||
    QuestionMark,                     // ?
    Colon,                            // :
    MultiplicationAssignment,         // *=,
    DivisionAssignment,               // /=
    ModuloAssignment,                 // %=
    AdditionAssignment,               // +=
    SubtractionAssignment,            // -=,
    BitwiseLeftShiftAssignment,       // <<=
    BitwiseRightShiftAssignment,      // >>=
    BitwiseUnsignedRightShiftAssignment,// >>>=
    BitwiseAndAssignment,             // &=
    BitwiseOrAssignment,              // |=
    BitwiseXorAssignment,             // ^=
    Comma,                            // ,
    DoubleQuote,                      // "
    SingleQuote,                      // '
    Backslash,                        // \
    Semicolon,                        // ;
    
    RazorCommentTransition,
    RazorCommentStar,
    RazorComment
  }
}