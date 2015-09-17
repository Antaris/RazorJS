/// <reference path="Symbols/JavaScriptSymbolType.ts" />

namespace Razor.Tokenizer
{
  import JavaScriptSymbolType = Razor.Tokenizer.Symbols.JavaScriptSymbolType;
  
  /**
   * Defines the required contract for implementing an operator handler.
   * @interface
   */
  export interface OperatorHandler
  {
    (): JavaScriptSymbolType
  }
}