/// <reference path="../../SourceLocation.ts" />

namespace Razor.Tokenizer.Symbols
{
  /**
   * Defines the required contract for implementing a symbol
   * @interface
   */
  export interface ISymbol
  {
    /**
     * Gets the content of the symbol
     * @property
     * @readonly
     * @returns {string}
     */
    content: string;
    
    /**
     * Gets the start location of the symbol
     * @property
     * @readonly
     * @returns {SourceLocation}
     */
    start: SourceLocation;
    
    /**
     * Changes the start position of the symbol
     * @function
     * @param {SourceLocation} newStart - The new start position of the symbol
     */
    changeStart(newStart: SourceLocation): void;
    
    /**
     * Offsets the start position of the symbol using the document start position
     * @function
     * @param {SourceLocation} documetnStart - The document start position
     */
    offsetStart(documentStart: SourceLocation): void;
  }
}