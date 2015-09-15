/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../dist/razor.d.ts" />

describe("Razor.Text", function () {
  
  var SourceLocation = Razor.SourceLocation,
      SourceLocationTracker = Razor.Text.SourceLocationTracker;
      
  describe("SourceLocationTracker", function () {
    
    var testStartLocation = new SourceLocation(10, 42, 45);
    
    it("can be constructed without a source location, defaulting to SourceLocation.Zero", function () {
      // Act
      var result = SourceLocation.Zero.equals(new SourceLocationTracker().currentLocation);
      
      // Assert
      expect(result).toEqual(true);
    });
    
    it("can be constructed wit out location", function () {
      // Arrange
      var loc = new SourceLocation(10, 42, 4);
      
      // Act
      var result = loc.equals(new SourceLocationTracker(loc).currentLocation);
      
      // Assert
      expect(result).toEqual(true);
    });
    
    it("updateLocation() advances correctly for multi-line string", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation("foo\nbar\rbaz\r\nbox");
      
      // Assert
      expect(tracker.currentLocation.absoluteIndex).toEqual(26);
      expect(tracker.currentLocation.lineIndex).toEqual(45);
      expect(tracker.currentLocation.characterIndex).toEqual(3);
    });
    
    it("updateLocation() advances absolute index on non-newline character", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation('f', 'o');
      
      // Assert
      expect(tracker.currentLocation.absoluteIndex).toEqual(11);
    });
    
    it("updateLocation() advances character index on non-newline character", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation('f', 'o');
      
      // Assert
      expect(tracker.currentLocation.characterIndex).toEqual(46);
    });
    
    it("updateLocation() does not advance line index on non-newline character", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation('f', 'o');
      
      // Assert
      expect(tracker.currentLocation.lineIndex).toEqual(42);
    });
    
    it("updateLocation() advances line index on \\n", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation('\n', 'o');
      
      // Assert
      expect(tracker.currentLocation.lineIndex).toEqual(43);
    });
    
    it("updateLocation() advances absolute index on \\n", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation('\n', 'o');
      
      // Assert
      expect(tracker.currentLocation.absoluteIndex).toEqual(11);
    });
    
    it("updateLocation() resets character index on \\n", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation('\n', 'o');
      
      // Assert
      expect(tracker.currentLocation.characterIndex).toEqual(0);
    });
    
    it("updateLocation() advances line index on \\r followed by non-newline character", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation('\r', 'o');
      
      // Assert
      expect(tracker.currentLocation.lineIndex).toEqual(43);
    });
    
    it("updateLocation() advances line index on \\r followed by non-newline character", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation('\r', 'o');
      
      // Assert
      expect(tracker.currentLocation.absoluteIndex).toEqual(11);
    });
    
    it("updateLocation() resets character index on \\r followed by non-newline character", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation('\r', 'o');
      
      // Assert
      expect(tracker.currentLocation.characterIndex).toEqual(0);
    });
    
    it("updateLocation() does not advance line index on \\r followed by \\n", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation('\r', '\n');
      
      // Assert
      expect(tracker.currentLocation.lineIndex).toEqual(42);
    });
    
    it("updateLocation() advances absolute index on \\r followed by \\n", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation('\r', '\n');
      
      // Assert
      expect(tracker.currentLocation.absoluteIndex).toEqual(11);
    });
    
    it("updateLocation() advances character index on \\r followed by \\n", function () {
      // Arrange
      var tracker = new SourceLocationTracker(testStartLocation);
      
      // Act
      tracker.updateLocation('\r', '\n');
      
      // Assert
      expect(tracker.currentLocation.characterIndex).toEqual(46);
    });
    
  });
  
});