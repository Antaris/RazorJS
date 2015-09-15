/// <reference path="ITextBuffer.ts" />
/// <reference path="../Internals/IEquatable.ts" />
/// <reference path="../Parser/SyntaxTree/Span.ts" />

namespace Razor.Text
{
  import Span = Razor.Parser.SyntaxTree.Span;
  
  /**
   * Provides services for performing text change operations.
   */
  export class TextChange implements IEquatable<TextChange>
  {
    private _oldPosition: number;
    private _oldLength: number;
    private _oldBuffer: ITextBuffer;
    private _oldText: string;
    
    private _newPosition: number;
    private _newLength: number;
    private _newBuffer: ITextBuffer;
    private _newText: string;
    
    /**
     * Initialises a new instance of a text change
     * @constructor
     * @param {number} oldPosition - The old position
     * @param {number} oldLength - The old length
     * @param {ITextBuffer} oldBuffer - The old buffer
     * @param {number} newPositionOrLength - The new position (if different from the old position) or the new length
     * @param {number|ITextBuffer} newLengthOrBuffer - The new length (if new position is different from the old position) or the new buffer
     * @param {ITextBuffer} [newBuffer] - The new buffer (if new position is different from the old position) or the new buffer
     */
    constructor(oldPosition: number, oldLength: number, oldBuffer: ITextBuffer, newPositionOrLength: number, newLengthOrBuffer: number|ITextBuffer, newBuffer?: ITextBuffer)
    {
      var newPosition: number, newLength: number;
      if (arguments.length === 5)
      {
        newBuffer = <ITextBuffer>newLengthOrBuffer;
        newLength = <number>newPositionOrLength;
        newPosition = oldPosition;
      }
      else
      {
        newPosition = newPositionOrLength;
        newLength = <number>newLengthOrBuffer;
      }
      
      this._oldPosition = oldPosition;
      this._oldLength = oldLength;
      this._oldBuffer = oldBuffer;
      this._newPosition = newPosition;
      this._newLength = newLength;
      this._newBuffer = newBuffer;
    }
    
    /**
     * Gets whether this text change is a delete.
     * @readonly
     */
    public get isDelete(): boolean
    {
      return this._oldLength > 0 && this._newLength === 0;
    }
    
    /**
     * Gets whether this text change is an insert.
     * @readonly
     */
    public get isInsert(): boolean
    {
      return this._oldLength === 0 && this._newLength > 0;
    }
    
    /**
     * Gets whether this text change is a replace.
     * @readonly
     */
    public get isReplace(): boolean
    {
      return this._oldLength > 0 && this._newLength > 0;
    }
    
    /**
     * Gets the new buffer
     * @readonly
     */
    public get newBuffer(): ITextBuffer
    {
      return this._newBuffer;
    }
    
    /**
     * Gets the new length
     * @readonly
     */
    public get newLength(): number
    {
      return this._newLength;
    }
    
    /**
     * Gets the new position
     * @readonly
     */
    public get newPosition(): number
    {
      return this._newPosition;
    }
    
    /**
     * Gets the new text
     * @readonly
     */
    public get newText(): string
    {
      if (!this._newText)
      {
        this._newText = TextChange.getText(this._newBuffer, this._newPosition, this._newLength);
      }
      return this._newText;
    }
    
    /**
     * Gets the old buffer
     * @readonly
     */
    public get oldBuffer(): ITextBuffer
    {
      return this._oldBuffer;
    }
    
    /**
     * Gets the old length
     * @readonly
     */
    public get oldLength(): number
    {
      return this._oldLength;
    }
    
    /**
     * Gets the old position.
     * @readonly
     */
    public get oldPosition(): number
    {
      return this._oldPosition;
    }
    
    /**
     * Gets the old text
     * @readonly
     */
    public get oldText(): string
    {
      if (!this._oldText)
      {
        this._oldText = TextChange.getText(this._oldBuffer, this._oldPosition, this._oldLength);
      }
      return this._oldText;
    }
    
    /**
     * Applies the text change to the given string.
     * @param {string|Span} contentOrSpan - The text content or Span to apply the text change to
     * @param {number} [changeOffset] - The change offset if providing text content
     * @returns {string}
     */
    public applyChange(contentOrSpan: string|Span, changeOffset?: number)
    {
      var content: string, changeRelativePosition: number, prefix: string, suffix: string;
      if (contentOrSpan instanceof Span)
      {
        content = (<Span>contentOrSpan).content;
        changeOffset = (<Span>contentOrSpan).start.absoluteIndex;
      }
      else
      {
        content = <string>contentOrSpan;
      }
      
      changeRelativePosition = this.oldPosition - changeOffset;
      prefix = content.substr(0, changeRelativePosition);
      suffix = content.substr(changeRelativePosition + changeOffset);
      return [prefix, this.newText, suffix].join('');
    }
    
    /**
     * Determines if the given instance is equal to the current instance.
     * @function
     * @param {TextChange} other - The instance to equate
     * @returns {boolean}
     */
    public equals(other: TextChange): boolean
    {
      if (!!other)
      {
        return this._oldPosition === other.oldPosition &&
              this._oldLength === other.oldLength &&
              this._newPosition === other.newPosition &&
              this._newLength === other.newLength &&
              this._oldBuffer === other.oldBuffer &&
              this._newBuffer === other.newBuffer;
      }
      
      return false;
    }
    
    /**
     * Gets the text at the given position and length from the buffer
     * @function
     * @static
     * @param {ITextBuffer} buffer - The text buffer
     * @param {number} position - The position in the buffer
     * @param {number} length - The length of the text
     */
    public static getText(buffer: ITextBuffer, position: number, length: number): string
    {
      var oldPosition: number, builder: string[], i: number = 0, c: string;
      
      if (length === 0)
      {
        return '';
      }
      
      oldPosition = buffer.position;
      try
      {
        buffer.position = position;
        
        if (length === 1)
        {
          return <string>buffer.read();
        }
        else
        {
          builder = [];
          for (; i < length; i++)
          {
            c = <string>buffer.read();
            builder.push(c);
          }
          return builder.join('');
        }
      }
      finally
      {
        buffer.position = oldPosition;
      }
    }
    
    /**
     * Removes a common prefix from the edit to replacements into insertions where possible
     * @function
     * @returns {TextChange}
     */
    public normalize(): TextChange
    {
      if (!!this._oldBuffer && this.isReplace && this._newLength > 0 && this._newPosition === this._oldPosition && this.newText.indexOf(this.oldText))
      {
        return new TextChange(this.oldPosition + this.oldLength, 0, this.oldBuffer, this.oldPosition + this.oldLength, this.newLength - this.oldLength, this.newBuffer);
      }
      
      return this;
    }
    
    /**
     * Gets the string representation of this text change
     */
    public toString(): string
    {
      return ['(', this.oldPosition, ':', this.oldLength, ' "', this.oldText, '") => (', this.newPosition, ':', this.newLength, ' \"', this.newText, '\")'].join('');
    }
  }
}