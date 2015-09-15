/// <reference path="../SourceLocation.ts" />

namespace Razor.Text
{
  /**
   * Represents a span in source
   * @class
   */
  export class SourceSpan
  {
    /**
     * Gets or sets the begining source location
     * @property
     * @returns {SourceLocation}
     */
    public begin: SourceLocation;
    
    /**
     * Gets or sets the end source location
     * @property
     * @returns {SourceLocation}
     */
    public end: SourceLocation;
  }
}