/// <reference path="../../Internals/IEquatable.ts" />
/// <reference path="../../SourceLocation.ts" />
/// <reference path="../../Text/SourceLocationTracker.ts" />
/// <reference path="SyntaxTreeNode.ts" />
/// <reference path="SpanKind.ts" />
/// <reference path="SpanBuilder.ts" />
/// <reference path="../../Tokenizer/Symbols/ISymbol.ts" />
/// <reference path="../../Chunks/Generators/ISpanChunkGenerator.ts" />
/// <reference path="../../Chunks/Generators/SpanChunkGenerator.ts" />
/// <reference path="../../Text/StringBuilder.ts" />

namespace Razor.Parser.SyntaxTree
{
  import ISymbol = Razor.Tokenizer.Symbols.ISymbol;
  import ISpanChunkGenerator = Razor.Chunks.Generators.ISpanChunkGenerator;
  import SpanChunkGenerator = Razor.Chunks.Genetators.SpanChunkGenetaror;
  import StringBuilder = Razor.Text.StringBuilder;
  import SourceLocationTracker = Razor.Text.SourceLocationTracker;
  
  /**
   * Represents a span of content in a syntax tree
   * @class
   */
  export class Span extends SyntaxTreeNode implements IEquatable<Span>
  {
    private _start: SourceLocation;
    private _kind: SpanKind;
    private _symbols: ISymbol[];
    private _previous: Span;
    private _next: Span;
    private _content: string;
    private _chunkGenerator: ISpanChunkGenerator;
    private _groupedSymbols: string;
    
    /**
     * Initialises a new instance of a span
     * @constructor
     * @param {SpanBuilder} builder - The span builder.
     */
    constructor(builder: SpanBuilder)
    {
      super();
      
      this.replaceWith(builder);
    }
    
    /**
     * Gets the chunk generator for this span
     * @property
     * @readonly
     * @returns {ISpanChunkGenerator}
     */
    public get chunkGenerator(): ISpanChunkGenerator
    {
      return this._chunkGenerator;
    }
    
    /**
     * Gets the content of the span
     * @property
     * @readonly
     * @returns {string}
     */
    public get content(): string
    {
      return this._content;
    }
    
    /**
     * Gets whether the node is a block.
     * @property
     * @readonly
     * @returns {boolean}
     */
    public get isBlock(): boolean
    {
      return false;
    }
    
    /**
     * Gets the span kind
     * @property
     * @readonly
     * @returns {SpanKind}
     */
    public get kind(): SpanKind
    {
      return this._kind;
    }
    
    /**
     * Gets the length of the span.
     * @property
     * @readonly
     * @returns {number}
     */
    public get length(): number
    {
      return this._content.length;
    }
    
    /**
     * Gets the next span
     * @property
     * @readonly
     * @returns {Span}
     */
    public get next(): Span
    {
      return this._next || null;
    }
    
    /**
     * @param {Span} value - The value of the span
     */
    public set next(value: Span)
    {
      this._next = value || null;
    }
    
    /**
     * Gets the previous span
     * @property
     * @readonly
     * @returns {Span}
     */
    public get previous(): Span
    {
      return this._previous || null;
    }
    
    /**
     * @param {Span} value - The value of the span
     */
    public set previous(value: Span)
    {
      this._previous = value || null;
    }
    
    /**
     * Gets the start location for the span.
     * @property
     * @readonly
     * @returns {SourceLocation}
     */
    public get start(): SourceLocation
    {
      return this._start;
    }
    
    /**
     * Gets the symbols that make up this span
     * @property
     * @readonly {ISymbol[]}
     */
    public get symbols(): ISymbol[]
    {
      return this._symbols;
    }
    
    /**
     * Passes the node to the visitor
     * @function
     * @param {ParserVisitor} visitor - The parser visitor
     */
    public accept(visitor: ParserVisitor): void
    {
      visitor.visitSpan(this);
    }
    
