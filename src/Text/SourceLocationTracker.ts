/// <reference path="../Parser/ParserHelpers.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="../Internals/Environment.ts" />

namespace Razor.Text
{
  import ParserHelpers = Razor.Parser.ParserHelpers;
  
  /**
   * Represents a tracker for tracking changes to a source location.
   * @class
   */
  export class SourceLocationTracker
  {
    private _absoluteIndex: number;
    private _lineIndex: number;
    private _characterIndex: number;
    private _currentLocation: SourceLocation;
    
    /**
     * Initialises a new instance of a source location tracker
     * @constructor
     * @param {SourceLocation|number} [currentLocationOrAbsoluteIndex] - The current source location, or the absolute index in source
     * @param {number} [lineIndex] - The line index in source
     * @param {number} [characterIndex] - The character index in source
     */
    constructor(currentLocationOrAbsoluteIndex?: SourceLocation|number, lineIndex?: number, characterIndex?: number)
    {
      if (arguments.length === 0)
      {
        this._currentLocation = SourceLocation.Zero;
      }
      else if (currentLocationOrAbsoluteIndex instanceof SourceLocation)
      {
        this._currentLocation = <SourceLocation>currentLocationOrAbsoluteIndex;
      }
      else
      {
        this._currentLocation = new SourceLocation(<number>currentLocationOrAbsoluteIndex, lineIndex, characterIndex);
      }
      this.updateInternalState();
    }
    
    /**
     * Gets the current location
     * @returns {SourceLocation}
     */
    public get currentLocation(): SourceLocation
    {
      return this._currentLocation;
    }
    
    /**
     * @param {SourceLocation} value - The source location. 
     */
    public set currentLocation(value: SourceLocation)
    {
      if (!!value)
      {
        if (!value.equals(this.currentLocation))
        {
          this._currentLocation = value;
          this.updateInternalState();
        }
      }
    }
    
    /**
     * Calculates the new source location using the given content.
     * @function
     * @static
     * @param {SourceLocation} lastPosition - The last position in source
     * @param {string} newContent - The new content
     * @returns {SourceLocation}
     */
    public static calculateNewLocation(lastPosition: SourceLocation, newContent: string): SourceLocation
    {
      return new SourceLocationTracker(lastPosition).updateLocation(newContent).currentLocation;
    }
    
    /**
     * Recalculates the source location based on the internal state of the tracker
     */
    private recalculateSourceLocation(): void
    {
      this._currentLocation = new SourceLocation(this._absoluteIndex, this._lineIndex, this._characterIndex);
    }
    
    /**
     * Updates the internal state based on the characters read
     * @param {string} characterRead - The character that was read
     * @param {string} nextCharacter - The next character that was read
     */
    private updateCharacterCore(characterRead: string, nextCharacter: string): void
    {
      this._absoluteIndex++;
      
      if (Environment.NewLine.length === 1 && characterRead === Environment.NewLine || 
          ParserHelpers.isNewLine(characterRead) && (characterRead !== '\r' || nextCharacter !== '\n'))
      {
        this._lineIndex++;
        this._characterIndex = 0;
      }
      else
      {
        this._characterIndex++;
      }
    }
    
    /**
     * Updates the internal state of the tracker
     */
    private updateInternalState(): void
    {
      this._absoluteIndex = this.currentLocation.absoluteIndex;
      this._lineIndex = this.currentLocation.lineIndex;
      this._characterIndex = this.currentLocation.characterIndex;
    }
    
    /**
     * Updates the source location based on the given read characters or string.
     * @param {string} contentOrCharacterRead - The content string or the individual character that was read.
     * @param {string} [nextCharacter] - The next character that was read
     * @returns {SourceLocationTracker}
     */
    public updateLocation(contentOrCharacterRead: string, nextCharacter?: string): SourceLocationTracker
    {
      if (!!nextCharacter)
      {
        this.updateCharacterCore(contentOrCharacterRead, nextCharacter);
      }
      else
      {
        var i = 0, l = contentOrCharacterRead.length;
        for (; i < l; i++)
        {
          nextCharacter = '\0';
          if (i < (l - 1))
          {
            nextCharacter = contentOrCharacterRead[i + 1];
          }
          this.updateCharacterCore(contentOrCharacterRead[i], nextCharacter);
        }
      }
      this.recalculateSourceLocation();      
      return this;
    }
  }
}