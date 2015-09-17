/// <reference path="../StateMachine.ts" />
/// <reference path="ITokenizer.ts" />
/// <reference path="../Text/ITextDocument.ts" />
/// <reference path="../Text/TextDocumentReader.ts" />
/// <reference path="../Text/StringBuilder.ts" />
/// <reference path="../RazorError.ts" />
/// <reference path="Symbols/SymbolBase.ts" />
/// <reference path="Symbols/ISymbol.ts" />
/// <reference path="../Internals/Using.ts" />
/// <reference path="../Parser/ParserHelpers.ts" />

namespace Razor.Tokenizer
{
  import ITextDocument = Razor.Text.ITextDocument;
  import TextDocumentReader = Razor.Text.TextDocumentReader;
  import StringBuilder = Razor.Text.StringBuilder;
  import ISymbol = Razor.Tokenizer.Symbols.ISymbol;
  import using = Razor.Using;
  import ParserHelpers = Razor.Parser.ParserHelpers;
  
  var EOF = -1;
  
  /**
   * Provides a base implementation of a tokenizer.
   */
  export class Tokenizer<TSymbol extends ISymbol, TSymbolType> extends StateMachine<TSymbol> implements ITokenizer
  {
    private _source: TextDocumentReader;
    private _buffer: StringBuilder;
    private _currentErrors: RazorError[];
    private _currentStart: SourceLocation;
    
    /**
     * Initialises a new instance of a tokenizer.
     * @constructor
     * @param {ITextDocument} source - The text document.
     */
    constructor(source: ITextDocument)
    {
      super();
      
      this._source = new TextDocumentReader(source);
      this._buffer = new StringBuilder();
      this._currentErrors = [];
      
      this.startSymbol();
    }
    
    /**
     * Gets the buffer
     * @property
     * @readonly
     * @returns {StringBuilder}
     */
    protected get buffer(): StringBuilder
    {
      return this._buffer;
    }
    
    /**
     * Gets the current character
     * @property
     * @readonly
     * @returns {string}
     */
    protected get currentCharacter(): string
    {
      var peek = this.source.peek();
      return (peek === EOF) ? '\0' : <string>peek;
    }
    
    /**
     * Gets the current errors
     * @property
     * @readonly
     * @returns {RazorError[]}
     */
    protected get currentErrors(): RazorError[]
    {
      return this._currentErrors;
    }
    
    /**
     * Gets the current location in the document
     * @property
     * @readonly
     * @returns {SourceLocation}
     */
    protected get currentLocation(): SourceLocation
    {
      return this.source.location;
    }
    
    /**
     * Gets the current start location to being tokenizing
     * @property
     * @readonly
     * @returns {SourceLocation}
     */
    protected get currentStart(): SourceLocation
    {
      return this._currentStart;
    }
    
    /**
     * Gets whether we're at the end of the input
     * @property
     * @readonly
     * @returns {boolean}
     */
    protected get endOfFile(): boolean
    {
      return this.source.peek() === EOF;
    }
    
    /**
     * Gets whether the buffer currently has content.
     * @property
     * @readonly
     * @returns {boolean}
     */
    protected get haveContent(): boolean
    {
      return this.buffer.length > 0;
    }
    
    public get razorCommentStarType(): TSymbolType { return null; }
    public get razorCommentType(): TSymbolType { return null; }
    public get razorCommentTransitionType(): TSymbolType { return null; }
    
    /**
     * Gets the source reader.
     * @property
     * @readonly
     * @returns {TextDocumentReader}
     */
    public get source(): TextDocumentReader
    {
      return this._source;
    }
    
    /**
     * Gets the source document.
     * @property
     * @readonly
     * @returns {ITextDocument}
     */
    public get sourceDocument(): ITextDocument
    {
      return <ITextDocument>this.source;
    }
    
    /**
     * Moves to the next start after a Razor comment.
     * @function
     * @returns {StateResult<TSymbol>}
     */
    protected afterRazorCommentTransition(): StateResult<TSymbol>
    {
      if (this.currentCharacter !== '*')
      {
        return this.transition(this.startState);
      }
      this.takeCurrent();
      return this.transition(this.endSymbol(this.razorCommentStarType), <State<TSymbol>>this.razorCommentBody);
    }
    
