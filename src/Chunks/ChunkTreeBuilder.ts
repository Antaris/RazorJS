/// <reference path="../SourceLocation.ts" />
/// <reference path="../Parser/SyntaxTree/SyntaxTreeNode.ts" />
/// <reference path="Chunk.ts" />
/// <reference path="ParentChunk.ts" />
/// <reference path="ChunkTree.ts" />

namespace Razor.Chunks
{
  import SyntaxTreeNode = Razor.Parser.SyntaxTree.SyntaxTreeNode;
  
  /**
   * A builder for chunk trees
   * @class
   */
  export class ChunkTreeBuilder
  {
    private _parentStack: ParentChunk[];
    private _chunkTree: ChunkTree;
    private _lastChunk: Chunk;
    
    /**
     * Initialises a new instance of a chunk tree builder
     * @constructor
     */
    constructor()
    {
      this._parentStack = [];
      this._chunkTree = new ChunkTree();
    }
    
    /**
     * Gets the chunk tree
     * @property
     * @readonly
     * @returns {ChunkTree}
     */
    public get chunkTree(): ChunkTree
    {
      return this._chunkTree;
    }
    
    /**
     * Adds a chunk
     * @function
     * @param {Chunk} chunk - The chunk to add
     * @param {SyntaxTreeNode} association - The associated syntax tree node
     * @param {boolean} [topLevel] - Is the chunk a top level chunk?
     */
    public addChunk(chunk: Chunk, association: SyntaxTreeNode, topLevel?: boolean): void
    {
      topLevel = topLevel || false;
      this._lastChunk = chunk;
      
      chunk.association = association;
      chunk.start = association.start;
      
      if (this._parentStack.length === 0 || topLevel)
      {
        this.chunkTree.chunks.push(chunk);
      }
      else
      {
        this._parentStack[this._parentStack.length - 1].children.push(chunk);
      }
    }
    
    /**
     * Starts a new parent chunk scope
     * @function
     * @param {T} parentChunk - The parent chunk
     * @param {SyntaxTreeNode} - The associated syntax tree node
     * @param {boolean} [topLevel] - Whether the chunk is a top level chunk
     * @returns {T}
     */
    public startParentChunk<T extends ParentChunk>(parentChunk: T, association: SyntaxTreeNode, topLevel?: boolean): T
    {
      this.addChunk(parentChunk, association, topLevel);
      this._parentStack.push(parentChunk);
      return parentChunk;
    }
    
    /**
     * Ends the last parent chunk
     * @function
     */
    public endParentChunk(): void
    {
      this._lastChunk = this._parentStack.pop();
    }
  }
}