/// <reference path="../SourceLocation.ts" />
/// <reference path="../Parser/SyntaxTree/SyntaxTreeNode.ts" />

namespace Razor.Chunks
{
  import SyntaxTreeNode = Razor.Parser.SyntaxTree.SyntaxTreeNode;
  
  /**
   * Represents a chunk
   * @class
   */
  export class Chunk
  {
    /**
     * Gets or sets the associated syntax tree node
     * @property
     * @type {SyntaxTreeNode}
     */
    public association: SyntaxTreeNode;
    
    /**
     * Gets or sets the start location
     * @property
     * @type {SourceLocation}
     */
    public start: SourceLocation;
  }
}