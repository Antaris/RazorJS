/// <reference path="Parser/SyntaxTree/Block.ts" />
/// <reference path="ErrorSink.ts" />
/// <reference path="RazorError.ts" />

namespace Razor
{
  import Block = Razor.Parser.SyntaxTree.Block;
  import ErrorSink = Razor.ErrorSink;
  import RazorError = Razor.RazorError;
  
  /**
   * Represents the results from a parser operation.
   * @class
   */
  export class ParserResults
  {
    private _success: boolean;
    private _document: Block;
    private _errorSink: ErrorSink;
    private _tagHelperDescriptors: any[];
    private _prefix: string;
    
    /**
     * Initialises a new instance of parser results
     * @constructor
     * @param {Block} document - The root document block
     * @param {any[]} tagHelperDescriptors - The tag helper descriptors
     * @param {ErrorSink} errorSink - The error sink
     * @param {booelan} [success] - Was the operation successful?
     */
    constructor(document: Block, tagHelperDescriptors: any[], errorSink: ErrorSink, success?: boolean)
    {
      if (arguments.length > 3)
      {
        success = (errorSink.errors.length === 0);
      }
      
      this._success = success;
      this._document = document;
      this._errorSink = errorSink;
      this._tagHelperDescriptors = tagHelperDescriptors;
      this._prefix = null;
      if (tagHelperDescriptors && tagHelperDescriptors.length)
      {
        this._prefix = tagHelperDescriptors[0].prefix;
      }
    }
    
    /**
     * Gets the root document
     * @property
     * @readonly
     * @returns {Block}
     */
    public get document(): Block
    {
      return this._document;
    }
    
    /**
     * Gets the error sink
     * @property
     * @readonly
     * @returns {ErrorSink}
     */
    public get errorSink(): ErrorSink
    {
      return this._errorSink;
    }
    
    /**
     * Gets the set of errors encountered during the parser operation
     * @property
     * @readonly
     * @returns {RazorError[]}
     */
    public get parserErrors(): RazorError[]
    {
      return this._errorSink.errors;
    }
    
    /**
     * Gets the prefix
     * @property
     * @readonly
     * @returns {string}
     */
    public get prefix(): string
    {
      return this._prefix;
    }
    
    /**
     * Gets whether the parser operation was successful
     * @property
     * @readonly
     * @returns {boolean}
     */
    public get success(): boolean
    {
      return this._success;
    }
    
    /**
     * Gets the tag helper descriptors
     * @property
     * @readonly
     * @returns {any[]}
     */
    public get tagHelperDescriptors(): any[]
    {
      return this._tagHelperDescriptors;
    }
  }
}