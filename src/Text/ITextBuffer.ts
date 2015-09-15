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
  }
}