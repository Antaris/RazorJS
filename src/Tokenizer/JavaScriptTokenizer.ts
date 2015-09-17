/// <reference path="Symbols/JavaScriptSymbol.ts" />
/// <reference path="Symbols/JavaScriptSymbolType.ts" />
/// <reference path="Tokenizer.ts" />
/// <reference path="../Text/ITextDocument.ts" />
/// <reference path="../Text/SeekableTextReader.ts" />
/// <reference path="../Internals/Using.ts" />
/// <reference path="../RazorError.ts" />
/// <reference path="../Parser/ParserHelpers.ts" />
/// <reference path="JavaScriptKeywordDetector.ts" />
/// <reference path="JavaScriptHelpers.ts" />"
/// <reference path="OperatorHandler.ts" />

namespace Razor.Tokenizer
{
  import JavaScriptSymbol = Razor.Tokenizer.Symbols.JavaScriptSymbol;
  import JavaScriptSymbolType = Razor.Tokenizer.Symbols.JavaScriptSymbolType;
  import ITextDocument = Razor.Text.ITextDocument;
  import SeekableTextReader = Razor.Text.SeekableTextReader;
  import ParserHelpers = Razor.Parser.ParserHelpers;
  import JavaScriptHelpers = Razor.Tokenizer.JavaScriptHelpers;
  import JavaScriptKeywordDetector = Razor.Tokenizer.JavaScriptKeywordDetector;
  import OperatorHandler = Razor.Tokenizer.OperatorHandler;
  import using = Razor.Using;
  import RazorError = Razor.RazorError;
  
  var transitionChar = '@';
  
  /**
   * Provides tokenizer support for JavaScript documents.
   * @class
   */
  export class JavaScriptTokenizer extends Tokenizer<JavaScriptSymbol, JavaScriptSymbolType>
  {
    private _operatorHandlers: { [id: string]: OperatorHandler } = { };
    
    /**
     * Initialises a new instance of an JavaScript tokenizer
     * @constructor
     * @param {ITextDocument} source - The source document
     */
    constructor(source: ITextDocument)
    {
      super(source);
      
      this.currentState = <State<JavaScriptSymbol>>this.data;
      
      this._operatorHandlers = 
      {
        '.': () => JavaScriptSymbolType.Dot,
        '[': () => JavaScriptSymbolType.LeftBracket,
        ']': () => JavaScriptSymbolType.RightBracket,
        '(': () => JavaScriptSymbolType.LeftParen,
        ')': () => JavaScriptSymbolType.RightParen,
        '{': () => JavaScriptSymbolType.LeftBrace,
        '}': () => JavaScriptSymbolType.RightBrace,
        '?': () => JavaScriptSymbolType.QuestionMark,
        ':': () => JavaScriptSymbolType.Colon,
        ',': () => JavaScriptSymbolType.Comma,
        "'": () => JavaScriptSymbolType.SingleQuote,
        '"': () => JavaScriptSymbolType.DoubleQuote,
        '\\': () => JavaScriptSymbolType.Backslash,
        ';': () => JavaScriptSymbolType.Semicolon,
        '~': () => JavaScriptSymbolType.BitwiseNot,
        
        '+': this.createTwoCharOperatorHandler(JavaScriptSymbolType.Plus, '+', JavaScriptSymbolType.Increment, '=', JavaScriptSymbolType.AdditionAssignment),
        '-': this.createTwoCharOperatorHandler(JavaScriptSymbolType.Minus, '-', JavaScriptSymbolType.Decrement, '=', JavaScriptSymbolType.SubtractionAssignment),
        '%': this.createTwoCharOperatorHandler(JavaScriptSymbolType.Modulo, '=', JavaScriptSymbolType.ModuloAssignment),
        '!': this.bangOperator,
        '/': this.createTwoCharOperatorHandler(JavaScriptSymbolType.Divide, '=', JavaScriptSymbolType.DivisionAssignment),
        '*': this.createTwoCharOperatorHandler(JavaScriptSymbolType.Multiply, '*', JavaScriptSymbolType.Exponentiation, '=', JavaScriptSymbolType.MultiplicationAssignment),
        '<': this.lessThanOperator,
        '>': this.greaterThanOperator,
        '=': this.equalityOperator,
        '&': this.createTwoCharOperatorHandler(JavaScriptSymbolType.BitwiseAnd, '&', JavaScriptSymbolType.LogicalAnd, '=', JavaScriptSymbolType.BitwiseAndAssignment),
        '|': this.createTwoCharOperatorHandler(JavaScriptSymbolType.BitwiseOr, '|', JavaScriptSymbolType.LogicalOr, '=', JavaScriptSymbolType.BitwiseOrAssignment),
        '^': this.createTwoCharOperatorHandler(JavaScriptSymbolType.BitwiseXor, '=', JavaScriptSymbolType.BitwiseXorAssignment)
      };
    }
    
