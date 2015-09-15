namespace Razor
{
  /**
   * Defines the required contract for implementing an equatable type.
   * @interface
   */
  export interface IEquatable<T>
  {
    /**
     * Determines if the given instance is equal to the current instance.
     * @function
     * @param {T} other - The instance to equate
     * @returns {boolean}
     */
    equals(other: T): boolean;
  }
}