    /**
     * Determines if the given string would be matched.
     * @function
     * @param {string} expected - The expected string.
     * @param {boolean} caseSensitive - Whether to make a case sensitive match
     * @returns {booelan}
     */
    protected at(expected: string, caseSensitive: boolean): boolean
    {
      return this.lookahead(expected, false, caseSensitive);
    }
    
    /**
     * Creates a symbol
     * @function
     * @param {SourceLocation} start - The start location
     * @param {string} content - The symbol content
     * @param {TSymbolType} type - The symbol type
     * @param {RazorError[]} errors - Any errors discovered while tokenizing
     * @returns {TSymbol}
     */
    protected createSymbol(start: SourceLocation, content: string, type: TSymbolType, errors: RazorError[]): TSymbol
    {
      return null;
    }
    
    /**
     * Creates a delegate used to test whether a character is equal to the given character, whitespace or new lines
     * @function
     * @param {string} character - The character to match
     * @returns {Function}
     */
    protected charOrWhiteSpace(character: string): (c: string) => boolean
    {
      return (c) => c === character || ParserHelpers.isWhiteSpace(c) || ParserHelpers.isNewLine(c); 
    }
    
    /**
     * Ends a symbol and returns it
     * @function
     * @param {SourceLocation|TSymbolType} startOrType - The start location (if provided) or the symbol type
     * @param {TSynbolType} [type] - The symbol type
     * @returns {TSymbol}
     */
    protected endSymbol(startOrType: SourceLocation|TSymbolType, type?: TSymbolType): TSymbol
    {
      if (startOrType instanceof SourceLocation)
      {
        var sym: TSymbol = null;
        if (this.haveContent)
        {
          sym = this.createSymbol(<SourceLocation>startOrType, this.buffer.toString(), type, this.currentErrors.slice(0));
        }
        this.startSymbol();
        return sym;
      }
      
      return this.endSymbol(this.currentStart, <TSymbolType>startOrType);
    }
    
    /**
     * Performs a lookahead operation on the source
     * @function
     * @param {string} expected - The expected string to match
     * @param {booelan} takeIfMatch - Should we accept the match?
     * @param {boolean} caseSensitive - Perform a case-sensitive match?
     * @returns {boolean}
     */
    private lookahead(expected: string, takeIfMatch: boolean, caseSensitive: boolean): boolean
    {
      var filter: (c: string) => string = (c) => c;
      if (!caseSensitive)
      {
        filter = (c) => c.toLowerCase();
      }
      
      if (expected.length === 0 || filter(this.currentCharacter) !== filter(expected[0]))
      {
        return false;
      }
      
      var oldBuffer: string;
      if (takeIfMatch)
      {
        oldBuffer = this.buffer.toString();
      }
      
      var found = true;
      var lookahead = this.source.beginLookahead();
      using (lookahead, () => {       
        for (var i = 0; i < expected.length; i++)
        {
          if (filter(this.currentCharacter) !== filter(expected[i]))
          {
            if (takeIfMatch)
            {
              this.buffer.clear();
              this.buffer.append(oldBuffer);
            }
            found = false;
            break;
          }
          if (takeIfMatch)
          {
            this.takeCurrent();
          }
          else
          {
            this.moveNext();
          }
        }
        if (takeIfMatch && found)
        {
          lookahead.accept();
        }
      });
      return found;
    }
    
    /**
     * Moves to the next character in the input
     * @function
     */
    protected moveNext(): void
    {
      this.source.read();
    }
    
    /**
     * Reads the next symbol
     * @function
     * @returns {TSymbol}
     */
    public nextSymbol(): TSymbol
    {
      this.startSymbol();
      
      if (this.endOfFile)
      {
        return null;
      }
      var sym = this.turn(); 
      
      return sym || null;
    }
    
    /**
     * Peeks at the next character in the source.
     * @function
     * @returns {string}
     */
    protected peek(): string
    {
      var result: string;
      var that = this;
      using (this, this.source.beginLookahead(), function () {
        that.moveNext();
        result = that.currentCharacter;
      });
      
      return result;
    }
    
