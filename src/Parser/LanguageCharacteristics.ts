/// <reference path="../Tokenizer/Symbols/ISymbol.ts" />
/// <reference path="../Tokenizer/Symbols/SymbolBase.ts" />
/// <reference path="../Tokenizer/Symbols/KnownSymbolType.ts" />
/// <referemce path="../Tokenizer/Tokenizer.ts" />
/// <referemce path="../Tokenizer/ITokenizer.ts" />
/// <reference path="../Text/ITextDocument.ts" />
/// <reference path="../Text/SeekableTextReader.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="../Internals/Using.ts" />
/// <reference path="../Internals/Tuple.ts" />
/// <reference path="../RazorError.ts" />
/// <reference path="../Text/SourceLocationTracker.ts" />

namespace Razor.Parser
{
  import ITokenizer = Razor.Tokenizer.ITokenizer;
  import Tokenizer = Razor.Tokenizer.Tokenizer;
  import ISymbol = Razor.Tokenizer.Symbols.ISymbol;
  import SymbolBase = Razor.Tokenizer.Symbols.SymbolBase;
  import KnownSymbolType = Razor.Tokenizer.Symbols.KnownSymbolType;
  import ITextDocument = Razor.Text.ITextDocument;
  import SeekableTextReader = Razor.Text.SeekableTextReader;
  import SourceLocationTracker = Razor.Text.SourceLocationTracker;
  import using = Razor.Using;
  import Tuple = Razor.Tuple;
  
