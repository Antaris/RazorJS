namespace Razor
{
  /**
   * Defines the required contract for implementing a disposable type.
   * @interface
   */
  export interface IDisposable
  {
    /**
     * Disposes of the instance.
     */
    dispose(): void;
  }
}