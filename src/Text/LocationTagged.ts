/// <reference path="../SourceLocation.ts" />

namespace Razor.Text
{
  /**
   * Represents a value tagged at a specific location.
   * @constructor
   */
  export class LocationTagged<T> implements IEquatable<LocationTagged<T>>
  {
    private _location: SourceLocation = SourceLocation.Undefined;
    private _value: T = null;
    
    /**
     * Initialises a new instance of a LocationTagged{T}
     * @constructor
     * @param {T} value - The tagged value
     * @param {SourceLocation|number} locationOrOffset - The source location or the absolute index
     * @param {number} [line] - The line index
     * @param {number} [col] - The column (character) index
     */
    constructor(value: T, locationOrOffset: SourceLocation|number, line?: number, col?: number)
    {
      this._value = value;
      
      if (locationOrOffset instanceof SourceLocation)
      {
        this._location = <SourceLocation>locationOrOffset;  
      }
      else
      {
        this._location = new SourceLocation(<number>locationOrOffset, line, col);
      }
    }
    
    /**
     * Gets the source location
     * @property
     * @returns {SourceLocation}
     */
    public get location(): SourceLocation
    {
      return this._location;
    }
    
    /**
     * Gets the value
     * @property
     * @returns {T}
     */
    public get value(): T
    {
      return this._value;
    }
    
    /**
     * Determines if the given instance is equal to the current instance.
     * @function
     * @param {LocationTagged<T>} other - The instance to equate
     * @returns {boolean}
     */
    public equals(other: LocationTagged<T>): boolean
    {
      if (!!other)
      {
        if (this === other)
        {
          return true;
        }
        
        return this.location.equals(other.location) &&
              (this.value === other.value);
      }
      
      return false;
    }
    
    /**
     * Gets the string representation of this instance.
     * @function
     * @returns {string}
     */
    public toString(): string
    {
      return (this.value || "").toString();
    }
    
    /**
     * Gets the formatted string representation of this instance.
     * @function
     * @returns {string}
     */
    public toFormattedString(): string
    {
      return [this.toString(), '@', this.location.toString()].join('');
    }
  }
}