/// <reference path="SymbolBase.ts" />
/// <reference path="JavaScriptSymbolType.ts" />
/// <reference path="JavaScriptKeyword.ts" />
/// <reference path="../../SourceLocation.ts" />
/// <reference path="../../RazorError.ts" />

namespace Razor.Tokenizer.Symbols
{
  /**
   * Represents a JavaScript symbol
   * @class
   */
  export class JavaScriptSymbol extends SymbolBase<JavaScriptSymbolType>
  {
    /**
     * Initialises a new instance of a JavaScript symbol
     * @constructor
     * @param {SourceLocation} start - The start location of the symbol
     * @param {string} content - The content of the symbol
     * @param {JavaScriptSymbolType} type - The symbol type
     * @oaram {RazorError[]} [errors] - The set of errors attributed to the symbol
     * @param {JavaScriptKeyword} [keyword] - The keyword for the symbol.
     */
    constructor(start: SourceLocation, content: string, type: JavaScriptSymbolType, errors?: RazorError[], keyword?: JavaScriptKeyword)
    {
      super(start, content, type, errors || []);
      
      this.keyword = keyword || null;
    }
    
    /**
     * Gets or sets the keyword.
     * @property
     * @returns {JavaScriptKeyword}
     */
    public keyword: JavaScriptKeyword;
    
    /**
     * Determines if the given instance is equal to the current instance.
     * @function
     * @param {JavaScriptSymbol} other - The instance to equate
     * @returns {boolean}
     */
    public equals(other: JavaScriptSymbol): boolean
    {
      if (!other)
      {
        return false;
      }
      
      return super.equals(other) &&
             this.keyword === other.keyword;
    }
    
    /**
     * Gets the type name.
     * @propery
     * @readonly
     * @returns {string}
     */
    public get typeName(): string
    {
      return JavaScriptSymbolType[<number>this.type];
    }
  }
}