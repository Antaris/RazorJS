/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../dist/razor.d.ts" />
/// <reference path="../helpers/StringTextBuffer.d.ts" />

describe("Razor.Text", function () {
  
  var TextChange = Razor.Text.TextChange;
      
  describe("TextChange", function () {
    
    it("constructor initialises properties", function () {
      // Arrange
      var oldBuffer = new StringTextBuffer('');
      var newBuffer = new StringTextBuffer('');
      
      // Act
      var change = new TextChange(42, 24, oldBuffer, 1337, newBuffer);
      
      // Assert
      expect(change.oldPosition).toEqual(42);
      expect(change.oldLength).toEqual(24);
      expect(change.newLength).toEqual(1337);
      expect(change.oldBuffer).toEqual(oldBuffer);
      expect(change.newBuffer).toEqual(newBuffer);
    });
    
    it("isDelete returns true when change is a deletion", function () {
      // Arrange
      var oldBuffer = new StringTextBuffer('')
      var newBuffer = new StringTextBuffer('');
      var change = new TextChange(0, 1, oldBuffer, 0, newBuffer);
      
      // Act
      var isDelete = change.isDelete;
      
      // Assert
      expect(isDelete).toEqual(true);
    });
    
    it("creates the right size change for a deletion", function () {
      // Arrange
      var oldBuffer = new StringTextBuffer('d')
      var newBuffer = new StringTextBuffer('');
      var change = new TextChange(0, 1, oldBuffer, 0, newBuffer);
      
      // Assert
      expect(change.newText.length).toEqual(0);
      expect(change.oldText.length).toEqual(1);
    });
    
    it("isInsert returns true when change is an insert", function () {
      // Arrange
      var oldBuffer = new StringTextBuffer('')
      var newBuffer = new StringTextBuffer('i');
      var change = new TextChange(0, 0, oldBuffer, 1, newBuffer);
      
      // Act
      var isInsert = change.isInsert;
      
      // Assert
      expect(isInsert).toEqual(true);
    });
    
    it("creates the right size change for an insert", function() {
      // Arrange
      var oldBuffer = new StringTextBuffer('')
      var newBuffer = new StringTextBuffer('i');
      var change = new TextChange(0, 0, oldBuffer, 1, newBuffer);
      
      // Assert
      expect(change.newText.length).toEqual(1);
      expect(change.oldText.length).toEqual(0);
    });
    
    it("isReplace returns true when change is a replacement", function () {
      // Arrange
      var oldBuffer = new StringTextBuffer('d')
      var newBuffer = new StringTextBuffer('r');
      var change = new TextChange(0, 1, oldBuffer, 1, newBuffer);
      
      // Act
      var isReplace = change.isReplace;
      
      // Assert
      expect(isReplace).toEqual(true);
    });
    
    it("creates the right size change for an replacement", function() {
      // Arrange
      var oldBuffer = new StringTextBuffer('abcde')
      var newBuffer = new StringTextBuffer('fghijklmno');
      var change = new TextChange(0, 5, oldBuffer, 10, newBuffer);
      
      // Assert
      expect(change.newText.length).toEqual(10);
      expect(change.oldText.length).toEqual(5);
    });
    
    it("creates the right size change for an replacement (2)", function() {
      // Arrange
      var oldBuffer = new StringTextBuffer('abcde')
      var newBuffer = new StringTextBuffer('f');
      var change = new TextChange(0, 5, oldBuffer, 1, newBuffer);
      
      // Assert
      expect(change.newText.length).toEqual(1);
      expect(change.oldText.length).toEqual(5);
    });
    
    it("oldText returns old span from old buffer", function() {
      // Arrange
      var oldBuffer = new StringTextBuffer('text')
      var newBuffer = new StringTextBuffer('text');
      var change = new TextChange(2, 1, oldBuffer, 1, newBuffer);
      
      // Act
      var text = change.oldText;
      
      // Assert
      expect(text).toEqual("x");
    });
    
    it("oldText returns old span from old buffer (2)", function() {
      // Arrange
      var oldBuffer = new StringTextBuffer('text')
      var newBuffer = new StringTextBuffer('text');
      var change = new TextChange(2, 2, oldBuffer, 1, newBuffer);
      
      // Act
      var text = change.oldText;
      
      // Assert
      expect(text).toEqual("xt");
    });
    
    it("newText with insert returns changed text from buffer", function () {
      // Arrange
      var oldBuffer = new StringTextBuffer('');
      var newBuffer = new StringTextBuffer('test');
      var change = new TextChange(0, 0, oldBuffer, 3, newBuffer);
      
      // Act
      var newText = change.newText;
      var oldText = change.oldText;
      
      // Assert
      expect(newText).toEqual("tes");
      expect(oldText).toEqual("");
    });
    
    it("newText with delete returns empty string", function () {
      // Arrange
      var oldBuffer = new StringTextBuffer('');
      var newBuffer = new StringTextBuffer('test');
      var change = new TextChange(1, 1, oldBuffer, 0, newBuffer);
      
      // Act
      var newText = change.newText;
      
      // Assert
      expect(newText).toEqual("");
    });
    
    it("newText with replacement returns changed text from buffer", function () {
      // Arrange
      var oldBuffer = new StringTextBuffer('tebb');
      var newBuffer = new StringTextBuffer('test');
      var change = new TextChange(2, 2, oldBuffer, 1, newBuffer);
      
      // Act
      var newText = change.newText;
      var oldText = change.oldText;
      
      // Assert
      expect(newText).toEqual("s");
      expect(oldText).toEqual("bb");
    });
    
    it("applyChange() with inserted text returns new content with change applied", function () {
      // Arrange
      var oldBuffer = new StringTextBuffer('');
      var newBuffer = new StringTextBuffer('test');
      var change = new TextChange(0, 0, oldBuffer, 3, newBuffer);
      
      // Act
      var text = change.applyChange("abcd", 0);
      
      // Assert
      expect(text).toEqual("tesabcd");
    });
    
    it("applyChange() with removed text returns new content with change applied", function () {
      // Arrange
      var oldBuffer = new StringTextBuffer('');
      var newBuffer = new StringTextBuffer('abcdefg');
      var change = new TextChange(1, 1, oldBuffer, 0, newBuffer);
      
      // Act
      var text = change.applyChange("abcdefg", 1);
      
      // Assert
      expect(text).toEqual("bcdefg");
    });
    
    it("applyChange() with replaced text returns new content with change applied", function () {
      // Arrange
      var oldBuffer = new StringTextBuffer('');
      var newBuffer = new StringTextBuffer('abcdefg');
      var change = new TextChange(1, 1, oldBuffer, 2, newBuffer);
      
      // Act
      var text = change.applyChange("abcdefg", 1);
      
      // Assert
      expect(text).toEqual("bcbcdefg");
    });
    
    it("normalize fixes up intellisense style replacements", function () {
      // Arrange
      var oldBuffer = new StringTextBuffer('Date');
      var newBuffer = new StringTextBuffer('Date.');
      var original = new TextChange(0, 4, oldBuffer, 5, newBuffer);
      
      // Act
      var normalized = original.normalize();
      console.log(normalized);
      
      // Assert
      var result = normalized.equals(new TextChange(4, 0, oldBuffer, 1, newBuffer));
      expect(result).toEqual(true);
    });
    
  });
  
});