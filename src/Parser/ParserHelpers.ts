/// <reference path="../Internals/Environment.ts" />

namespace Razor.Parser
{  
  /**
   * Provides helper methods for parsing source
   */
  export class ParserHelpers
  {
    /**
     * Determines if the given value represents a new line.
     * @function
     * @static
     * @param {string} value - The value to check
     * @returns {boolean}
     */
    public static isNewLine(value: string): boolean
    {
      if (!!value)
      {
        if (value.length == 1)
        {
          return value === '\r' ||
                  value === '\n' ||
                  value === '\u0085' ||
                  value === '\u2028' ||
                  value === '\u2029';
        }
        
        return value === Environment.NewLine;
      }
      return false;
    }
  }
}