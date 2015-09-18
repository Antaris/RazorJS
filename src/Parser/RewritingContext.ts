/// <reference path="SyntaxTree/Block.ts" />
/// <reference path="../ErrorSink.ts" />

namespace Razor.Parser
{
  import Block = Razor.Parser.SyntaxTree.Block;
  import ErrorSink = Razor.ErrorSink;
  
  /**
   * Provides a context for rewriting operations
   * @class
   */
  export class RewritingContext
  {
    private _errorSink: ErrorSink;
    private _errors: RazorError[];
    
    /**
     * Initialises a new instance of a rewriting context.
     * @constructor
     * @param {Block} syntaxTree - The syntax tree
     * @param {ErrorSink} errorSink - The error sink
     */
    constructor(syntaxTree: Block, errorSink: ErrorSink)
    {
      this.syntaxTree = syntaxTree;
      this._errors = [];
      this._errorSink = errorSink;
    }
    
    /**
     * Gets the error sink.
     * @property
     * @readonly
     * @returns {ErrorSink}
     */
    public get errorSink(): ErrorSink
    {
      return this._errorSink;
    }
    
    /**
     * Gets or sets the syntax tree
     * @property
     * @type {Block}
     */
    public syntaxTree: Block;
  }
}