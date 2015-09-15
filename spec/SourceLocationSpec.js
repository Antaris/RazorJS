/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/razor.d.ts" />

describe("Razor", function () {
  
  var SourceLocation = Razor.SourceLocation;
  
  describe("SourceLocation", function () {
    
    it("can be constructed with line and character index which sets associated properties", function () {
      // Act
      var loc = new SourceLocation(0, 42, 24);
      
      // Assert
      expect(loc.absoluteIndex).toEqual(0);
      expect(loc.lineIndex).toEqual(42);
      expect(loc.characterIndex).toEqual(24);
    });
    
    it(".add() ignores character index if right line index is non-zero", function () {
      // Arrange
      var sourceLocationA = new SourceLocation(1, 2, 3);
      var sourceLocationB = new SourceLocation(4, 5, 6);
      
      // Act
      var result = SourceLocation.add(sourceLocationA, sourceLocationB);
      
      // Assert
      expect(result.absoluteIndex).toEqual(5);
      expect(result.lineIndex).toEqual(7);
      expect(result.characterIndex).toEqual(6);
    });
    
    it(".add() uses character index if right line index is zero", function () {
      // Arrange
      var sourceLocationA = new SourceLocation(2, 5, 3);
      var sourceLocationB = new SourceLocation(4, 0, 6);
      
      // Act
      var result = SourceLocation.add(sourceLocationA, sourceLocationB);
      
      // Assert
      expect(result.absoluteIndex).toEqual(6);
      expect(result.lineIndex).toEqual(5);
      expect(result.characterIndex).toEqual(9);
    });
    
    it(".subtract() uses difference of character indexes if line indexes are the same", function () {
      // Arrange
      var sourceLocationA = new SourceLocation(1, 5, 3);
      var sourceLocationB = new SourceLocation(5, 5, 6);
      
      // Act
      var result = SourceLocation.subtract(sourceLocationB, sourceLocationA);
      
      // Assert
      expect(result.absoluteIndex).toEqual(4);
      expect(result.lineIndex).toEqual(0);
      expect(result.characterIndex).toEqual(3);
    });
    
    it(".subtract() uses left character index if line indexes are different", function () {
      // Arrange
      var sourceLocationA = new SourceLocation(2, 0, 3);
      var sourceLocationB = new SourceLocation(4, 5, 6);
      
      // Act
      var result = SourceLocation.subtract(sourceLocationB, sourceLocationA);
      
      // Assert
      expect(result.absoluteIndex).toEqual(2);
      expect(result.lineIndex).toEqual(5);
      expect(result.characterIndex).toEqual(6);
    });
    
  });
  
});