namespace Razor
{
  /**
   * Represents an ordered set of the given types
   * @class
   */
  export class Tuple<TFirst, TSecond>
  {
    /**
     * Initialises a new instance of a tuple
     * @constructor
     * @param {TFirst} item1 - The first item
     * @param {TSecond} item2 - The second item
     */
    constructor(public item1: TFirst, item2: TSecond)
    {
      
    }
  }
}