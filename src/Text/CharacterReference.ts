/// <reference path="../SourceLocation.ts" />

namespace Razor.Text
{
  /**
   * Represents a reference to a character in source.
   * @class
   */
  export class CharacterReference
  {
    private _char: string;
    private _loc: SourceLocation;
    
    /**
     * Initialises a new instance of a character reference
     * @constructor
     * @param {string} character - The character
     * @param {SourceLocation} location - The location of the character
     */
    constructor(character: string, location: SourceLocation)
    {
      this._char = character;
      this._loc = location;
    }
    
    /**
     * Gets the character
     * @property
     * @readonly
     * @returns {string}
     */
    public get character(): string
    {
      return this._char;
    }
    
    /**
     * Gets the location of the character
     * @property
     * @readonly
     * @returns {string}
     */
    public get location(): SourceLocation
    {
      return this._loc;
    }
  }
}