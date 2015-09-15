/// <reference path="Internals/IEquatable.ts" />
/// <reference path="Internals/IComparable.ts" />
/// <reference path="Text/SourceLocationTracker.ts" />

namespace Razor
{
  import SourceLocationTracker = Razor.Text.SourceLocationTracker;
  
  /**
   * Represents a location in source.
   * @class
   */
  export class SourceLocation implements IEquatable<SourceLocation>, IComparable<SourceLocation>
  {
    /**
     * Represents an undefined source location.
     * @field
     * @static
     */
    public static Undefined: SourceLocation = new SourceLocation(-1, -1, -1);
    
    /**
     * Represents the beginning of source.
     * @field
     * @static
     */
    public static Zero: SourceLocation = new SourceLocation(0, 0, 0);
    
    /**
     * Initialises a new instance of a source location.
     * @constructor
     * @param {number} absoluteIndex - The absolute index in source
     * @param {number} lineIndex - The line index in source
     * @param {number} characterIndex - The character index in source
     */
    constructor(public absoluteIndex: number, public lineIndex: number, public characterIndex: number) 
    {
        
    }
    
    /**
     * Adds two source locations.
     * @function
     * @static
     * @param {SourceLocation} left The left operand
     * @param {SourceLocation} right - The right operand
     * @returns {SourceLocation}
     */
    public static add(left: SourceLocation, right: SourceLocation): SourceLocation
    {
      if (right.lineIndex > 0)
      {
        return new SourceLocation(left.absoluteIndex + right.absoluteIndex, left.lineIndex + right.lineIndex, right.characterIndex);
      }
      
      return new SourceLocation(left.absoluteIndex + right.absoluteIndex, left.lineIndex + right.lineIndex, left.characterIndex + right.characterIndex);
    }
    
    /**
     * Advances the given source location using the specified text.
     * @function
     * @static
     * @param {SourceLocation} left - The source location to advance
     * @param {string} text - The text
     * @returns {SourceLocation}
     */
    public static advance(left: SourceLocation, text: string): SourceLocation
    {
      var tracker = new SourceLocationTracker(left);
      tracker.updateLocation(text);
      return tracker.currentLocation;
    }

    /**
     * Compares the given instance against the current instance to determine order.
     * @function
     * @param {SourceLocation} other - The other instance to compare to
     * @returns {number}
     */
    public compareTo(other: SourceLocation): number
    {
      if (!!other) 
      {
        return -1;
      }
      
      return ((this.absoluteIndex < other.absoluteIndex) ? -1 : (this.absoluteIndex === other.absoluteIndex) ? 0 : 1);
    }
    
    /**
     * Determines if the given instance is equal to the current instance.
     * @function
     * @param {SourceLocation} other - The instance to equate
     * @returns {boolean}
     */
    public equals(other: SourceLocation): boolean
    {
      return this.compareTo(other) === 0;
    }
    
    /**
     * Determines whether the first operand is greater than the second.
     * @function
     * @static
     * @param {SourceLocation} left - The left operand
     * @param {SourceLocation} right - The right operand
     * @returns {boolean}
     */
    public static greaterThan(left: SourceLocation, right: SourceLocation): boolean
    {
      return left.compareTo(right) > 0;
    }
    
    /**
     * Determines whether the first operand is less than the second.
     * @function
     * @static
     * @param {SourceLocation} left - The left operand
     * @param {SourceLocation} right - The right operand
     * @returns {boolean}
     */
    public static lessThan(left: SourceLocation, right: SourceLocation): boolean
    {
      return left.compareTo(right) < 0;
    }
    
    /**
     * Subtracts two source locations
     * @function
     * @static
     * @param {SourceLocation} left - The left operand
     * @param {SourceLocation} right - The right operand
     * @returns {SourceLocation}
     */
    public static subtract(left: SourceLocation, right: SourceLocation): SourceLocation
    {
      var characterIndex = (left.lineIndex != right.lineIndex) ? left.characterIndex : (left.characterIndex - right.characterIndex);
      
      return new SourceLocation(left.absoluteIndex - right.absoluteIndex, left.lineIndex - right.lineIndex, characterIndex);
    }
    
    /**
     * Returns the string representation of this source location.
     * @function
     * @returns {string}
     */
    public toString(): string
    {
      return ['(', this.absoluteIndex, ':', this.lineIndex, ',', this.characterIndex, ')'].join('');
    }
  }
}