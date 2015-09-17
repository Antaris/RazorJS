/// <reference path="Symbols/HtmlSymbol.ts" />
/// <reference path="Symbols/HtmlSymbolType.ts" />
/// <reference path="Tokenizer.ts" />
/// <reference path="../Text/ITextDocument.ts" />
/// <reference path="../Text/SeekableTextReader.ts" />
/// <reference path="../Internals/Using.ts" />
/// <reference path="../Parser/ParserHelpers.ts" />

namespace Razor.Tokenizer
{
  import HtmlSymbol = Razor.Tokenizer.Symbols.HtmlSymbol;
  import HtmlSymbolType = Razor.Tokenizer.Symbols.HtmlSymbolType;
  import ITextDocument = Razor.Text.ITextDocument;
  import SeekableTextReader = Razor.Text.SeekableTextReader;
  import ParserHelpers = Razor.Parser.ParserHelpers;
  import using = Razor.Using;
  
  var transitionChar = '@';
  
  /**
   * Provides tokenizer support for HTML documents.
   * @class
   */
  export class HtmlTokenizer extends Tokenizer<HtmlSymbol, HtmlSymbolType>
  {
    /**
     * Initialises a new instance of an HTML tokenizer
     * @constructor
     * @param {ITextDocument} source - The source document
     */
    constructor(source: ITextDocument)
    {
      super(source);
      
      this.currentState = <State<HtmlSymbol>>this.data;
    }
    
    /**
     * Gets the start state
     * @property
     * @readonly
     * @returns {State<HtmlSymbol>}
     */
    protected get startState(): State<HtmlSymbol>
    {
      return <State<HtmlSymbol>>this.data;
    }
    
    public get razorCommentStarType(): HtmlSymbolType { return HtmlSymbolType.RazorCommentStar; }
    public get razorCommentType(): HtmlSymbolType { return HtmlSymbolType.RazorComment; }
    public get razorCommentTransitionType(): HtmlSymbolType { return HtmlSymbolType.RazorCommentTransition; }
    
    /**
     * Determines if the current character represents an HTML symbol
     * @function
     * @returns {boolean}
     */
    private atSymbol(): boolean
    {
      return this.currentCharacter === '<' ||
             this.currentCharacter === '!' ||
             this.currentCharacter === '/' ||
             this.currentCharacter === '?' ||
             this.currentCharacter === '[' ||
             this.currentCharacter === '>' ||
             this.currentCharacter === ']' ||
             this.currentCharacter === '=' ||
             this.currentCharacter === '"' ||
             this.currentCharacter === "'" ||
             this.currentCharacter === '@' ||
             (this.currentCharacter === '-' && this.peek() === '-'); 
    }
    
    /**
     * Creates a symbol
     * @function
     * @param {SourceLocation} start - The start location
     * @param {string} content - The symbol content
     * @param {HtmlSymbolType} type - The symbol type
     * @param {RazorError[]} errors - Any errors discovered while tokenizing
     * @returns {TSymbol}
     */
    protected createSymbol(start: SourceLocation, content: string, type: HtmlSymbolType, errors: RazorError[]): HtmlSymbol
    {
      return new HtmlSymbol(start, content, type, errors);
    }
    
    /**
     * The default state for tokenizing HTML content
     * @function
     * @returns {StateResult<HtmlSymbol>}
     */
    private data(): StateResult<HtmlSymbol>
    {
      if (ParserHelpers.isWhiteSpace(this.currentCharacter))
      {
        return this.stay(this.whiteSpace());
      }
      else if (ParserHelpers.isNewLine(this.currentCharacter))
      {
        return this.stay(this.newLine());
      }
      else if (this.currentCharacter === transitionChar)
      {
        this.takeCurrent();
        if (this.currentCharacter === '*')
        {
          return this.transition(this.endSymbol(HtmlSymbolType.RazorCommentTransition), <State<HtmlSymbol>>this.afterRazorCommentTransition);
        }
        else if (this.currentCharacter === transitionChar)
        {
          return this.transition(this.endSymbol(HtmlSymbolType.Transition), <State<HtmlSymbol>>(() =>
          {
            this.takeCurrent();
            return this.transition(this.endSymbol(HtmlSymbolType.Transition), <State<HtmlSymbol>>this.data);
          }));
        }
        return this.stay(this.endSymbol(HtmlSymbolType.Transition));
      }
      else if (this.atSymbol())
      {
        return this.stay(this.symbol());
      }
      else
      {
        return this.transition(<State<HtmlSymbol>>this.text);
      }
    }
    
