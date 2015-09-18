namespace Razor.Parser.SyntaxTree
{
  /**
   * Defines the accepted characters
   * @enum
   */
  export enum AcceptedCharacters
  {
    None = 0,
    NewLine = 1,
    WhiteSpace = 2,
    NonWhiteSpace = 4,
    AllWhiteSpace = 1 | 2,
    Any = 3 | 4,
    AnyExceptNewLine = 4 | 2
  }
}