namespace Razor
{
  /**
   * Defines the required contract for implementing a comparable type.
   * @interface
   */
  export interface IComparable<T>
  {
    /**
     * Compares the given instance against the current instance to determine order.
     * @function
     * @param {T} other - The other instance to compare to
     * @returns {number}
     */
    compareTo(other: T): number;
  }
}