    /**
     * Accepts a new line combination (\\r \\n \\r\\n) and returns them as a single symbol
     * @function
     * @returns {HtmlSymbol}
     */
    private newLine(): HtmlSymbol
    {
      var check = (this.currentCharacter === '\r');
      this.takeCurrent();
      if (check && (this.currentCharacter === '\n'))
      {
        this.takeCurrent();
      }
      return this.endSymbol(HtmlSymbolType.NewLine);
    }
    
    /**
     * Returns the symbol represented by the current character
     * @function
     * @returns {HtmlSymbol}
     */
    private symbol(): HtmlSymbol
    {
      var sym = this.currentCharacter;
      this.takeCurrent();
      switch (sym)
      {
        case '<': return this.endSymbol(HtmlSymbolType.OpenAngle);
        case '!': return this.endSymbol(HtmlSymbolType.Bang);
        case '/': return this.endSymbol(HtmlSymbolType.ForwardSlash);
        case '?': return this.endSymbol(HtmlSymbolType.QuestionMark);
        case '[': return this.endSymbol(HtmlSymbolType.LeftBracket);
        case '>': return this.endSymbol(HtmlSymbolType.CloseAngle);
        case ']': return this.endSymbol(HtmlSymbolType.RightBracket);
        case '=': return this.endSymbol(HtmlSymbolType.Equals);
        case '"': return this.endSymbol(HtmlSymbolType.DoubleQuote);
        case "'": return this.endSymbol(HtmlSymbolType.SingleQuote);
        case '-':
        {
          this.takeCurrent();
          return this.endSymbol(HtmlSymbolType.DoubleHyphen);
        }
        default:
        {
          return this.endSymbol(HtmlSymbolType.Unknown);
        }
      }
    }
    
    /**
     * Tokenizers HTML text
     * @function
     * @returns {StateResult<HtmlSymbol>}
     */
    private text(): StateResult<HtmlSymbol>
    {
      var prev = '\0';
      while (!this.endOfFile && !ParserHelpers.isWhiteSpaceOrNewLine(this.currentCharacter) && !this.atSymbol())
      {
        prev = this.currentCharacter;
        this.takeCurrent();
      }
      
      if (this.currentCharacter === transitionChar)
      {
        var next = this.peek();
        if (ParserHelpers.isLetterOrDecimalDigit(prev) && ParserHelpers.isLetterOrDecimalDigit(next))
        {
          this.takeCurrent();
          return this.stay();
        }
      }
      
      return this.transition(this.endSymbol(HtmlSymbolType.Text), <State<HtmlSymbol>>this.data);
    }
    
    /**
     * Tokenizes the given content string
     * @function
     * @static
     * @param {string} content - The content to tokenize
     * @returns {HtmlSymbol[]}
     */
    public static tokenize(content: string): HtmlSymbol[]
    {
      var reader = new SeekableTextReader(content);
      var symbols: HtmlSymbol[] = [];
      using (reader, () => {
        var tok = new HtmlTokenizer(reader);
        var sym: HtmlSymbol;
        while ((sym = tok.nextSymbol()) !== null)
        {
          symbols.push(sym);
        }
      });
      return symbols;
    }
    
    /**
     * Accepts all characters while they are whitespace and returns them as a single symbol.
     * @function
     * @returns {HtmlSymbol}
     */
    private whiteSpace(): HtmlSymbol
    {
      while (ParserHelpers.isWhiteSpace(this.currentCharacter))
      {
        this.takeCurrent();
      }
      return this.endSymbol(HtmlSymbolType.WhiteSpace);
    }
  }
}