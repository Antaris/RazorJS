/// <reference path="State.ts" />

namespace Razor
{
  /**
   * Represents a state result.
   * @class
   */
  export class StateResult<T>
  {
    /**
     * Initialises a new instance of a state result.
     * @constructor
     * @param {State|T} nextOrOutput - The next state or the output of the last state.
     * @param {State} [next] - The next state
     */
    constructor(nextOrOutput: State<T>|T, next?: State<T>)
    {
      if (typeof nextOrOutput === "function")
      {
        this.next = <State<T>>nextOrOutput;
        this.hasOutput = false;
        this.output = null;
      }
      else
      {
        this.next = next;
        this.hasOutput = true;
        this.output = <T>nextOrOutput;
      }
    }
    
    /**
     * Gets or sets whether the result has output.
     * @property
     * @returns {booelan}
     */
    public hasOutput: boolean;
    
    /**
     * Gets or sets the output of the state.
     * @property
     * @returns {T}
     */
    public output: T;
    
    /**
     * Gets or sets the next state
     * @property
     * @returns {State}
     */
    public next: State<T>;
  }
}