    /**
     * Gets the start state
     * @property
     * @readonly
     * @returns {State<HtmlSymbol>}
     */
    protected get startState(): State<JavaScriptSymbol>
    {
      return <State<JavaScriptSymbol>>this.data;
    }
    
    public get razorCommentStarType(): JavaScriptSymbolType { return JavaScriptSymbolType.RazorCommentStar; }
    public get razorCommentType(): JavaScriptSymbolType { return JavaScriptSymbolType.RazorComment; }
    public get razorCommentTransitionType(): JavaScriptSymbolType { return JavaScriptSymbolType.RazorCommentTransition; }
    
    /**
     * Tokensizes the @ symbol
     * @function
     * @returns {StateResult<JavaScriptSymboo>}
     */
    private atSymbol(): StateResult<JavaScriptSymbol>
    {
      this.takeCurrent();
      if (this.currentCharacter === '*')
      {
        return this.transition(this.endSymbol(JavaScriptSymbolType.RazorCommentTransition), <State<JavaScriptSymbol>>this.afterRazorCommentTransition);
      }
      else if (this.currentCharacter === '@')
      {
        return this.transition(this.endSymbol(JavaScriptSymbolType.Transition), <State<JavaScriptSymbol>>(() =>
        {
          this.takeCurrent();
          return this.transition(this.endSymbol(JavaScriptSymbolType.Transition), <State<JavaScriptSymbol>>this.data);
        }));
      }
      return this.stay(this.endSymbol(JavaScriptSymbolType.Transition));
    }
    
    /**
     * Tokenizes symbols that start with a ! token.
     * @returns {JavaScriptSymbolType}
     */
    private bangOperator(): JavaScriptSymbolType
    {
      if (this.currentCharacter === '=')
      {
        this.takeCurrent();
        if (this.currentCharacter === '=')
        {
          this.takeCurrent();
          return JavaScriptSymbolType.StrictNotEqual;
        }
        return JavaScriptSymbolType.NotEqual;
      }
      return JavaScriptSymbolType.LogicalNot;
    }
    
    /**
     * Tokenizes a binary literal
     * @function
     * @returns {StateResult<JavaScriptSymbol>}
     */
    private binaryLiteral(): StateResult<JavaScriptSymbol>
    {
      this.takeUntil((c: string) => !ParserHelpers.isBinaryDigit(c));
      return this.stay(this.endSymbol(JavaScriptSymbolType.BinaryLiteral));
    }
    
    /**
     * Tokenizes a block comment
     * @returns {StateResult<JavaScriptSymbol>}
     */
    private blockComment(): StateResult<JavaScriptSymbol>
    {
      this.takeUntil((c: string) => c === '*');
      if (this.endOfFile)
      {
        this.currentErrors.push(new RazorError('Untermined block comment', this.currentStart, 1));
        return this.transition(this.endSymbol(JavaScriptSymbolType.Comment), <State<JavaScriptSymbol>>this.data);
      }
      if (this.currentCharacter === '*')
      {
        this.takeCurrent();
        if (this.currentCharacter === '/')
        {
          this.takeCurrent();
          return this.transition(this.endSymbol(JavaScriptSymbolType.Comment), <State<JavaScriptSymbol>>this.data);
        }
      }
      return this.stay();
    }
    
