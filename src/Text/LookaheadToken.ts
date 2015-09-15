/// <reference path="../Internals/DisposableAction.ts" />

namespace Razor.Text
{
  /**
   * Represents a disposable token for lookahead operations.
   */
  export class LookaheadToken extends DisposableAction
  {
    private _accepted: boolean;
    
    /**
     * Initialises a new instance of a lookahead token.
     * @constructor
     * @param {Function} action - The dispose action.
     * @param {any} [context] - The dispose action context.
     */
    constructor(action: Function, context?: any)
    {
      super(action, context);
      
      this._accepted = false;
    }
    
    /**
     * Disposes of the instance.
     */
    public dispose(): void
    {
      if (!this._accepted)
      {
        super.dispose();
      }
    }
  }
}