/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../dist/razor.d.ts" />

describe("Razor.Text", function () {
  
  var LineTrackingStringBuffer = Razor.Text.LineTrackingStringBuffer;
  var SourceLocation = Razor.SourceLocation;
      
  describe("LineTrackingStringBuffer", function () {
    
    it("constructor initialises properties", function () {
      // Act
      var buffer = new LineTrackingStringBuffer();
      
      // Assert
      expect(buffer.length).toEqual(0);
    });
    
    it("charAt() correctly returns location", function () {
      // Arrange
      var buffer = new LineTrackingStringBuffer();
      buffer.append("foo\rbar\nbaz\r\nbiz");
      
      // Act
      var ref = buffer.charAt(14);
      
      // Assert
      expect(ref.character).toEqual('i');
      expect(ref.location.equals(new SourceLocation(14, 3, 1))).toEqual(true);
    });
    
  });
  
});