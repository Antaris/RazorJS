/// <reference path="IDisposable.ts" />"

namespace Razor
{
  /**
   * Provides a method for managing the lifetime of disposable types.
   * @function
   * @static
   * @param {any|Disposable} contextOrDisposable - The context for the dispose action, or the disposable type if not providing a context
   * @param {IDisposable|Function} disposableOrAction - The disposable type, or the dispose action if not providing a context
   * @param {Function} [action] The dispose action if providing a context
   */
  export function Using(contextOrDisposable: any|IDisposable, disposableOrAction: IDisposable|Function, action?: (disposable: IDisposable) => void)
  {
    if (arguments.length === 2)
    {
      action = <(disposable: IDisposable|Function) => void>disposableOrAction;
      disposableOrAction = <IDisposable>contextOrDisposable;
      contextOrDisposable = null;
    }
    
    try 
    {
      action.apply(contextOrDisposable, [disposableOrAction]);
    }
    finally
    {
      (<IDisposable>disposableOrAction).dispose();
    }
  }
}