  /**
   * Represents characteristics of a language that can be parsed by Razor
   * @class
   */
  export class LanguageCharacteristics<TTokenizer extends ITokenizer, TSymbol extends ISymbol, TSymbolType>
  {
    /**
     * Creates a marker symbol for the given location
     * @function
     * @param {SourceLocation} The marker location
     * @returns {TSymbol}
     */
    public createMarkerSymbol(location: SourceLocation): TSymbol
    {
      return null;
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
    public createSymbol(location: SourceLocation, content: string, type: TSymbolType, errors: RazorError[]): TSymbol
    {
      return null;
    }
    
    /**
     * Creates a tokenizer from the given source
     * @function
     * @param {ITextDocument} source - The text document
     * @returns TTokenizer;
     */
    public createTokenizer(source: ITextDocument): TTokenizer
    {
      return null;
    }
    
    /**
     * Returns the lexically opposite bracket for the given symbol.
     * @function
     * @param {TSymbol} bracket - The input bracket
     * @returns {TSymbol}
     */
    public flipBracket(bracket: TSymbolType): TSymbolType
    {
      return null;
    }
    
    /**
     * Returns the symbol type id
     * @function
     * @param {KnownSymbolType} type - The known symbol type
     * @returns {TSymbolType}
     */
    public getKnownSymbolType(type: KnownSymbolType): TSymbolType
    {
      return null; 
    }
    
    /**
     * Determines if the given symbol represents a comment body
     * @function
     * @param {TSymbol} symbol - The input symbol
     * @returns {boolean}
     */
    public isCommentBody(symbol: TSymbol): boolean
    {
      return this.isKnownSymbolType(symbol, KnownSymbolType.CommentBody);
    }
    
    /**
     * Determines if the given symbol represents a comment star
     * @function
     * @param {TSymbol} symbol - The input symbol
     * @returns {boolean}
     */
    public isCommentStar(symbol: TSymbol): boolean
    {
      return this.isKnownSymbolType(symbol, KnownSymbolType.CommentStar);
    }
    
    /**
     * Determines if the given symbol represents a comment start
     * @function
     * @param {TSymbol} symbol - The input symbol
     * @returns {boolean}
     */
    public isCommentStart(symbol: TSymbol): boolean
    {
      return this.isKnownSymbolType(symbol, KnownSymbolType.CommentStart);
    }
    
    /**
     * Determines if the given symbol represents an identifier
     * @function
     * @param {TSymbol} symbol - The input symbol
     * @returns {boolean}
     */
    public isIdentifier(symbol: TSymbol): boolean
    {
      return this.isKnownSymbolType(symbol, KnownSymbolType.Identifier);
    }
    
    /**
     * Determines if the given symbol represents a keyword
     * @function
     * @param {TSymbol} symbol - The input symbol
     * @returns {boolean}
     */
    public isKeyword(symbol: TSymbol): boolean
    {
      return this.isKnownSymbolType(symbol, KnownSymbolType.Keyword);
    }
    
    /**
     * Determines if the given symbol represents a known symbol type
     * @function
     * @param {TSymbol} symbol - The input symbol
     * @returns {boolean}
     */
    public isKnownSymbolType(symbol: TSymbol, type: KnownSymbolType): boolean
    {
      return !!symbol && (symbol.type === this.getKnownSymbolType(type));
    }
    
    /**
     * Determines if the given symbol represents a new line
     * @function
     * @param {TSymbol} symbol - The input symbol
     * @returns {boolean}
     */
    public isNewLine(symbol: TSymbol): boolean
    {
      return this.isKnownSymbolType(symbol, KnownSymbolType.NewLine);
    }
    
    /**
     * Determines if the given symbol represents a transition
     * @function
     * @param {TSymbol} symbol - The input symbol
     * @returns {boolean}
     */
    public isTransition(symbol: TSymbol): boolean
    {
      return this.isKnownSymbolType(symbol, KnownSymbolType.Transition);
    }
    
    /**
     * Determines if the given symbol represents an unknown symbol
     * @function
     * @param {TSymbol} symbol - The input symbol
     * @returns {boolean}
     */
    public isUnknown(symbol: TSymbol): boolean
    {
      return this.isKnownSymbolType(symbol, KnownSymbolType.Unknown);
    }
    
    /**
     * Determines if the given symbol represents a comment body
     * @function
     * @param {TSymbol} symbol - The input symbol
     * @returns {boolean}
     */
    public isWhiteSpace(symbol: TSymbol): boolean
    {
      return this.isKnownSymbolType(symbol, KnownSymbolType.WhiteSpace);
    }
    
    /**
     * Determines if the current language knows the given symbol
     * @function
     * @param {KnownSymbolType} type - The symbol type
     * @returns {boolean}
     */
    public knowsSymbolType(type: KnownSymbolType): boolean
    {
      return type === KnownSymbolType.Unknown || (this.getKnownSymbolType(type) === this.getKnownSymbolType(KnownSymbolType.Unknown));
    }
    
    /**
     * Splits the given symbol into two symbols.
     * @function
     * @param {TSymbol} symbol - The symbol to split
     * @param {number} splitAt - The index at which to split the symbol
     * @param {TSymbolType} leftType - The new symbol type of the left-most symbol
     * @returns {Tuple<TSymbol, TSymbol>}
     */
    public splitSymbol(symbol: TSymbol, splitAt: number, leftType: TSymbolType): Tuple<TSymbol, TSymbol>
    {
      var left = this.createSymbol(symbol.start, symbol.content.substr(0, splitAt), leftType, []);
      var right: TSymbol = null;
      if (splitAt < symbol.content.length)
      {
        right = this.createSymbol(SourceLocationTracker.calculateNewLocation(symbol.start, left.content), symbol.content.substr(splitAt), symbol.type, symbol.errors);
      }
      return new Tuple<TSymbol, TSymbol>(left, right);
    }
    
    /**
     * Tokenizes the given string, offsetting the generated tokens from the given start.
     * @function
     * @param {SourceLocation|string} startOrInput - The start location, or the input
     * @param {string} [input] - The input string
     * @returns {TSymbol[]}
     */
    public tokenizeString(startOrInput: SourceLocation|string, input?: string): TSymbol[]
    {
      var start: SourceLocation;
      if (startOrInput instanceof SourceLocation)
      {
        start = <SourceLocation>startOrInput;
      }
      else
      {
        input = <string>startOrInput;
        start = SourceLocation.Zero;
      }
      
      var results: TSymbol[] = [];
      var reader = new SeekableTextReader(input);
      using (reader, () =>
      {
        var tok = this.createTokenizer(reader);
        var sym: TSymbol;
        while ((sym = <TSymbol>tok.nextSymbol()) !== null)
        {
          sym.offsetStart(start);
          results.push(sym);
        }
      });
      
      return results;
    }
  }
}