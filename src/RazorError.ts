/// <reference path="SourceLocation.ts" />

namespace Razor
{
  /**
   * Represents an error in a razor document.
   * @class
   */
  export class RazorError implements IEquatable<RazorError>
  {
    /**
     * Initialises a new instance of a razor error
     * @constructor
     * @param {string} message- The error message
     * @param {SourceLocation} location - The locatin in source of the erroneous text
     * @param {number} length - the length of the erroneous text
     *  */ 
    constructor(public message: string, public location: SourceLocation, public length: number)
    {  
    }
    
    /**
     * Determines if the given instance is equal to the current instance.
     * @function
     * @param {RazorError} other - The instance to equate
     * @returns {boolean}
     */
    public equals(other: RazorError): boolean
    {
      if (!other)
      {
        return false;
      }
      
      return this.message === other.message &&
             this.location.equals(other.location) &&
             this.length === other.length;
    }
  }
}