/// <reference path="../SourceLocation.ts" />
/// <reference path="ITextBuffer.ts" />

namespace Razor.Text
{
  /**
   * Defines the required contract for implementing a text document.
   */
  export interface ITextDocument extends ITextBuffer
  {
    /**
     * Gets the source location.
     */
    location: SourceLocation;
  }
}