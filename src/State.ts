/// <reference path="StateResult.ts" />

namespace Razor
{
  /**
   * Represents a delegate function that returns a state result.
   */
  export interface State<T>
  {
    (): StateResult<T>;
  }
}