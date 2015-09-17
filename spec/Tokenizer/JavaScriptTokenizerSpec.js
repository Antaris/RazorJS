/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../dist/razor.d.ts" />

describe("Razor.Tokenizer", function () {
  
  var JavaScriptSymbolType = Razor.Tokenizer.Symbols.JavaScriptSymbolType,
      JavaScriptSymbol = Razor.Tokenizer.Symbols.JavaScriptSymbol,
      JavaScriptTokenizer = Razor.Tokenizer.JavaScriptTokenizer,
      SourceLocation = Razor.SourceLocation,
      StringBuilder = Razor.Text.StringBuilder,
      StringTextReader = Razor.Text.StringTextReader,
      SeekableTextReader = Razor.Text.SeekableTextReader,
      Environment = Razor.Environment,
      using = Razor.Using;
      
  describe("JavaScriptTokenizer", function () {
    
    // TOKENS AND OPERATORS
    it("recognizes dot (.)", function () {
      testSingleToken('.', JavaScriptSymbolType.Dot);
    });
    
    it("recognizes assignment ([)", function () {
      testSingleToken('=', JavaScriptSymbolType.Assignment);
    });
    
    it("recognizes left bracket ([)", function () {
      testSingleToken('[', JavaScriptSymbolType.LeftBracket);
    });
    
    it("recognizes right bracket (])", function () {
      testSingleToken(']', JavaScriptSymbolType.RightBracket);
    });
    
    it("recognizes left paren (()", function () {
      testSingleToken('(', JavaScriptSymbolType.LeftParen);
    });
    
    it("recognizes right paren ()", function () {
      testSingleToken(')', JavaScriptSymbolType.RightParen);
    });
    
    it("recognizes left brace ({)", function () {
      testSingleToken('{', JavaScriptSymbolType.LeftBrace);
    });
    
    it("recognizes right brace (})", function () {
      testSingleToken('}', JavaScriptSymbolType.RightBrace);
    });
    
    it("recognizes plus (+)", function () {
      testSingleToken('+', JavaScriptSymbolType.Plus);
    });
    
    it("recognizes minus (-)", function () {
      testSingleToken('-', JavaScriptSymbolType.Minus);
    });
    
    it("recognizes modulo (%)", function () {
      testSingleToken('%', JavaScriptSymbolType.Modulo);
    });
    
    it("recognizes increment (++)", function () {
      testSingleToken('++', JavaScriptSymbolType.Increment);
    });
    
    it("recognizes decrement (--)", function () {
      testSingleToken('--', JavaScriptSymbolType.Decrement);
    });
    
    it("recognizes bitwise NOT (~)", function () {
      testSingleToken('~', JavaScriptSymbolType.BitwiseNot);
    });
    
    it("recognizes logical NOT (!)", function () {
      testSingleToken('!', JavaScriptSymbolType.LogicalNot);
    });
    
    it("recognizes divide (/)", function () {
      testSingleToken('/', JavaScriptSymbolType.Divide);
    });
    
    it("recognizes multiply (*)", function () {
      testSingleToken('*', JavaScriptSymbolType.Multiply);
    });
    
    it("recognizes exponentiation (**)", function () {
      testSingleToken('**', JavaScriptSymbolType.Exponentiation);
    });
    
    it("recognizes less than (<)", function () {
      testSingleToken('<', JavaScriptSymbolType.LessThan);
    });
    
    it("recognizes less than equal to (<=)", function () {
      testSingleToken('<=', JavaScriptSymbolType.LessThanEqualTo);
    });
    
    it("recognizes greater than (>)", function () {
      testSingleToken('>', JavaScriptSymbolType.GreaterThan);
    });
    
    it("recognizes greater than equal to (>=)", function () {
      testSingleToken('>=', JavaScriptSymbolType.GreaterThenEqualTo);
    });
    
    it("recognizes equal (==)", function () {
      testSingleToken('==', JavaScriptSymbolType.Equal);
    });
    
    it("recognizes strict equal (===)", function () {
      testSingleToken('===', JavaScriptSymbolType.StrictEqual);
    });
    
    it("recognizes not equal (!=)", function () {
      testSingleToken('!=', JavaScriptSymbolType.NotEqual);
    });
    
    it("recognizes strict not equal (!==)", function () {
      testSingleToken('!==', JavaScriptSymbolType.StrictNotEqual);
    });
    
    it("recognizes bitwise left shift (<<)", function () {
      testSingleToken('<<', JavaScriptSymbolType.BitwiseLeftShift);
    });
    
    it("recognizes bitwise right shift (>>)", function () {
      testSingleToken('>>', JavaScriptSymbolType.BitwiseRightShift);
    });
    
    it("recognizes unsigned bitwise right shift (>>>)", function () {
      testSingleToken('>>>', JavaScriptSymbolType.BitwiseUnsignedRightShift);
    });
    
    it("recognizes bitwise AND (&)", function () {
      testSingleToken('&', JavaScriptSymbolType.BitwiseAnd);
    });
    
    it("recognizes bitwise OR (|)", function () {
      testSingleToken('|', JavaScriptSymbolType.BitwiseOr);
    });
    
    it("recognizes bitwise XOR (^)", function () {
      testSingleToken('^', JavaScriptSymbolType.BitwiseXor);
    });
    
    it("recognizes logical AND (&&)", function () {
      testSingleToken('&&', JavaScriptSymbolType.LogicalAnd);
    });
    
    it("recognizes logical OR (||)", function () {
      testSingleToken('||', JavaScriptSymbolType.LogicalOr);
    });
    
    it("recognizes question mark (?)", function () {
      testSingleToken('?', JavaScriptSymbolType.QuestionMark);
    });
    
    it("recognizes colon (:)", function () {
      testSingleToken(':', JavaScriptSymbolType.Colon);
    });
    
    it("recognizes multiplication assignment (*=)", function () {
      testSingleToken('*=', JavaScriptSymbolType.MultiplicationAssignment);
    });
    
    it("recognizes division assignment (/=)", function () {
      testSingleToken('/=', JavaScriptSymbolType.DivisionAssignment);
    });
    
    it("recognizes modulo assignment (%=)", function () {
      testSingleToken('%=', JavaScriptSymbolType.ModuloAssignment);
    });
    
    it("recognizes addition assignment (+=)", function () {
      testSingleToken('+=', JavaScriptSymbolType.AdditionAssignment);
    });
    
    it("recognizes subtraction assignment (-=)", function () {
      testSingleToken('-=', JavaScriptSymbolType.SubtractionAssignment);
    });
    
    it("recognizes bitwise left shift assignment (<<=)", function () {
      testSingleToken('<<=', JavaScriptSymbolType.BitwiseLeftShiftAssignment);
    });
    
    it("recognizes bitwise right shift assignment (>>=)", function () {
      testSingleToken('>>=', JavaScriptSymbolType.BitwiseRightShiftAssignment);
    });
    
    it("recognizes bitwise unsigned right shift assignment (>>>=)", function () {
      testSingleToken('>>>=', JavaScriptSymbolType.BitwiseUnsignedRightShiftAssignment);
    });
    
    it("recognizes colon (,)", function () {
      testSingleToken(',', JavaScriptSymbolType.Comma);
    });
    
    it("recognizes colon (\\)", function () {
      testSingleToken('\\', JavaScriptSymbolType.Backslash);
    });
    
    it("recognizes colon (;)", function () {
      testSingleToken(';', JavaScriptSymbolType.Semicolon);
    });
        
    // LITERALS
    it("recognizes regex literal", function () {
      testSingleToken("/hello/", JavaScriptSymbolType.RegularExpressionLiteral);
    });
    
    it("recognizes regex literal with flag", function () {
      testSingleToken("/hello/i", JavaScriptSymbolType.RegularExpressionLiteral);
    });
    
    it("recognizes regex literal with flags", function () {
      testSingleToken("/hello/ig", JavaScriptSymbolType.RegularExpressionLiteral);
    });
    
    it("recognizes simple integer literal", function () {
      testSingleToken("01189998819991197253", JavaScriptSymbolType.IntegerlLiteral);
    });
    
    it("recognizes simple integer literal with exponent", function () {
      testSingleToken("1e10", JavaScriptSymbolType.RealLiteral);
      testSingleToken("1E10", JavaScriptSymbolType.RealLiteral);
      testSingleToken("1e+10", JavaScriptSymbolType.RealLiteral);
      testSingleToken("1E+10", JavaScriptSymbolType.RealLiteral);
      testSingleToken("1e-10", JavaScriptSymbolType.RealLiteral);
      testSingleToken("1E-10", JavaScriptSymbolType.RealLiteral);
    });
    
    it("recognizes simple real literal with exponent", function () {
      testSingleToken("3.14159e10", JavaScriptSymbolType.RealLiteral);
      testSingleToken("3.14159E10", JavaScriptSymbolType.RealLiteral);
      testSingleToken("3.14159e+10", JavaScriptSymbolType.RealLiteral);
      testSingleToken("3.14159E+10", JavaScriptSymbolType.RealLiteral);
      testSingleToken("3.14159e-10", JavaScriptSymbolType.RealLiteral);
      testSingleToken("3.14159E-10", JavaScriptSymbolType.RealLiteral);
    });
    
    it("trailing letter is not part of integer literal", function () {
      testTokenizer("42a",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "42", JavaScriptSymbolType.IntegerlLiteral),
        ignoreRemaining
      ]);
    });
    
    it("dot followed by non digit is not part of real literal", function () {
      testTokenizer("3.a",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "3", JavaScriptSymbolType.IntegerlLiteral),
        ignoreRemaining
      ]);
    });
    
    it("recognizes simple real literal", function () {
      testSingleToken("3.14159", JavaScriptSymbolType.RealLiteral);
    });
    
    it("recognizes simple real literal between 0 and 1", function () {
      testSingleToken(".14159", JavaScriptSymbolType.RealLiteral);
    });
    
    it("recognizes simple hex literal", function () {
      testSingleToken("0x0123456789ABCDEF", JavaScriptSymbolType.HexLiteral);
    });
    
    it("trailing letter is not part of hex literal", function () {
      testTokenizer("0x0123456789ABCDEFz",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "0x0123456789ABCDEF", JavaScriptSymbolType.HexLiteral),
        ignoreRemaining
      ]);
    });
    
    it("recognizes simple octal literal", function () {
      testSingleToken("0o12412345311", JavaScriptSymbolType.OctalLiteral);
    });
    
    it("trailing letter is not part of octal literal", function () {
      testTokenizer("0o12412345311z",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "0o12412345311", JavaScriptSymbolType.OctalLiteral),
        ignoreRemaining
      ]);
    });
    
    it("recognizes simple binary literal", function () {
      testSingleToken("0b01010101001111000", JavaScriptSymbolType.BinaryLiteral);
    });
    
    it("trailing letter is not part of binary literal", function () {
      testTokenizer("0b01010101001111000z",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "0b01010101001111000", JavaScriptSymbolType.BinaryLiteral),
        ignoreRemaining
      ]);
    });
    
    it("recognizes single character literal using single quote", function () {
      testSingleToken("'f'", JavaScriptSymbolType.StringLiteral);
    });
    
    it("recognizes multi character literal using single quote", function () {
      testSingleToken("'foo'", JavaScriptSymbolType.StringLiteral);
    });
    
    it("string literal is terminated by EOF if unterminated using single quote", function () {
      testSingleToken("'foo bar", JavaScriptSymbolType.StringLiteral);
    });
    
    it("string literal not terminated by escaped quote using single quote", function () {
      testSingleToken("'foo\\'bar'", JavaScriptSymbolType.StringLiteral);
    });
    
    it("string literal terminated by EOL if unterminated using single quote", function () {
      testTokenizer("'foo\n",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "'foo", JavaScriptSymbolType.StringLiteral),
        ignoreRemaining
      ]);
    });
    
    it("string literal terminated by EOL if unterminated even when last char is slash using single quote", function () {
      testTokenizer("'foo\\\n",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "'foo\\", JavaScriptSymbolType.StringLiteral),
        ignoreRemaining
      ]);
    });
    
    it("string literal terminated by EOL if unterminated even when last char is slash and followed by stuff using single quote", function () {
      testTokenizer("'foo\\\nflarg",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "'foo\\", JavaScriptSymbolType.StringLiteral),
        ignoreRemaining
      ]);
    });
    
    it("string literal terminated by CRLF if unterminated even when last char is slash using single quote", function () {
      testTokenizer("'foo\\" + Environment.NewLine,
      [
        new JavaScriptSymbol(SL(0, 0, 0), "'foo\\", JavaScriptSymbolType.StringLiteral),
        ignoreRemaining
      ]);
    });
    
    it("string literal terminated by EOL if unterminated even when last char is slash and followed by stuff using single quote", function () {
      testTokenizer("'foo\\" + Environment.NewLine + "flarg",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "'foo\\", JavaScriptSymbolType.StringLiteral),
        ignoreRemaining
      ]);
    });
    
    it("string literal allows escaped escape using single quote", function () {
      testTokenizer("'foo\\\\'blah",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "'foo\\\\'", JavaScriptSymbolType.StringLiteral),
        ignoreRemaining
      ]);
    });
    
    it("recognizes single character literal using double quote", function () {
      testSingleToken('"f"', JavaScriptSymbolType.StringLiteral);
    });
    
    it("recognizes multi character literal using double quote", function () {
      testSingleToken('"foo"', JavaScriptSymbolType.StringLiteral);
    });
    
    it("string literal is terminated by EOF if unterminated using double quote", function () {
      testSingleToken('"foo bar', JavaScriptSymbolType.StringLiteral);
    });
    
    it("string literal not terminated by escaped quote using double quote", function () {
      testSingleToken('"foo\\"bar', JavaScriptSymbolType.StringLiteral);
    });
    
    it("string literal terminated by EOL if unterminated using double quote", function () {
      testTokenizer('"foo\n',
      [
        new JavaScriptSymbol(SL(0, 0, 0), '"foo', JavaScriptSymbolType.StringLiteral),
        ignoreRemaining
      ]);
    });
    
    it("string literal terminated by EOL if unterminated even when last char is slash using double quote", function () {
      testTokenizer('"foo\\\n',
      [
        new JavaScriptSymbol(SL(0, 0, 0), '"foo\\', JavaScriptSymbolType.StringLiteral),
        ignoreRemaining
      ]);
    });
    
    it("string literal terminated by EOL if unterminated even when last char is slash and followed by stuff using double quote", function () {
      testTokenizer('"foo\\\nflarg',
      [
        new JavaScriptSymbol(SL(0, 0, 0), '"foo\\', JavaScriptSymbolType.StringLiteral),
        ignoreRemaining
      ]);
    });
    
    it("string literal terminated by CRLF if unterminated even when last char is slash using double quote", function () {
      testTokenizer('"foo\\' + Environment.NewLine,
      [
        new JavaScriptSymbol(SL(0, 0, 0), '"foo\\', JavaScriptSymbolType.StringLiteral),
        ignoreRemaining
      ]);
    });
    
    it("string literal terminated by EOL if unterminated even when last char is slash and followed by stuff using double quote", function () {
      testTokenizer('"foo\\' + Environment.NewLine + "flarg",
      [
        new JavaScriptSymbol(SL(0, 0, 0), '"foo\\', JavaScriptSymbolType.StringLiteral),
        ignoreRemaining
      ]);
    });
    
    it("string literal allows escaped escape using double quote", function () {
      testTokenizer('"foo\\\\"blah',
      [
        new JavaScriptSymbol(SL(0, 0, 0), '"foo\\\\"', JavaScriptSymbolType.StringLiteral),
        ignoreRemaining
      ]);
    });
    
    // COMMENTS
    it("next ignores star at EOF in razor comments", function () {
      testTokenizer("@* Foo * Bar * Baz *",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "@", JavaScriptSymbolType.RazorCommentTransition),
        new JavaScriptSymbol(SL(1, 0, 1), "*", JavaScriptSymbolType.RazorCommentStar),
        new JavaScriptSymbol(SL(2, 0, 2), " Foo * Bar * Baz *", JavaScriptSymbolType.RazorComment)
      ]);
    });
    
    it("next ignores star without trailing slash", function () {
      testTokenizer("@* Foo * Bar * Baz *@",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "@", JavaScriptSymbolType.RazorCommentTransition),
        new JavaScriptSymbol(SL(1, 0, 1), "*", JavaScriptSymbolType.RazorCommentStar),
        new JavaScriptSymbol(SL(2, 0, 2), " Foo * Bar * Baz ", JavaScriptSymbolType.RazorComment),
        new JavaScriptSymbol(SL(19, 0, 19), "*", JavaScriptSymbolType.RazorCommentStar),
        new JavaScriptSymbol(SL(20, 0, 20), "@", JavaScriptSymbolType.RazorCommentTransition)
      ]);
    });
    
    it("next returns razor comment token for entire razor comment", function () {
      testTokenizer("@* Foo Bar Baz *@",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "@", JavaScriptSymbolType.RazorCommentTransition),
        new JavaScriptSymbol(SL(1, 0, 1), "*", JavaScriptSymbolType.RazorCommentStar),
        new JavaScriptSymbol(SL(2, 0, 2), " Foo Bar Baz ", JavaScriptSymbolType.RazorComment),
        new JavaScriptSymbol(SL(15, 0, 15), "*", JavaScriptSymbolType.RazorCommentStar),
        new JavaScriptSymbol(SL(16, 0, 16), "@", JavaScriptSymbolType.RazorCommentTransition)
      ]);
    });
    
    it("next returns comment token for entire single line comment", function () {
      testTokenizer("// Foo Bar Biz",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "// Foo Bar Biz", JavaScriptSymbolType.Comment)
      ]);
    });
    
    it("single line comment is terminated by new line", function () {
      testTokenizer("// Foo Bar Biz\na",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "// Foo Bar Biz", JavaScriptSymbolType.Comment),
        ignoreRemaining
      ]);
    });
    
    it("multi line comment in single line comment has no effect", function () {
      testTokenizer("// Foo/*Bar*/ Baz\na",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "// Foo/*Bar*/ Baz", JavaScriptSymbolType.Comment),
        ignoreRemaining
      ]);
    });
    
    it("next returns comment token for entire multi line comment", function () {
      testTokenizer("/* Foo\nBar\nBaz */",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "/* Foo\nBar\nBaz */", JavaScriptSymbolType.Comment)
      ]);
    });
    
    it("multi line comment is terminated by end sequence", function () {
      testTokenizer("/* Foo\nBar\nBaz */a",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "/* Foo\nBar\nBaz */", JavaScriptSymbolType.Comment),
        ignoreRemaining
      ]);
    });
    
    it("unterminated multi live comment captures to EOF", function () {
      testTokenizer("/* Foo\nBar\nBaz",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "/* Foo\nBar\nBaz", JavaScriptSymbolType.Comment)
      ]);
    });
    
    it("nested multi line comments terminated at first end seqeunce", function () {
      testTokenizer("/* Foo/*\nBar\nBaz*/ */",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "/* Foo/*\nBar\nBaz*/", JavaScriptSymbolType.Comment),
        ignoreRemaining
      ]);
    });
    
    it("nested multiline comments terminated at full end sequence", function () {
      testTokenizer("/* Foo\nBar\nBaz* */",
      [
        new JavaScriptSymbol(SL(0, 0, 0), "/* Foo\nBar\nBaz* */", JavaScriptSymbolType.Comment),
        ignoreRemaining
      ]);
    });
    
    // IDENTIFIERS
    it("simple identifier is recognized", function () {
      testTokenizer("foo", [new JavaScriptSymbol(SL(0, 0, 0), "foo", JavaScriptSymbolType.Identifier)]);
    });
    
    it("identifier starting with underscore is recognized", function () {
      testTokenizer("_foo", [new JavaScriptSymbol(SL(0, 0, 0), "_foo", JavaScriptSymbolType.Identifier)]);
    });
    
    it("identifier can contain digits", function () {
      testTokenizer("foo4", [new JavaScriptSymbol(SL(0, 0, 0), "foo4", JavaScriptSymbolType.Identifier)]);
    });
    
  });
  
  var ignoreRemaining = new JavaScriptSymbol(SL(0, 0, 0), '', JavaScriptSymbolType.Unknown);
  
  function createTokenizer(source)
  {
    return new JavaScriptTokenizer(source);
  }
  
  function SL(absolute, line, char)
  {
    return new SourceLocation(absolute, line, char);
  }
  
  function testSingleToken(text, expectedSymbolType)
  {
    testTokenizer(text, [new JavaScriptSymbol(SL(0, 0, 0), text, expectedSymbolType)]);
  }
  
  function testTokenizer(input, symbols)
  {
    var success = true,
        output = new StringBuilder(),
        reader = new StringTextReader(input),
        source = new SeekableTextReader(reader);
       
    symbols = symbols || [];
        
    using (reader, function() {
      using (source, function() {
        
        var tokenizer = createTokenizer(source),
            counter = 0,
            current = null;
            
        while ((current = tokenizer.nextSymbol()) !== null)
        {
          if (counter >= symbols.length)
          {
            output.appendLine('F: Expected: << Nothing >>; Actual: ' + current.toString());
            success = false;
          }
          else if (symbols[counter].equals(ignoreRemaining))
          {
            output.appendLine('P: Ignored ' + current.toString());
          }
          else
          {
            if (!symbols[counter].equals(current))
            {
              output.appendLine('F: Expected: ' + symbols[counter].toString() + '; Actual: ' + current.toString());
              success = false;
            }
            else
            {
              output.appendLine('P: Expected: ' + current.toString());
            }
            counter++;
          }
        }
        if (counter < symbols.length && !symbols[counter].equals(ignoreRemaining))
        {
          success = false;
          for (; counter < symbols.length; counter++)
          {
            output.appendLine('F: Expected: ' + symbols[counter].toString() + '; Actual: << None >>');
          }
        }
        
      });
    })
    
    if (!success)
    {
      console.log(output.toString());
    }
    expect(success).toEqual(true);
  }
  
});