    /**
     * Modifies the span using the given delegate
     * @function
     * @param {Function} changes - The changes delegate
     */
    public change(changes: (builder: SpanBuilder) => void): void
    {
      var builder = new SpanBuilder(this);
      changes(builder);
      this.replaceWith(builder);
    }
    
    /**
     * Changes the start position of the span. This updates the start location of all forwward-connected spans.
     * @function
     * @param {SourceLocation} newStart - the new start location
     */
    public changeStart(newStart: SourceLocation): void
    {
      this._start = newStart;
      var current = this;
      var tracker = new SourceLocationTracker(newStart);
      tracker.updateLocation(this.content);
      while ((current = current.next) !== null)
      {
        current._start = tracker.currentLocation;
        tracker.updateLocation(current.content);
      }
    }
    
    /**
     * Determines if the given node is equivalent to the current node.
     * @function
     * @param {Span} node - The syntax tree node to test
     * @returns {boolean}
     */
    public equals(other: Span): boolean
    {
      if (!other)
      {
        return false;
      }
     
      var result = this.kind === other.kind &&
                   this.chunkGenerator.equals(other.chunkGenerator) &&
                   this.content === other.content;
                   
      if (result)
      {
        if (this.symbols.length !== other.symbols.length)
        {
          return false;
        }
        else
        {
           for (var i = 0; i < this.symbols.length; i++)
           {
             if (!this.symbols[i].equals(other.symbols[i]))
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
      var other: Span;
      if (node instanceof Span)
      {
        other = <Span>node;
        return this.kind === other.kind &&
               this.start.equals(other.start) &&
               this.content === other.content;
      }
      return false;
    }
    
    /**
     * Gets the content from the given set of symbols
     * @function
     * @static
     * @param {ISymbol[]} symbols - The set of symbols
     * @returns {string}
     */
    public static getContent(symbols: ISymbol[]): string
    {
      var builder = new StringBuilder();
      for (var i = 0; i < symbols.length; i++)
      {
        builder.append(symbols[i].content);
      }
      return builder.toString();
    }
    
    /**
     * Gets the debug string for the grouped set of symbols.
     * @function
     * @static
     * @param {ISymbol[]} symbols - The set of symbols
     * @returns {string}
     */
    public static getGroupedSymbols(symbols: ISymbol[]): string
    {
      var group: { [id: string]: number } = {};
      for (var i = 0; i < symbols.length; i++)
      {
        var name = symbols[i].runtimeTypeName;
        if (group.hasOwnProperty(name))
        {
          group[name] = group[name] + 1;
        }
        else
        {
          group[name] = 1;
        }
      }
      var builder = new StringBuilder();
      for (var groupName in group)
      {
        if (group.hasOwnProperty(groupName))
        {
          builder.append(groupName + ":" + group[groupName].toString() + ";");
        }
      }
      return builder.toString();
    }
    
    /**
     * Replaces the internal state of the span using the given builder
     * @function
     * @param {SpanBuilder} builder - The span builder
     */
    public replaceWith(builder: SpanBuilder): void
    {
      this._kind = builder.kind;
      this._symbols = builder.symbols;
      this._chunkGenerator = builder.chunkGenerator || SpanChunkGenerator.Null;
      this._start = builder.start;
      
      builder.reset();
      
      this._content = Span.getContent(this._symbols);
      this._groupedSymbols = Span.getGroupedSymbols(this._symbols);
    }
    
    /**
     * Sets the start location of the span
     * @function
     * @param {SourceLocation} newStart - The new start location
     */
    public setStart(newStart: SourceLocation): void
    {
      this._start = newStart;
    }
    
    /**
     * Returns the string representation of the span
     * @function
     * @returns {string}
     */
    public toString(): string
    {
      var builder = new StringBuilder();
      builder.append(SpanKind[<number>this.kind]);
      builder.append("Span at " + this.start.toString() + "::" + this.length.toString() + " - [" + this.content + "]");
      builder.append(" Gen: <");
      builder.append(this.chunkGenerator.toString());
      builder.append("> {");
      builder.append(this._groupedSymbols);
      builder.append("}");      
      return builder.toString();
    }
  }
}