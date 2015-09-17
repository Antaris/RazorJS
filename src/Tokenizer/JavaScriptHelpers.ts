/// <reference path="../Parser/ParserHelpers.ts" />

namespace Razor.Tokenizer
{
  import ParserHelpers = Razor.Parser.ParserHelpers;
  
  /**
   * Provides common helper methods for tokenizing JavaScript code.
   * @class
   */
  export class JavaScriptHelpers
  {
    /**
     * Determines if the given character is a valid identifier start character
     * @function
     * @static
     * @param {string} character - The character to test
     * @returns {boolean}
     */
    public static isIdentifierStart(character: string): boolean
    {
      return /[_$a-zA-Z]/.test(character);
    }
    
    /**
     * Determines if the given character is a valid identifier part character
     * @function
     * @static
     * @param {string} character - The character to test
     * @returns {boolean}
     */
    public static isIdentifierPart(character: string): boolean
    {
      return /[_a-zA-Z0-9]/.test(character);
    }
  }
}