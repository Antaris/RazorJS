/// <reference path="../../Internals/IEquatable.ts" />
/// <reference path="Block.ts" />
/// <reference path="../../SourceLocation.ts" />
/// <reference path="../ParserVisitor.ts" />

namespace Razor.Parser.SyntaxTree
{  
  /**
   * Represents a node in a syntax tree
   * @class
   */
  export class SyntaxTreeNode implements IEquatable<SyntaxTreeNode>
  {
    /**
     * Gets whether the node is a block.
     * @property
     * @readonly
     * @type {boolean}
     */
    public isBlock: boolean;
    
    /**
     * Gets the length of the block.
     * @property
     * @readonly
     * @type {number}
     */
    public length: number;
    
    /**
     * Gets or sets the parent block.
     * @property
     * @type {Block}
     */
    public parent: Block;
    
    /**
     * Gets the start location for the block.
     * @property
     * @readonly
     * @type {SourceLocation}
     */
    public start: SourceLocation;
    
    /**
     * Passes the node to the visitor
     * @function
     * @param {ParserVisitor} visitor - The parser visitor
     */
    public accept(visitor: ParserVisitor): void { }
    
    /**
     * Determines if the given node is equivalent to the current node.
     * @function
     * @param {Span} node - The syntax tree node to test
     * @returns {boolean}
     */
    public equals(other: SyntaxTreeNode): boolean
    {
      return false;
    }
    
    /**
     * Determines if the given node is equivalent to the current node.
     * @function
     * @param {SyntaxTreeNode} node - The syntax tree node to test
     * @returns {boolean}
     */
    public equivalentTo(node: SyntaxTreeNode): boolean
    {
      return false;
    }
  }
}