    /**
     * Creates a handler used to determine the current symbol type
     * @function
     * @param {JavaScriptSymbolType} typeIfOnlyFirst - The symbol type if the current character only matches the first token
     * @param {string} [option1] - The first token
     * @param {JavaScriptSymbolType} [typeIfOption1] - The symbol type if the current character matches option1
     * @param {string} [option2] - The second token
     * @param {JavaScriptSymbolType} [typeIfOption2] - The symbol type if the current character matches option2
     * @returns {OperatorHandler}
     */
    private createTwoCharOperatorHandler(typeIfOnlyFirst: JavaScriptSymbolType, option1?: string, typeIfOption1?: JavaScriptSymbolType, option2?: string, typeIfOption2?: JavaScriptSymbolType): OperatorHandler
    {
      return <OperatorHandler>(() => 
      {
        if (!!option1 && this.currentCharacter === option1)
        {
          this.takeCurrent();
          return typeIfOption1;
        }
        else if (!!option2 && this.currentCharacter === option2)
        {
          this.takeCurrent();
          return typeIfOption2;
        }        
        return typeIfOnlyFirst;
      }); 
    }
    
    /**
     * Creates a symbol
     * @function
     * @param {SourceLocation} start - The start location
     * @param {string} content - The symbol content
     * @param {JavaScriptSymbolType} type - The symbol type
     * @param {RazorError[]} errors - Any errors discovered while tokenizing
     * @returns {TSymbol}
     */
    protected createSymbol(start: SourceLocation, content: string, type: JavaScriptSymbolType, errors: RazorError[]): JavaScriptSymbol
    {
      return new JavaScriptSymbol(start, content, type, errors);
    }
    
    /**
     * Tokenizes the body of a javascript document.
     */
    private data(): StateResult<JavaScriptSymbol>
    {
      if (ParserHelpers.isNewLine(this.currentCharacter))
      {
        var check = (this.currentCharacter === '\r');
        this.takeCurrent();
        if (check && this.currentCharacter === '\n')
        {
          this.takeCurrent();
        }
        return this.stay(this.endSymbol(JavaScriptSymbolType.NewLine));
      }
      else if (ParserHelpers.isWhiteSpace(this.currentCharacter))
      {
        this.takeUntil((c: string) => !ParserHelpers.isWhiteSpace(c));
        return this.stay(this.endSymbol(JavaScriptSymbolType.WhiteSpace));
      }
      else if (JavaScriptHelpers.isIdentifierStart(this.currentCharacter))
      {
        return this.identifier();
      }
      else if (ParserHelpers.isDecimalDigit(this.currentCharacter))
      {
        return this.numericLiteral();
      }
      switch (this.currentCharacter)
      {
        case '@': return this.atSymbol();
        case '\'':
        {
          this.takeCurrent();
          return this.transition(<State<JavaScriptSymbol>>(() => this.quotedLiteral('\'')));
        }
        case '"':
        {
          this.takeCurrent();
          return this.transition(<State<JavaScriptSymbol>>(() => this.quotedLiteral('"')));
        }
        case '.':
        {
          if (ParserHelpers.isDecimalDigit(this.peek()))
          {
            return this.realLiteral();
          }
          return this.stay(this.single(JavaScriptSymbolType.Dot));
        }
        case '/':
        {
          return this.solidus();
        }
        default:
        {
          return this.stay(this.endSymbol(this.operator()));
        }
      }
    }
    
    /**
     * Tokenizes a decimal literal.
     * @function
     * @returns {StateResult<JavaScriptSymbol>}
     */
    private decimalLiteral(): StateResult<JavaScriptSymbol>
    {
      this.takeUntil((c: string) => !ParserHelpers.isDecimalDigit(c));
      if (this.currentCharacter === '.' && ParserHelpers.isDecimalDigit(this.peek()))
      {
        return this.realLiteral();
      }
      else if (this.currentCharacter === 'E' || this.currentCharacter === 'e')
      {
        return this.realLiteralExponentPart();
      }
      else
      {
        return this.stay(this.endSymbol(JavaScriptSymbolType.IntegerlLiteral));
      }
    }
    
    /**
     * Tokenizes symbols that start with a = token.
     * @returns {JavaScriptSymbolType}
     */
    private equalityOperator(): JavaScriptSymbolType
    {
      if (this.currentCharacter === '=')
      {
        this.takeCurrent();
        if (this.currentCharacter === '=')
        {
          this.takeCurrent();
          return JavaScriptSymbolType.StrictEqual;
        }
        return JavaScriptSymbolType.Equal;
      }
      return JavaScriptSymbolType.Assignment;
    }
    
