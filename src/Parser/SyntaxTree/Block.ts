/// <reference path="../../Internals/IEquatable.ts" />
/// <reference path="SyntaxTreeNode.ts" />
/// <reference path="BlockType.ts" />
/// <reference path="BlockBuilder.ts" />
/// <reference path="../../Tokenizer/Symbols/ISymbol.ts" />
/// <reference path="../../Text/StringBuilder.ts" />
/// <reference path="../../Text/TextChange.ts" />

namespace Razor.Parser.SyntaxTree
{
  import ISymbol = Razor.Tokenizer.Symbols.ISymbol;
  import StringBuilder = Razor.Text.StringBuilder;
  import TextChange = Razor.Text.TextChange;
  
  /**
   * Represents a block in a syntax tree
   * @class
   */
  export class Block extends SyntaxTreeNode implements IEquatable<Block>
  {
    private _children: SyntaxTreeNode[];
    //private _chunkGenetator: IParentChunkGenerator;
    private _type: BlockType;
    
    /**
     * Initialises a new instance of a block
     * @constructor
     * @param {BlockBuilder|BlockType} sourceOrType - The source block builder, or the block type
     * @param {SyntaxTreeNode[]} [content] - The content of the block
     * @param {IParentChunkGenerator} [generator] - The parent chunk generator
     */
    constructor(sourceOrType: BlockBuilder|BlockType, contents?: SyntaxTreeNode[])//, generator?: IParentChunkGenerator)
    {
      super();
      
      var type: BlockType;
      var source: BlockBuilder;
      
      if (sourceOrType instanceof BlockBuilder)
      {
        source = <BlockBuilder>sourceOrType;
        type = source.type;
        contents = source.children;
        //generator = source.chunkGenerator;
      }
      else
      {
        type = <BlockType>sourceOrType;
      }
      
      this._type = type;
      this._children = contents;
      //this._chunkGenetator = generator;
      
      for (var i = 0; i < this._children.length; i++)
      {
        this._children[i].parent = this;
      }
    }
    
    /**
     * Gets the children of the curret block
     * @property
     * @readonly
     * @returns {SyntaxTreeNode[]}
     */
    public get children(): SyntaxTreeNode[]
    {
      return this._children;
    }
    
    /**
     * Gets the parent chunk generator
     * @property
     * @readonly
     * @returns {IParentChunkGenerator}
     */
    /*public get chunkGenerator(): IParentChunkGenerator
    {
      return this._chunkGenetator;
    }*/
    
    /**
     * Gets whether the node is a block.
     * @property
     * @readonly
     * @returns {boolean}
     */
    public get isBlock(): boolean
    {
      return true;
    }
    
    /**
     * Gets the length of the block.
     * @property
     * @readonly
     * @returns {number}
     */
    public get length(): number
    {
      var len = 0;
      for (var i = 0; i < this._children.length; i++)
      {
        len += this._children[i].length;
      }
      return len;
    }
    
    /**
     * Gets the start location for the block.
     * @property
     * @readonly
     * @returns {SourceLocation}
     */
    public get start(): SourceLocation
    {
      if (this._children.length > 0)
      {
        return this._children[0].start;
      }
      return SourceLocation.Zero;
    }
    
    /**
     * Gets the block type
     * @property
     * @readonly
     * @returns {BlockType}
     */
    public get type(): BlockType
    {
      return this._type;
    }
    
    /**
     * Passes the node to the visitor
     * @function
     * @param {ParserVisitor} visitor - The parser visitor
     */
    public accept(visitor: ParserVisitor): void
    {
      visitor.visitBlock(this);
    }
    
    /**
     * Determines if the given node is equivalent to the current node.
     * @function
     * @param {Span} node - The syntax tree node to test
     * @returns {boolean}
     */
    public equals(other: Block): boolean
    {
      if (!other)
      {
        return false;
      }
      
      if (!(other instanceof Block))
      {
        return false;
      }
      
      var result = this.type === other.type;// &&
                   //this.chunkGenerator.equals(other.chunkGenerator);
                   
      if (result)
      {
        if (this.children.length !== other.children.length)
        {
          return false;
        }
        else
        {
          for (var i = 0; i < this.children.length; i++)
          {
            if (!this.children[i].equals(other.children[i]))
            {
              return false;
            }
          }
          return true;
        }
      }
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
      var other: Block;
      if (node instanceof Block)
      {
        other = <Block>node;
        
        var result = this.type === other.type;
                    
        if (result)
        {
          if (this.children.length !== other.children.length)
          {
            return false;
          }
          else
          {
            for (var i = 0; i < this.children.length; i++)
            {
              if (!this.children[i].equivalentTo(other.children[i]))
              {
                return false;
              }
            }
            return true;
          }
        }
        return false;
      }
      return false;
    }
    
    /**
     * Finds the first descendent span in the block
     * @function
     * @returns {Span}
     */
    public findFirstDescendentSpan(): Span
    {
      var current: SyntaxTreeNode = this;
      while (current !== null && current.isBlock)
      {
        var block: Block = <Block>current;
        if (block.children.length > 0)
        {
          current = block.children[block.children.length - 1];
        }
        else
        {
          current = null;
        }
      }
      if (current !== null && !current.isBlock)
      {
        return <Span>current;
      }
      return null;
    }
    
    /**
     * Flattens the tree
     * @function
     * @returns {Span[]}
     */
    public flatten(): Span[]
    {
      var result: Span[];
      for (var i = 0; i < this.children.length; i++)
      {
        var node = this.children[i];
        if (node.isBlock)
        {
          result = result.concat((<Block>node).flatten());
        }
        else
        {
          result.push(<Span>node);
        }
      }
      return result;
    }
    
    /**
     * Locates the span that owns the text change
     * @function
     * @param {TextChange} span - The text change
     * @returns {Span}
     */
    public locateOwner(change: TextChange): Span
    {
      var owner: Span = null;
      for (var i = 0; i < this.children.length; i++)
      {
        var node = this.children[i], span: Span = null;
        if (node.isBlock)
        {
          owner = (<Block>node).locateOwner(change);
        }
        else
        {
          span = <Span>node;
          if (change.oldPosition < span.start.absoluteIndex)
          {
            break;
          }
          owner = span;
        }
        
        if (owner !== null)
        {
          break;
        }
      }
      return owner;
    }
    
    /**
     * Returns the string representation of the block
     * @function
     * @returns {string}
     */
    public toString(): string
    {
      var builder = new StringBuilder();
      builder.append(BlockType[<number>this._type]);
      builder.append(" Block at ");
      builder.append(this.start.toString());
      builder.append("::");
      builder.append(this.length.toString());
      //builder.append(" (Gen:");
      //builder.append(this.chunkGenerator.toString());
      //builder.append(")");      
      return builder.toString();
    }
  }
}