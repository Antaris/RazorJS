/// <reference path="IDisposable.ts" />

namespace Razor
{
  /**
   * Represents a disposable action that executes on dispose.
   * @class
   */
  export class DisposableAction implements IDisposable
  {
    private _action: Function;
    private _context: any;
    
    /**
     * Initialises a new instance of a dispose action.
     * @constructor
     * @param {Function} action - The dispose action.
     * @param {any} [context] - The dispose action context.
     */
    constructor(action: Function, context?: any)
    {
      this._action = action;
      this._context = context || null;
    }
    
    /**
     * Disposes of the instance.
     */
    public dispose(): void
    {
      this._action.apply(this._context, []);
    }
  }
}