    /**
     * Tokenizes symbols that start with a > token.
     * @function
     * @returns {JavaScriptSymbolType}
     */
    private greaterThanOperator(): JavaScriptSymbolType
    {
      if (this.currentCharacter === '=')
      {
        this.takeCurrent();
        return JavaScriptSymbolType.GreaterThenEqualTo;
      }
      else if (this.currentCharacter === '>')
      {
        this.takeCurrent();
        if (this.currentCharacter === '=')
        {
          this.takeCurrent();
          return JavaScriptSymbolType.BitwiseRightShiftAssignment;
        }
        else if (this.currentCharacter === '>')
        {
          this.takeCurrent();
          if (this.currentCharacter === '=')
          {
            this.takeCurrent();
            return JavaScriptSymbolType.BitwiseUnsignedRightShiftAssignment;
          }
          return JavaScriptSymbolType.BitwiseUnsignedRightShift;
        }
        return JavaScriptSymbolType.BitwiseRightShift;
      }      
      return JavaScriptSymbolType.GreaterThan;
    }
    
    /**
     * Tokenizes a hex literal
     * @function
     * @returns {StateResult<JavaScriptSymbol>}
     */
    private hexLiteral(): StateResult<JavaScriptSymbol>
    {
      this.takeUntil((c: string) => !ParserHelpers.isHexDigit(c));
      return this.stay(this.endSymbol(JavaScriptSymbolType.HexLiteral));
    }
    
    /**
     * Tokenizes an identifier
     * @function
     * @returns {StateResult<JavaScriptSymbol>}
     */
    private identifier(): StateResult<JavaScriptSymbol>
    {
      this.takeCurrent();
      this.takeUntil((c: string) => !JavaScriptHelpers.isIdentifierPart(c));
      var sym: JavaScriptSymbol = null;
      if (this.haveContent)
      {
        var kwd = JavaScriptKeywordDetector.symbolTypeForIdentifier(this.buffer.toString());
        var type = JavaScriptSymbolType.Identifier;
        if (!!kwd)
        {
          type = JavaScriptSymbolType.Keyword;
        }
        sym = new JavaScriptSymbol(this.currentStart, this.buffer.toString(), type, null, kwd);
      }
      this.startSymbol();
      return this.stay(sym);
    }
    
    /**
     * Tokenizes symbols that start with a < token.
     * @function
     * @returns {JavaScriptSymbolType}
     */
    private lessThanOperator(): JavaScriptSymbolType
    {
      if (this.currentCharacter === '<')
      {
        this.takeCurrent();
        if (this.currentCharacter === '=')
        {
          this.takeCurrent();
          return JavaScriptSymbolType.BitwiseLeftShiftAssignment;
        }
        return JavaScriptSymbolType.BitwiseLeftShift;
      }
      else if (this.currentCharacter === '=')
      {
        this.takeCurrent();
        return JavaScriptSymbolType.LessThanEqualTo;
      }
      return JavaScriptSymbolType.LessThan;
    }
    
    /**
     * Tokenizes a numeric literal
     * @function
     * @returns {StateResult<JavaScriptSymbol>}
     */
    private numericLiteral(): StateResult<JavaScriptSymbol>
    {
      if (this.takeAll('0x', true))
      {
        return this.hexLiteral();
      }
      else if (this.takeAll('0b', true))
      {
        return this.binaryLiteral();
      }
      else if (this.takeAll('0o', true))
      {
        return this.octalLiteral();
      }
      return this.decimalLiteral();
    }
    
    /**
     * Tokenizes an octal literal
     * @function
     * @returns {StateResult<JavaScriptSymbol>}
     */
    private octalLiteral(): StateResult<JavaScriptSymbol>
    {
      this.takeUntil((c: string) => !ParserHelpers.isOctalDigit(c));
      return this.stay(this.endSymbol(JavaScriptSymbolType.OctalLiteral));
    }
    
    /**
     * Tokenizes an operator
     * @function
     * @returns {JavaScriptSymbolType}
     */
    private operator(): JavaScriptSymbolType
    {
      var first = this.currentCharacter, handler: OperatorHandler = this._operatorHandlers[first];
      this.takeCurrent();
      if (!!handler)
      {
        return handler.apply(this, [first]);
      }
      return JavaScriptSymbolType.Unknown;
    }
    
