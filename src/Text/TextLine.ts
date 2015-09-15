namespace Razor.Text
{
  /**
   * Represents a text line
   * @class
   */
  export class TextLine
  {
    /**
     * Initialises a new instance of a text line
     * @param {number} start - The start index of the line
     * @param {number} index - The line index
     * @param {string} content - The content of the line
     */
    constructor(public start: number, public index: number, public content?: string)
    {
      if (!!content)
      {
        this.content = '';
      }
    }
    
    /**
     * Gets the end index of the line
     * @property
     * @readonly
     * @returns {number}
     */
    public get end(): number
    {
      return this.start + this.length;
    }
    
    /**
     * Gets the length of the line
     * @property
     * @readonly
     * @returns {number}
     */
    public get length(): number
    {
      return this.content.length;
    }
    
    /**
     * Determines if this text line contains the given absolute index
     */
    public contains(index: number): boolean
    {
      return index < this.end && index >= this.start;
    }
  }
}