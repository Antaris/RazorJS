/// <reference path="../Tokenizer/HtmlTokenizer.ts" />
/// <reference path="../Tokenizer/Symbols/HtmlSymbol.ts" />
/// <reference path="../Tokenizer/Symbols/HtmlSymbolType.ts" />
/// <reference path="../Tokenizer/Symbols/KnownSymbolType.ts" />
/// <reference path="LanguageCharacteristics.ts" />"
/// <reference path="../Text/ITextDocument.ts" />

namespace Razor.Parser
{
  import HtmlTokenizer = Razor.Tokenizer.HtmlTokenizer;
  import HtmlSymbol = Razor.Tokenizer.Symbols.HtmlSymbol;
  import HtmlSymbolType = Razor.Tokenizer.Symbols.HtmlSymbolType;
  import KnownSymbolType = Razor.Tokenizer.Symbols.KnownSymbolType;
  import ITextDocument = Razor.Text.ITextDocument;
  
  /**
   * Represents characteristics of the HTML language
   * @class
   */
  export class HtmlLanguageCharacteristics extends LanguageCharacteristics<HtmlTokenizer, HtmlSymbol, HtmlSymbolType>
  {
    public static Instance: HtmlLanguageCharacteristics = new HtmlLanguageCharacteristics();
    
    /**
     * Creates a marker symbol for the given location
     * @function
     * @param {SourceLocation} The marker location
     * @returns {HtmlSymbol}
     */
    public createMarkerSymbol(location: SourceLocation): HtmlSymbol
    {
      return new HtmlSymbol(location, '', HtmlSymbolType.Unknown);
    }
    
    /**
     * Creates a new symbol
     * @function
     * @param {SourceLocation} location - The start location
     * @param {string} content - The symbol content
     * @param {TSymbolType} type - The symbol type
     * @param {RazorError[]} errors - The set of errors
     * @returns {TSymbol}
     */
    public createSymbol(location: SourceLocation, content: string, type: HtmlSymbolType, errors: RazorError[]): HtmlSymbol
    {
      return new HtmlSymbol(location, content, type, errors);
    }
    
    /**
     * Creates a tokenizer from the given source
     * @function
     * @param {ITextDocument} source - The text document
     * @returns {HtmlTokenizer};
     */
    public createTokenizer(source: ITextDocument): HtmlTokenizer
    {
      return new HtmlTokenizer(source);
    }
    
    /**
     * Returns the lexically opposite bracket for the given symbol.
     * @function
     * @param {HtmlSymbolType} bracket - The input bracket
     * @returns {HtmlSymbolType}
     */
    public flipBracket(bracket: HtmlSymbolType): HtmlSymbolType
    {
      switch (bracket)
      {
        case HtmlSymbolType.LeftBracket: return HtmlSymbolType.RightBracket;
        case HtmlSymbolType.OpenAngle: return HtmlSymbolType.CloseAngle;
        case HtmlSymbolType.RightBracket: return HtmlSymbolType.LeftBracket;
        case HtmlSymbolType.CloseAngle: return HtmlSymbolType.OpenAngle;
        default: return HtmlSymbolType.Unknown;
      }
    }
    
    /**
     * Returns the symbol type id
     * @function
     * @param {KnownSymbolType} type - The known symbol type
     * @returns {TSymbolType}
     */
    public getKnownSymbolType(type: KnownSymbolType): HtmlSymbolType
    {
      switch (type)
      {
        case KnownSymbolType.CommentStart: return HtmlSymbolType.RazorCommentTransition;
        case KnownSymbolType.CommentStar: return HtmlSymbolType.RazorCommentStar;
        case KnownSymbolType.CommentBody: return HtmlSymbolType.RazorComment;
        case KnownSymbolType.Identifier: return HtmlSymbolType.Text;
        case KnownSymbolType.Keyword: return HtmlSymbolType.Text;
        case KnownSymbolType.NewLine: return HtmlSymbolType.NewLine;
        case KnownSymbolType.Transition: return HtmlSymbolType.Transition;
        case KnownSymbolType.WhiteSpace: return HtmlSymbolType.WhiteSpace;
        default: HtmlSymbolType.Unknown;
      } 
    }
  }
}