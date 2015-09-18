/// <reference path="../RazorError.ts" />
/// <reference path="SyntaxTree/Block.ts" />
/// <reference path="SyntaxTree/Span.ts" />
/// <reference path="../ParserResults.ts" />

namespace Razor.Parser
{
  import RazorError = Razor.RazorError;
  import Block = Razor.Parser.SyntaxTree.Block;
  import Span = Razor.Parser.SyntaxTree.Span;
  import ParserResults = Razor.ParserResults;
  
  /**
   * Provides a visitor for traversing a syntax tree for parsing
   * @class
   */
  export class ParserVisitor
  {
    /**
     * Fired when the visit phase is completed
     * @function
     */
    public onComplete(): void
    {
      
    }
    
    /**
     * Visits the results of a parser operation.
     * @function
     * @param {ParserResult} result - The result
     */
    public visit(result: ParserResults): void
    {
      result.document.accept(this);
      for (var i = 0; i < result.parserErrors.length; i++)
      {
        this.visitError(result.parserErrors[i]);
      }
      this.onComplete();
    }
    
    /**
     * Visits a block
     * @function
     * @param {Block} block - The block
     */
    public visitBlock(block: Block): void
    {
      this.visitStartBlock(block);
      for (var i = 0; i < block.children.length; i++)
      {
        block.children[i].accept(this);
      }
      this.visitEndBlock(block);
    }
    
    /**
     * Visits a block after its children have been visited
     * @function
     * @param {Block} block - The block
     */
    public visitEndBlock(block: Block): void
    {
      
    }

    /**
     * Visits an error
     * @function
     * @param {RazorError} error - The error
     */    
    public visitError(error: RazorError): void
    {
      
    }
    
    /**
     * Visits a span
     * @function
     * @param {Span} span - The span
     */
    public visitSpan(span: Span): void
    {
      
    }
    
    /**
     * Visits a block before its children are visited
     * @function
     * @param {Block} block - The block
     */
    public visitStartBlock(block: Block): void
    {
      
    }
  }
}