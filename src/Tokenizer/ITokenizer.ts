/// <reference path="Symbols/ISymbol.ts" />
/// <reference path="../Text/ITextDocument.ts" />

namespace Razor.Tokenizer
{
  import ISymbol = Razor.Tokenizer.Symbols.ISymbol;
  import ITextDocument = Razor.Text.ITextDocument;
  
  /**
   * Defines the required contract for implementing a tokenizer.
   * @interface
   */
  export interface ITokenizer
  {    
    /**
     * Gets the source document for the tokenizer.
     */
    sourceDocument: ITextDocument;
    
    /**
     * Returns the next symbol from the tokenizer.
     */
    nextSymbol(): ISymbol;
    
    /**
     * Resets the tokenizer internal state
     * @function
     */
    reset(): void;
  }
}