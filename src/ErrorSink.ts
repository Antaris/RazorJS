/// <reference path="RazorError.ts" />
/// <reference path="SourceLocation.ts" />

namespace Razor
{
  /**
   * Used to manage errors encountered during the Razor parsing phase
   * @class
   */
  export class ErrorSink
  {
    private _errors: RazorError[];
    
    /**
     * Initialises a new instance of an error sink
     * @constructor
     */
    constructor()
    {
      this._errors = [];
    }
    
    /**
     * Gets the errors
     * @property
     * @readonly
     * @returns {RazorError[]}
     */
    public get errors(): RazorError[]
    {
      return this._errors;
    }
    
    /**
     * Tracks the given error, or creates a new error if providing a source location, message and length.
     * @function
     * @param {RazorError|SourceLocation} errorOrLocation - The error itself, or the location of the error
     * @param {string} [message] - The message
     * @param {number} [length] - The length of the erounous text
     */
    public onError(errorOrLocation: RazorError|SourceLocation, message?: string, length?: number): void
    {
      var error: RazorError;
      if (errorOrLocation instanceof RazorError)
      {
        error = <RazorError>errorOrLocation;
      }
      else
      {
        error = new RazorError(message, <SourceLocation>errorOrLocation, length);
      }
      this._errors.push(error);
    }
  }
}