    /**
     * Tokenizes a quoted literal.
     * @function
     * @param {string} quote - The quote token (' or ")
     */
    private quotedLiteral(quote: string): StateResult<JavaScriptSymbol>
    {
      this.takeUntil((c: string) => c === '\\' || c === quote || ParserHelpers.isNewLine(c));
      if (this.currentCharacter === '\\')
      {
        this.takeCurrent();
        
        if (this.currentCharacter === quote || this.currentCharacter === '\\')
        {
          this.takeCurrent();
        }
        return this.stay();
      }
      else if (this.endOfFile || ParserHelpers.isNewLine(this.currentCharacter))
      {
        this.currentErrors.push(new RazorError('Unterminated string literal', this.currentStart, 1));
      }
      else
      {
        this.takeCurrent();
      }
      return this.transition(this.endSymbol(JavaScriptSymbolType.StringLiteral), <State<JavaScriptSymbol>>this.data);
    }
    
    /**
     * Tokenizes a real literal
     * @function
     * @returns {StateResult<JavaScriptSymbol>}
     */
    private realLiteral(): StateResult<JavaScriptSymbol>
    {
      this.takeCurrent();
      this.takeUntil((c: string) => !ParserHelpers.isDecimalDigit(c));
      return this.realLiteralExponentPart();
    }
    
    /**
     * Tokenizes the exponent part of a real literal
     * @function
     * @returns {StateResult<JavaScriptSymbol>}
     */
    private realLiteralExponentPart(): StateResult<JavaScriptSymbol>
    {
      if (this.currentCharacter === 'E' || this.currentCharacter === 'e')
      {
        this.takeCurrent();
        if (this.currentCharacter === '+' || this.currentCharacter === '-')
        {
          this.takeCurrent();
        }
        this.takeUntil((c: string) => !ParserHelpers.isDecimalDigit(c));
      }
      return this.stay(this.endSymbol(JavaScriptSymbolType.RealLiteral));
    }
    
    /**
     * Attempts to match a regular expression literal.
     * @function
     * @returns {boolean}
     */
    private regularExpressionLiteral(): boolean
    {
      var oldBuffer = this.buffer.toString();
      var lookahead = this.source.beginLookahead();
      var found = false;
      using (lookahead, () =>
      {
        this.takeCurrent(); // Take the leading /
        if (this.currentCharacter === '/' || this.currentCharacter === '*')
        {
          // We're actually in a comment.
          return;
        }
        while (!this.endOfFile)
        {
          if (ParserHelpers.isNewLine(this.currentCharacter))
          {
            // Not a valid regex.
            break;
          }
          
          this.takeCurrent(); // Take whatever character exists.
          if (this.currentCharacter === '/')
          {
            this.takeCurrent(); // Take the / charcter.
            
            // Handle Regex flags g,i,m,y
            while (/[igmy]/.test(this.currentCharacter))
            {
              this.takeCurrent();
            }
            
            found = true;
            lookahead.accept();
            break;
          }
        }
      });
      if (!found)
      {
        this.buffer.clear();
        this.buffer.append(oldBuffer);
      }
      return found;
    }
    
    /**
     * Tokenizes a single line comment
     * @function
     * @returns {StateResult<JavaScriptSymbol>}
     */
    private singleLineComment(): StateResult<JavaScriptSymbol>
    {
      this.takeUntil((c: string) => ParserHelpers.isNewLine(c));
      return this.stay(this.endSymbol(JavaScriptSymbolType.Comment));
    }
    
    /**
     * Tokenizes a solidus token
     * @function
     * @returns {StateResult<JavaScriptSymbol>}
     */
    private solidus(): StateResult<JavaScriptSymbol>
    {
      if (this.regularExpressionLiteral())
      {
        return this.stay(this.endSymbol(JavaScriptSymbolType.RegularExpressionLiteral));
      }

      if (this.peek() === '/')
      {
        this.takeCurrent(); // Leading /
        this.takeCurrent(); // Next /
        return this.singleLineComment();
      }
      else if (this.peek() === '*')
      {
        this.takeCurrent(); // Leading /
        this.takeCurrent(); // Next *
        return this.transition(<State<JavaScriptSymbol>>this.blockComment);
      }
      return this.stay(this.endSymbol(this.operator()));
    }
  }
}