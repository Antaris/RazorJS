/// <reference path="../Tokenizer/Symbols/ISymbol.ts" />
/// <reference path="../Tokenizer/Symbols/SymbolBase.ts" />
/// <reference path="../Tokenizer/Symbols/KnownSymbolType.ts" />
/// <referemce path="../Tokenizer/Tokenizer.ts" />
/// <referemce path="../Tokenizer/ITokenizer.ts" />
/// <reference path="../Text/ITextDocument.ts" />
/// <reference path="../Text/SeekableTextReader.ts" />
/// <reference path="../SourceLocation.ts" />

namespace Razor.Parser
{
  import ITokenizer = Razor.Tokenizer.ITokenizer;
  import Tokenizer = Razor.Tokenizer.Tokenizer;
  import ISymbol = Razor.Tokenizer.Symbols.ISymbol;
  import SymbolBase = Razor.Tokenizer.Symbols.SymbolBase;
  import KnownSymbolType = Razor.Tokenizer.Symbols.KnownSymbolType;
  import ITextDocument = Razor.Text.ITextDocument;
  import SeekableTextReader = Razor.Text.SeekableTextReader;
  
  /**
   * Represents characteristics of a language that can be parsed by Razor
   * @class
   */
  export class LanguageCharacteristics<TTokenizer extends ITokenizer, TSymbol extends ISymbol, TSymbolType>
  {
    /**
     * Creates a tokenizer from the given source
     * @function
     * @param {ITextDocument} source - The text document
     * @returns null;
     */
    public createTokenizer(source: ITextDocument): TTokenizer
    {
      return null;
    }
    
    /**
     * Gets a sample string for the given symbol type
     * @function
     * @param {TSymbolType} type - The symbol type
     * @returns {string}
     */
    public getSample(type: TSymbolType): string
    {
      return null;
    }
  }
}