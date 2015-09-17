/// <reference path="SymbolBase.ts" />
/// <reference path="HtmlSymbolType.ts" />
/// <reference path="../../SourceLocation.ts" />
/// <reference path="../../RazorError.ts" />

namespace Razor.Tokenizer.Symbols
{
  /**
   * Represents a HTML symbol
   * @class
   */
  export class HtmlSymbol extends SymbolBase<HtmlSymbolType>
  {
    /**
     * Initialises a new instance of a HTML symbol
     * @constructor
     * @param {SourceLocation} start - The start location of the symbol
     * @param {string} content - The content of the symbol
     * @param {HtmlSymbolType} type - The symbol type
     * @oaram {RazorError[]} errors - The set of errors attributed to the symbol
     */
    constructor(start: SourceLocation, content: string, type: HtmlSymbolType, errors?: RazorError[])
    {
      super(start, content, type, errors || []);
    }
  }
}