    /**
     * Tokenizes a Razor comment
     * @function
     * @returns {StateResult<TSymbol>}
     */
    protected razorCommentBody(): StateResult<TSymbol>
    {
      var that = this;
      
      this.takeUntil(c => c === '*');      
      if (this.currentCharacter === '*')
      {
        var star = this.currentCharacter;
        var start = this.currentLocation;
        this.moveNext();
        if (!this.endOfFile && this.currentCharacter === '@')
        {
          var next: State<TSymbol> = <State<TSymbol>>(() =>
          {
            this.buffer.append(star);
            
            return this.transition(this.endSymbol(start, this.razorCommentStarType), <State<TSymbol>>(() => 
            {
              if (this.currentCharacter !== '@')
              {
                return this.transition(this.startState);
              }
              this.takeCurrent();
              return this.transition(this.endSymbol(this.razorCommentTransitionType), this.startState);
            }));
          });
          
          if (this.haveContent)
          {
            return this.transition(this.endSymbol(this.razorCommentType), next);
          }
          return this.transition(next);
        }
        else
        {
          this.buffer.append(star);
          return this.stay();
        }
      }
      
      return this.transition(this.endSymbol(this.razorCommentType), this.startState);
    }
    
    /**
     * Resets the tokenizer
     * @function
     */
    public reset(): void
    {
      this.currentState = this.startState;
    }
    
    /**
     * Resumes the previous symbol
     * @function
     * @param {TSymbol} previous - The previous symbol to resume
     */
    protected resumeSymbol(previous: TSymbol): void
    {
      if (previous.start.absoluteIndex + previous.content.length !== this.currentStart.absoluteIndex)
      {
        throw "Cannot resume symbol unless it is the previous symbol";
      }
      
      this._currentStart = previous.start;
      var newContent = this.buffer.toString();
      
      this.buffer.clear();
      this.buffer.append(previous.content);
      this.buffer.append(newContent);
    }
    
    /**
     * Takes the current symbol as a single instance of the given type.
     * @function
     * @param {TSymbolType} type - The symbol type
     * @returns {TSymbol}
     */
    protected single(type: TSymbolType): TSymbol
    {
      this.takeCurrent();
      return this.endSymbol(type);
    }
    
    /**
     * Prepares the tokenizer to start a new symbol
     * @function
     */
    protected startSymbol(): void
    {
      this.buffer.clear();
      this._currentStart = this.currentLocation;
      this._currentErrors = [];
    }
    
    /**
     * Takes all characters if they match the given string
     * @function
     * @param {string} expected - The expected string.
     * @param {boolean} caseSensitive - Whether to make a case sensitive match
     * @returns {booelan}
     */
    protected takeAll(expected: string, caseSensitive: boolean): boolean
    {
      return this.lookahead(expected, true, caseSensitive);  
    }
    
    /**
     * Takes the current character
     * @function
     */
    protected takeCurrent(): void
    {
      if (this.endOfFile)
      {
        return;
      }
      
      this.buffer.append(this.currentCharacter);
      this.moveNext();
    }
    
    /**
     * Takes the given string into the buffer
     * @function
     * @param {string} input - The input string to match
     * @param {boolean} caseSensitive - Whether to perform a case sensitive match.
     * @returns {boolean}
     */
    protected takeString(input: string, caseSensitive: boolean)
    {
      var position = 0;
      var filter: (c: string) => string = c => c;
      if (caseSensitive)
      {
        filter = c => c.toLowerCase();
      }
      while (!this.endOfFile && position < input.length && filter(this.currentCharacter) == filter(input[position++]))
      {
        this.takeCurrent();
      }
      return (position === input.length);
    }
    
    /**
     * Continues taking content until the predicate is matched.
     * @function
     * @param {Function} predicate - The predicate to match
     * @returns {boolean}
     */
    protected takeUntil(predicate: (c: string) => boolean): boolean
    {
      while (!this.endOfFile && !predicate(this.currentCharacter))
      {
        this.takeCurrent();
      }
      
      return !this.endOfFile;
    }
  }
}