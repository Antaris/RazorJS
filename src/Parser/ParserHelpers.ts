/// <reference path="../Internals/Environment.ts" />

namespace Razor.Parser
{  
  /**
   * Provides helper methods for parsing source
   */
  export class ParserHelpers
  {    
    /**
     * Determines if the given value is a binary digit
     * @function
     * @static
     * @param {string} value - The value to check
     * @returns {boolean}
     */
    public static isBinaryDigit(value: string): boolean
    {
      return (value === '0' || value === '1');
    }
    
    /**
     * Determines if the given value is an octal digit
     * @function
     * @static
     * @param {string} value - The value to check
     * @returns {boolean}
     */
    public static isOctalDigit(value: string): boolean
    {
      return /[0-9]/.test(value);
    }
    
    /**
     * Determines if the given value is a decimal digit
     * @function
     * @static
     * @param {string} value - The value to check
     * @returns {boolean}
     */
    public static isDecimalDigit(value: string): boolean
    {
      return /[0-9]/.test(value);
    }
    
    /**
     * Determines if the given value is a hex digit
     * @function
     * @static
     * @param {string} value - The value to check
     * @returns {boolean}
     */
    public static isHexDigit(value: string): boolean
    {
      return /[0-9a-fA-F]/.test(value);
    }
    
    /**
     * Determines if the given value is a letter
     * @function
     * @static
     * @param {string} value - The value to check
     * @returns {boolean}
     */
    public static isLetter(value: string): boolean
    {
      return /[a-zA-Z]/.test(value);
    }
    
    /**
     * Determines if the given value is a letter or a decimal digit
     * @function
     * @static
     * @param {string} value - The value to check
     * @returns {boolean}
     */
    public static isLetterOrDecimalDigit(value: string): boolean
    {
      return ParserHelpers.isLetter(value) || ParserHelpers.isDecimalDigit(value);
    }
    
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
    
    /**
     * Determiens if the given character is whitespace.
     * @function
     * @param {string} value - The character to test
     * @returns {boolean}
     */
    public static isWhiteSpace(value: string): boolean
    {
      return value === ' ' ||
             value === '\f' ||
             value === '\t' ||
             value === '\u000B';
    }
    
    /**
     * Determines if the given character is whitespace or a new line.
     * @function
     * @param {string} value - The character to test
     * @returns {boolean}
     */
    public static isWhiteSpaceOrNewLine(value: string): boolean
    {
      return ParserHelpers.isWhiteSpace(value) || ParserHelpers.isNewLine(value);  
    }
  }
}