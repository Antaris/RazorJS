/// <reference path="RewritingContext.ts" />

namespace Razor.Parser
{
  /**
   * Defines the required contract for implementing a syntax tree rewriter
   * @interface
   */
  export interface ISyntaxTreeRewriter
  {
    /**
     * Rewrites the syntax tree provided by the given context.
     * @function
     * @param {RewritingContext} context - The rewriting context
     */
    rewrite(context: RewritingContext): void;
  }
}