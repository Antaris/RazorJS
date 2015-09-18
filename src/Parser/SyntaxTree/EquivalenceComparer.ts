/// <reference path="SyntaxTreeNode.ts" />

namespace Razor.Parser.SyntaxTree
{
  /**
   * A comparer for testing syntax tree node equivalence
   * @class
   */
  export class EquivalenceComparer
  {
    /**
     * Compares two syntax tree nodes for equivalence
     * @function
     * @param {SyntaxTreeNode} nodeX - The first node
     * @param {SyntaxTreeNode} nodeY - The second node
     * @returns {boolean}
     */
    public equals(nodeX: SyntaxTreeNode, nodeY: SyntaxTreeNode): boolean
    {
      if (nodeX === nodeY)
      {
        return true;
      }
      
      return (!!nodeX && nodeX.equivalentTo(nodeY));
    }
  }
}