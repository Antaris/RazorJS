/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../dist/razor.d.ts" />

describe("Razor.Text", function () {
  
  var BufferingTextReader = Razor.Text.BufferingTextReader,
      StringBuilder = Razor.Text.StringBuilder,
      StringTextReader = Razor.Text.StringTextReader,
      SourceLocation = Razor.SourceLocation,
      using = Razor.Using,
      EOF = -1;
      
  describe("BufferingTextReader", function () {
    
    var testString = "abcdefg";
    
    it("peek() retuns current character without advancing position", function () {
      runPeekTest("abc", 2);
    });
    
    it("peek() returns EOF at the end of a source reader", function () {
      runPeekTest("abc", 3);
    });
    
    it("read() returns current character and advances to next character", function () {
      runReadTest("abc", 2);
    });
    
    it("endLookahead() returns reader to previous location", function () {
      runLookaheadTest("abcdefg", "abcb",
        readSingle,
        lookahead(readSingle, readSingle),
        readSingle
      );
    });
    
    it("can perform multiple lookaheads", function () {
      runLookaheadTest("abcdefg", "abcbcdc",
        readSingle,
        lookahead(readSingle, readSingle),
        readSingle,
        lookahead(readSingle, readSingle),
        readSingle
      );
    });
    
    it("lookaheads can be nested", function () {
      runLookaheadTest("abcdefg", "abcdefebc", 
        readSingle,
        lookahead(
          readSingle,
          readSingle,
          readSingle,
          lookahead(
            readSingle,
            readSingle
          ),
          readSingle
        ),
        readSingle,
        readSingle
      );
    });
    
    it("source location is zero when initialized", function () {
      runSourceLocationTest("abcdefg", SourceLocation.Zero, 0);
    });
    
    it("character and absolute indexes increase as characters are read", function () {
      runSourceLocationTest("abcdefg", new SourceLocation(4, 0, 4), 4);
    });
    
    it("character and absolute indexes increase as \\r in two character new line is read", function () {
      runSourceLocationTest("f\r\nb", new SourceLocation(2, 0, 2), 2);
    });
    
    it("character index resets to zero and line index increments when \\n in two character new line is read", function () {
      runSourceLocationTest("f\r\nb", new SourceLocation(3, 1, 0), 3);
    });
    
    it("character index resets to zero and line index increemetns when \\r in single character new line is read", function () {
      runSourceLocationTest("f\rb", new SourceLocation(2, 1, 0), 2);
    });
    
    it("character index resets to zero and line index increemetns when \\n in single character new line is read", function () {
      runSourceLocationTest("f\nb", new SourceLocation(2, 1, 0), 2);
    });
    
    it("ending lookup resets raw character and line index to values when lookahead began", function () {
      runEndLookaheadUpdatesSourceLocationTest();
    });
    
    it("once buffering begins reads can continue past end of buffer", function () {
      runLookaheadTest("abcdefg", "abcbcdefg",
        readSingle,
        lookahead(read(2)),
        read(2),
        readToEnd
      );
    });
    
    it("read with buffer supports lookahead", function () {
      runBufferReadTest(function (reader, buffer, index, count) {
        return reader.read(buffer, index, count);
      });
    });
    
    it("read block supports lookahead", function () {
      runBufferReadTest(function (reader, buffer, index, count) {
        return reader.readBlock(buffer, index, count);
      });
    });
    
    it("read line supports lookahead", function () {
      runReadUntilTest(function (reader) {
        return reader.readLine();
      }, 8, 0, 2);
    });
    
    it("read to end supports lookahead", function () {
      runReadUntilTest(function (reader) {
        return reader.readToEnd();
      }, 11, 3, 2);
    });
    
    it("read line maintains correct character position", function () {
      runSourceLocationTest("abc\r\ndef", new SourceLocation(5, 1, 0), function (reader) {
        return reader.readLine();
      });
    });
    
    it("readToEnd() works like a normal text reader", function () {
      runReadToEndTest();
    });
    
    it("cancelBacktrack() stops next endLookahead from backtracking", function () {
      runLookaheadTest("abcdefg", "abcdefg",
        lookahead(
          read(2),
          cancelBacktrack
        ),
        readToEnd
      );
    });
    
    it("cancelBacktrack() only cancels backtracking for inner most nested lookahead", function () {
      runLookaheadTest("abcdefg", "abcdabcdefg",
        lookahead(
          read(2),
          lookahead(
            readSingle,
            cancelBacktrack
          ),
          readSingle
        ),
        readToEnd
      );
    });
    
    it("backtrack buffer is cleared when end reached and no current lookaheads", function () {
      // Arrange
      var reader = createReader(testString);
      
      reader.read();
      using (reader.beginLookahead(), function () {
        reader.read();
      });
      reader.read();
      
      expect(reader.buffer).toBeTruthy();
      
      // Act
      reader.read();
      expect(reader.buffering).toEqual(false);
      expect(reader.buffer.length).toEqual(0);
    });
    
  });
  
  function createReader(testString)
  {
    return new BufferingTextReader(new StringTextReader(testString));
  }
  
  function runPeekTest(input, peekAt)
  {
    peekAt = peekAt || 0;
    
    runPeekOrReadTest(input, peekAt, false);
  }
  
  function runReadTest(input, readAt)
  {
    readAt = readAt || 0;
    
    runPeekOrReadTest(input, readAt, true);
  }
  
  function runSourceLocationTest(input, expected, checkAtOrReaderAction)
  {
    if (typeof checkAtOrReaderAction === "function")
    {
      // Arrange
      var reader = createReader(input);
      checkAtOrReaderAction(reader);
      
      // Act
      var actual = reader.currentLocation;
      
      // Assert
      expect(actual.equals(expected)).toEqual(true);
    }
    else
    {
      var checkAt = checkAtOrReaderAction;
      runSourceLocationTest(input, expected, function(reader) {
        advanceReader(checkAt, reader);
      });  
    }
  }
  
  function runEndLookaheadUpdatesSourceLocationTest()
  {
    var expectedLocation = null;
    var actualLocation = null;
    
    runLookaheadTest(
      "abc\r\ndef\r\nghi", 
      null, 
      read(6), 
      captureSourceLocation(function (loc) { expectedLocation = loc; }),
      lookahead(
        read(6)
      ),
      captureSourceLocation(function (loc) { actualLocation = loc; }));
      
    // Assert
    expect(actualLocation.absoluteIndex).toEqual(expectedLocation.absoluteIndex);
    expect(actualLocation.lineIndex).toEqual(expectedLocation.lineIndex);
    expect(actualLocation.characterIndex).toEqual(expectedLocation.characterIndex);
  }
  
  function runReadToEndTest()
  {
    // Arrage
    var reader = createReader("abcdefg");
    
    // Act
    var str = reader.readToEnd();
    
    // Assert
    expect(str).toEqual("abcdefg");
  }
  
  function captureSourceLocation(capture)
  {
    return function (builder, reader) {
      capture(reader.currentLocation);
    };
  }
  
  function read(count)
  {
    return function(builder, reader) {
      for (var i = 0; i < count; i++)
      {
        readSingle(builder, reader);
      }
    };
  }
  
  function readSingle(builder, reader)
  {
    builder.append(reader.read());
  }
  
  function readToEnd(builder, reader)
  {
    builder.append(reader.readToEnd());
  }
  
  function cancelBacktrack(buffer, reader)
  {
    reader.cancelBacktrack();
  }
  
  function lookahead()
  {
    var args = Array.prototype.slice.call(arguments, 0);
    return function (builder, reader) {
      using(reader.beginLookahead(), function() {
        runAll(args, builder, reader);
      });
    };
  }
  
  function runLookaheadTest(input, expected) 
  {
    var args = Array.prototype.slice.call(arguments, 2);
    var builder = new StringBuilder();
    var reader = createReader(input);
    using (reader, function () {
      runAll(args, builder, reader);
    });
    
    if (!!expected) {
      expect(builder.toString()).toEqual(expected);
    }
  }
  
  function runReadUntilTest(readMethod, expectedAbsolute, expectedChar, expectedLine)
  {
    // Arrange
    var reader = createReader("\\r\nbcd\r\nefg");
    
    reader.read(); // Reader: "\r\nbcd\r\nefg"
    reader.read(); // Reader: "\nbcd\r\nefg"
    reader.read(); // Reader: "bcd\r\nefg"
    
    // Act
    var read;
    var actualLocation;
    using(reader.beginLookahead(), function () {
      read = readMethod(reader);
      actualLocation = reader.currentLocation;
    });
    
    // Assert
    expect(reader.currentLocation.absoluteIndex).toEqual(3);
    expect(reader.currentLocation.lineIndex).toEqual(1);
    expect(reader.currentLocation.characterIndex).toEqual(0);
    expect(actualLocation.absoluteIndex).toEqual(expectedAbsolute);
    expect(actualLocation.lineIndex).toEqual(expectedLine);
    expect(actualLocation.characterIndex).toEqual(expectedChar);
    expect(reader.peek()).toEqual('b');
    expect(readMethod(reader)).toEqual(read);
  }
  
  function runBufferReadTest(readMethod)
  {
    // Arrage
    var reader = createReader("abcdefg");
    
    reader.read();
    
    // Act
    var buffer = [];
    var read = -1;
    var actualLocation;
    using (reader.beginLookahead(), function () {
      read = readMethod(reader, buffer, 0, 4);
      actualLocation = reader.currentLocation;
    });
    
    // Assert
    expect(buffer.join('')).toEqual('bcde');
    expect(read).toEqual(4);
    expect(actualLocation.absoluteIndex).toEqual(5);
    expect(actualLocation.lineIndex).toEqual(0);
    expect(actualLocation.characterIndex).toEqual(5);
    expect(reader.currentLocation.lineIndex).toEqual(0);
    expect(reader.currentLocation.characterIndex).toEqual(1);
    expect(reader.peek()).toEqual('b');    
  }
  
  function runAll(commands, builder, reader)
  {
    for (var i = 0; i < commands.length; i++)
    {
      commands[i](builder, reader);
    }
  }
  
  function runPeekOrReadTest(input, offset, isRead)
  {
    var reader = createReader(input);
    using (reader, function () {
      advanceReader(offset, reader);
      
      var actual = (isRead) ? reader.read() : reader.peek();
      
      assertReaderValueCorrect(actual, input, offset);
      
      if (isRead)
      {
        assertReaderValueCorrect(reader.peek(), input, offset + 1);
      }
      else
      {
        expect(reader.peek()).toEqual(actual);
      }
    });
  }
  
  function advanceReader(offset, reader)
  {
    for (var i = 0; i < offset; i++)
    {
      var last = reader.read();
    }
  }
  
  function assertReaderValueCorrect(actual, input, offset)
  {
    if (offset < input.length)
    {
      expect(actual).toEqual(input[offset]);
    }
    else
    {
      expect(actual).toEqual(-1);
    }
  }
  
});