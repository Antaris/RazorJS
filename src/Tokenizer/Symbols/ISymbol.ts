/// <reference path="../../SourceLocation.ts" />
/// <reference path="../../RazorError.ts" />

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
     * Gets the set of errors attributed to the symbol
     * @property
     * @readonly
     * @returns {RazorError[]}
     */
    errors: RazorError[];
    
    /**
     * Gets the start location of the symbol
     * @property
     * @readonly
     * @returns {SourceLocation}
     */
    start: SourceLocation;
    
    /**
     * Gets the runtime type of the symbol.
     * @property
     * @readonly
     * @returns {string}
     */
    runtimeTypeName: string;
    
    /**
     * Gets the symbol type.
     * @returns {any}
     */
    type: any;
    
    /**
     * Gets the type name of the symbol.
     * @property
     * @readonly
     * @returns {string}
     */
    typeName: string;
    
    /**
     * Changes the start position of the symbol
     * @function
     * @param {SourceLocation} newStart - The new start position of the symbol
     */
    changeStart(newStart: SourceLocation): void;
    
    /**
     * Determines if the given symbol is equal to the current symbol.
     * @function
     * @param {any} other - The other object
     * @returns {boolean}
     */
    equals(other: any): boolean;
    
    /**
     * Offsets the start position of the symbol using the document start position
     * @function
     * @param {SourceLocation} documetnStart - The document start position
     */
    offsetStart(documentStart: SourceLocation): void;
  }
}