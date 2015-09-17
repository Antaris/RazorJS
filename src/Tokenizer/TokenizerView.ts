/// <reference path="Symbols/ISymbol.ts" />
/// <reference path="ITokenizer.ts" />
/// <reference path="../Text/ITextDocument.ts" />

namespace Razor.Tokenizer
{
  import ISymbol = Razor.Tokenizer.Symbols.ISymbol;
  import ITextDocument = Razor.Text.ITextDocument;
  
  /**
   * Provides a facade across tokenizer operations.
   * @class
   */
  export class TokenizerView<TTokenizer extends ITokenizer, TSymbol extends ISymbol, TSymbolType>
  {
    private _tokenizer: TTokenizer;
    private _endOfFile: boolean;
    private _current: TSymbol;
    
    /**
     * Initialises a new instance of a tokenizer view
     * @constructor
     * @param {TTokenizer} tokenizer - The tokenizer
     */
    constructor(tokenizer: TTokenizer)
    {
      this._tokenizer = tokenizer;
    }
    
    /**
     * Gets the current symbol
     * @property
     * @readonly
     * @returns {TSymbol}
     */
    public get current(): TSymbol
    {
      return this._current;
    }
    
    /**
     * Gets whether we are at the end of th input
     * @property
     * @readonly
     * @returns {boolean}
     */
    public get endOfFile(): boolean
    {
      return this._endOfFile;
    }
    
    /**
     * Gets the source document for the tokenizer.
     * @property
     * @readonly
     * @returns {ITextDocument}
     */
    public get source(): ITextDocument
    {
      return this.tokenizer.sourceDocument;
    }
    
    /**
     * Gets the tokenizer
     * @property
     * @readonly
     * @returns {TTokenizer}
     */
    public get tokenizer(): TTokenizer
    {
      return this._tokenizer;
    }
    
    /**
     * Attempts to obtain the next symbol from the tokenizer to set as the current symbol
     * @function
     * @returns {boolean}
     */
    public next(): boolean
    {
      this._current = <TSymbol>this.tokenizer.nextSymbol();
      this._endOfFile = !this._current;
      return !this._endOfFile;
    }
    
    /**
     * Puts the given symbol back and resets the internal state of the tokenizer
     * @function
     * @param {TSymbol} symbol - The symbol to put back
     */
    public putBack(symbol: TSymbol): void
    {
      if (this.source.position !== symbol.start.absoluteIndex + symbol.content.length)
      {
        throw "Unable to put symbol back as we've already moved passed this symbol.";
      }
      this.source.position -= symbol.content.length;
      this._current = null;
      this._endOfFile = this.source.position >= this.source.length;
      this.tokenizer.reset();
    }
  }
}