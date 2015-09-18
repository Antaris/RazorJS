/// <reference path="SyntaxTreeNode.ts" />
/// <reference path="BlockType.ts" />
/// <reference path="Block.ts" />
/// <reference path="../../Chunks/Generators/IParentChunkGenerator.ts" />
/// <reference path="../../Chunks/Generators/ParentChunkGenerator.ts" />

namespace Razor.Parser.SyntaxTree
{
  import IParentChunkGenerator = Razor.Chunks.Generators.IParentChunkGenerator;
  import ParentChunkGenerator = Razor.Chunks.Generators.ParentChunkGenerator;
  
  /**
   * A builder for creating instances of blocks
   * @class
   */
  export class BlockBuilder
  {
    private _children: SyntaxTreeNode[];
    
    /**
     * Initialises a new instance of a block builder
     * @constructor
     * @param {Block} [original] - The original block
     */
    constructor(original?: Block)
    {
      if (!original)
      {
        this.reset();
      }
      else
      {
        this.type = original.type;
        this.children = original.children.slice(0);
        this.chunkGenerator = original.chunkGenerator;
      }
    }
    
    /**
     * Gets the set of childre.
     * @property
     * @readonly
     * @returns {SyntaxTreeNode[]}
     */
    public get children(): SyntaxTreeNode[]
    {
      return this._children;
    }
    
    /**
     * Gets or sets the chunk generator
     * @property
     * @type {IParentChunkGenerator}
     */
    public chunkGenerator: IParentChunkGenerator;
      
    /**
     * Gets or sets the block type
     * @property
     * @type {BlockType}
     */
    public type: BlockType;
    
    /**
     * Creates a new block
     * @returns {Block}
     */
    public build(): Block
    {
      return new Block(this);
    }
    
    /**
     * Resets the block builder
     * @function
     */
    public reset(): void
    {
      this.type = null;
      this.children = [];
      this.chunkGenerator = ParentChunkGenerator.Null;
    }
  }
}