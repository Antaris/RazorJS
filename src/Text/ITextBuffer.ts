/// <reference path="LookaheadToken.ts" />
/// <reference path="ITextDocument.ts" />"

namespace Razor.Text
{
  /**
   * Defines the required contract for implementing a text buffer.
   */
  export interface ITextBuffer
  {
    /**
     * Gets the length of the buffer.
     * @property
     * @readonly
     */
    length: number;
    
    /**
     * Gets or sets the position in the buffer.
     * @readonly
     */
    position: number;
    
    /**
     * Begins a lookahead operation on the buffer.
     * @returns {LookaheadToken}
     */
    beginLookahead(): LookaheadToken;
    
    /**
     * Peeks at the next character from the buffer without advancing the position.
     * @function
     * @returns {string|number}
     */
    peek(): string|number;
    
    /**
     * Reads the next character from the buffer.
     * @function
     * @returns {string|number}
     */
    read(): string|number;
    
    /**
     * Reads to the end of the buffer
     * @function
     * @returns {string}
     */
    readToEnd(): string;
    
    /**
     * Seeks to the buffer by the given number of characters.
     * @function
     * @param {number} count - The number of characters to seek.
     */
    seek(count: number): void;
    
    /**
     * Returns the current buffer as a document
     * @function
     * @returns {ITextDocument}
     */
    toDocument(): ITextDocument;
  }
}