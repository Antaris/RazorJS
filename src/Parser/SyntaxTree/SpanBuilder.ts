/// <reference path="../../Internals/IEquatable.ts" />
/// <reference path="../../SourceLocation.ts" />
/// <reference path="../../Text/SourceLocationTracker.ts" />
/// <reference path="SyntaxTreeNode.ts" />
/// <reference path="SpanKind.ts" />
/// <reference path="Span.ts" />
/// <reference path="../../Tokenizer/Symbols/ISymbol.ts" />
/// <reference path="../../Chunks/Generators/ISpanChunkGenerator.ts" />
/// <reference path="../../Chunks/Generators/SpanChunkGenerator.ts" />
/// <reference path="../../Text/StringBuilder.ts" />

namespace Razor.Parser.SyntaxTree
{
  import ISymbol = Razor.Tokenizer.Symbols.ISymbol;
  import ISpanChunkGenerator = Razor.Chunks.Generators.ISpanChunkGenerator;
  import SpanChunkGenerator = Razor.Chunks.Generators.SpanChunkGenerator;
  import StringBuilder = Razor.Text.StringBuilder;
  import SourceLocationTracker = Razor.Text.SourceLocationTracker;
  
  /**
   * A builder for creating Span instances
   * @class
   */
  export class SpanBuilder
  {
    private _symbols: ISymbol[] = [];
    private _tracker: SourceLocationTracker = new SourceLocationTracker();
    
    /**
     * Initialises a new instance of a span builder
     * @constructor
     * @param {Span} [original] - The original span
     */
    constructor(original?: Span)
    {
      if (!!original)
      {
        this.kind = original.kind;
        this._symbols = original.symbols.slice(0);
        this.chunkGenerator = original.chunkGenerator;
        this.start = original.start;
      }
      else
      {
        this.reset();
      }
    }
    
    /**
     * Gets or sets the chunk generator
     * @property
     * @type {ISpanChunkGenerator}
     */
    public chunkGenerator: ISpanChunkGenerator;
    
    /**
     * Gets or sets the span kind
     * @property
     * @type {SpanKind}
     */
    public kind: SpanKind;
    
    /**
     * Gets or sets the start location
     * @property
     * @type {SourceLocation}
     */
    public start: SourceLocation;
    
    /**
     * Gets the set of symbols
     * @property
     * @readonly
     * @returns {ISymbol[]}
     */
    public get symbols(): ISymbol[]
    {
      return this._symbols;
    }
    
    /**
     * Accepts the symbol into the builder
     * @function
     * @param {ISymbol} symbol - The symbol
     */
    public accept(symbol: ISymbol): void
    {
      if (!symbol)
      {
        return;
      }
      
      if (this._symbols.length === 0)
      {
        this.start = symbol.start;
        symbol.changeStart(SourceLocation.Zero);
        this._tracker.currentLocation = SourceLocation.Zero;
      }
      else
      {
        symbol.changeStart(this._tracker.currentLocation);
      }
      
      this._symbols.push(symbol);
      this._tracker.updateLocation(symbol.content);
    }
    
    /**
     * Builds a new span
     * @function
     * @returns {Span}
     */
    public build(): Span
    {
      return new Span(this);
    }
    
    /**
     * Clears the symbols from the builder
     * @function
     */
    public clearSymbols(): void
    {
      this._symbols = [];
    }
    
    /**
     * Resets the builder
     * @function
     */
    public reset(): void
    {
      this._symbols = [];
      this.chunkGenerator = new SpanChunkGenerator();
      this.start = SourceLocation.Zero;
    }
  }
}