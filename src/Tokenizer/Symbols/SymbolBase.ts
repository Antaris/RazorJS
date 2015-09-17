/// <reference path="ISymbol.ts" />
/// <reference path="../../SourceLocation.ts" />
/// <reference path="../../RazorError.ts" />
/// <reference path="../../Text/LocationTagged.ts" />

namespace Razor.Tokenizer.Symbols
{
  import LocationTagged = Razor.Text.LocationTagged;
  
  /**
   * Provides a base implementation of a symbol
   * @class
   */
  export class SymbolBase<T> implements ISymbol, IEquatable<SymbolBase<T>>
  {
    /**
     * Initialises a new instance of a symbol
     * @constructtor
     * @param {SourceLocation} start - The start location of the symbol
     * @param {string} content - The content of the symbol
     * @param {T} type - The symbol type
     * @oaram {RazorError[]} errors - The set of errors attributed to the symbol
     */
    constructor(public start: SourceLocation, public content: string, public type: T, public errors: RazorError[])
    {
      
    }
    
    /**
     * Changes the start position of the symbol
     * @function
     * @param {SourceLocation} newStart - The new start position of the symbol
     */
    public changeStart(newStart: SourceLocation): void
    {
      this.start = newStart;  
    }
    
    /**
     * Gets the content of the symbol as a tagged location
     * @function
     * @returns {LocationTagged<string>}
     */
    public getContent(): LocationTagged<string>
    {
      return new LocationTagged<string>(this.content, this.start);
    }
    
    /**
     * Determines if the given instance is equal to the current instance.
     * @function
     * @param {SymbolBase<T>} other - The instance to equate
     * @returns {boolean}
     */
    public equals(other: SymbolBase<T>): boolean
    {
      if (!other)
      {
        return false;
      }
      
      return this.start.equals(other.start) &&
             this.content === other.content &&
             this.type === other.type;
    }
    
    /**
     * Offsets the start position of the symbol using the document start position
     * @function
     * @param {SourceLocation} documetnStart - The document start position
     */
    public offsetStart(documentStart: SourceLocation): void
    {
      this.start = SourceLocation.add(documentStart, this.start);
    }
    
    /**
     * Returns the string representation of the symbol
     * @function
     * @returns {string}
     */
    public toString(): string
    {
      return [this.start.toString(), ' ', this.type, ' - ', this.content].join('');
    }
  }
}