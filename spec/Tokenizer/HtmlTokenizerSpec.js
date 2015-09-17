/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../dist/razor.d.ts" />

describe("Razor.Tokenizer", function () {
  
  var HtmlSymbolType = Razor.Tokenizer.Symbols.HtmlSymbolType,
      HtmlSymbol = Razor.Tokenizer.Symbols.HtmlSymbol,
      HtmlTokenizer = Razor.Tokenizer.HtmlTokenizer,
      SourceLocation = Razor.SourceLocation,
      StringBuilder = Razor.Text.StringBuilder,
      StringTextReader = Razor.Text.StringTextReader,
      SeekableTextReader = Razor.Text.SeekableTextReader,
      using = Razor.Using;
      
  describe("HtmlTokenizer", function () {
    
    it("returns null when EOF is reached", function () {
      testTokenizer('');
    });
    
    it("recognizes text", function () {
      testTokenizer("foo-9309&smlkmb;::-3029022,.sdkq92384",
      [
        new HtmlSymbol(SL(0, 0, 0), "foo-9309&smlkmb;::-3029022,.sdkq92384", HtmlSymbolType.Text)
      ]);
    });
    
    it("recognizes whitespace", function () {
      testTokenizer(" \t\f ",
      [
        new HtmlSymbol(SL(0, 0, 0), " \t\f ", HtmlSymbolType.WhiteSpace)
      ]);
    });
    
    it("recognizes new lines", function () {
      testTokenizer("\n\r\r\n",
      [
        new HtmlSymbol(SL(0, 0, 0), "\n", HtmlSymbolType.NewLine),
        new HtmlSymbol(SL(1, 1, 0), "\r", HtmlSymbolType.NewLine),
        new HtmlSymbol(SL(2, 2, 0), "\r\n", HtmlSymbolType.NewLine)
      ]);
    });
    
    it("ignores transition character in mid-text when surrounded by alphanumberic characters", function () {
      testSingleToken("foo@bar", HtmlSymbolType.Text);
    });
    
    it("recognizes open angle (<)", function () {
      testSingleToken("<", HtmlSymbolType.OpenAngle);
    });
    
    it("recognizes bang (!)", function () {
      testSingleToken("!", HtmlSymbolType.Bang);
    });
    
    it("recognizes solidus (/)", function () {
      testSingleToken("/", HtmlSymbolType.ForwardSlash);
    });
    
    it("recognizes question mark (?)", function () {
      testSingleToken("?", HtmlSymbolType.QuestionMark);
    });
    
    it("recognizes left bracket ([)", function () {
      testSingleToken("[", HtmlSymbolType.LeftBracket);
    });
    
    it("recognizes close angle (>)", function () {
      testSingleToken(">", HtmlSymbolType.CloseAngle);
    });
    
    it("recognizes right bracket (])", function () {
      testSingleToken("]", HtmlSymbolType.RightBracket);
    });
    
    it("recognizes equals (=)", function () {
      testSingleToken("=", HtmlSymbolType.Equals);
    });
    
    it("recognizes double quote (\")", function () {
      testSingleToken("\"", HtmlSymbolType.DoubleQuote);
    });
    
    it("recognizes single quote (')", function () {
      testSingleToken("'", HtmlSymbolType.SingleQuote);
    });
    
    it("recognizes transition (@)", function () {
      testSingleToken("@", HtmlSymbolType.Transition);
    });
    
    it("recognizes double hyphen (--)", function () {
      testSingleToken("--", HtmlSymbolType.DoubleHyphen);
    });
    
    it("does not recognize single hyphen (-)", function () {
      testSingleToken("-", HtmlSymbolType.Text);
    });
    
    it("does not recognize single hyphen in mid-text as a separate token", function () {
      testSingleToken("foo-bar", HtmlSymbolType.Text);
    });
    
    it("ignores star at EOF in razor comment", function () {
      testTokenizer("@* Foo * Bar * Baz *",
      [
        new HtmlSymbol(SL(0, 0, 0), "@", HtmlSymbolType.RazorCommentTransition),
        new HtmlSymbol(SL(1, 0, 1), "*", HtmlSymbolType.RazorCommentStar),
        new HtmlSymbol(SL(2, 0, 2), " Foo * Bar * Baz *", HtmlSymbolType.RazorComment)
      ]);
    });
    
    it("ignores star without trailing at (@)", function () {
      testTokenizer("@* Foo * Bar * Baz *@",
      [
        new HtmlSymbol(SL(0, 0, 0), "@", HtmlSymbolType.RazorCommentTransition),
        new HtmlSymbol(SL(1, 0, 1), "*", HtmlSymbolType.RazorCommentStar),
        new HtmlSymbol(SL(2, 0, 2), " Foo * Bar * Baz ", HtmlSymbolType.RazorComment),
        new HtmlSymbol(SL(19, 0, 19), "*", HtmlSymbolType.RazorCommentStar),
        new HtmlSymbol(SL(20, 0, 20), "@", HtmlSymbolType.RazorCommentTransition)
      ]);
    });
    
    it("returns razor comment token for entire razor comment", function () {
      testTokenizer("@* Foo Bar Baz *@",
      [
        new HtmlSymbol(SL(0, 0, 0), "@", HtmlSymbolType.RazorCommentTransition),
        new HtmlSymbol(SL(1, 0, 1), "*", HtmlSymbolType.RazorCommentStar),
        new HtmlSymbol(SL(2, 0, 2), " Foo Bar Baz ", HtmlSymbolType.RazorComment),
        new HtmlSymbol(SL(15, 0, 15), "*", HtmlSymbolType.RazorCommentStar),
        new HtmlSymbol(SL(16, 0, 16), "@", HtmlSymbolType.RazorCommentTransition)
      ]);
    });
    
    it("after cancelling lookahead tokenizer returns same tokens as it did before lookahead", function () {
      var tokenizer = new HtmlTokenizer(new SeekableTextReader("<foo>"));
      using (tokenizer.source.beginLookahead(), function () {
        expect(new HtmlSymbol(SL(0, 0, 0), "<", HtmlSymbolType.OpenAngle).equals(tokenizer.nextSymbol())).toEqual(true);
        expect(new HtmlSymbol(SL(1, 0, 1), "foo", HtmlSymbolType.Text).equals(tokenizer.nextSymbol())).toEqual(true);
        expect(new HtmlSymbol(SL(4, 0, 4), ">", HtmlSymbolType.CloseAngle).equals(tokenizer.nextSymbol())).toEqual(true);
      });
      expect(new HtmlSymbol(SL(0, 0, 0), "<", HtmlSymbolType.OpenAngle).equals(tokenizer.nextSymbol())).toEqual(true);
      expect(new HtmlSymbol(SL(1, 0, 1), "foo", HtmlSymbolType.Text).equals(tokenizer.nextSymbol())).toEqual(true);
      expect(new HtmlSymbol(SL(4, 0, 4), ">", HtmlSymbolType.CloseAngle).equals(tokenizer.nextSymbol())).toEqual(true);
    });
    
  });
  
  var ignoreRemaining = new HtmlSymbol(SL(0, 0, 0), '', HtmlSymbolType.Unknown);
  
  function createTokenizer(source)
  {
    return new HtmlTokenizer(source);
  }
  
  function SL(absolute, line, char)
  {
    return new SourceLocation(absolute, line, char);
  }
  
  function testSingleToken(text, expectedSymbolType)
  {
    testTokenizer(text, [new HtmlSymbol(SL(0, 0, 0), text, expectedSymbolType)]);
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
          else if (current === ignoreRemaining)
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
        if (counter < symbols.length && symbols[counter] !== ignoreRemaining)
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