/// <reference path="State.ts" />
/// <reference path="StateResult.ts" />

namespace Razor
{
  /**
   * Represents a state machine.
   * @class
   */
  export class StateMachine<T>
  {
    /**
     * Gets the start state
     * @property
     * @readonly
     * @returns {State<T>}
     */
    protected startState: State<T>;
    
    /**
     * Gets or sets the current state
     * @property
     * @returns {State<T>}
     * 
     */
    protected currentState: State<T>;
    
    /**
     * Remain at this state on next turn.
     * @function
     * @param {T} [output] - The output from the the current state
     */
    protected stay(output?: T): StateResult<T>
    {
      return (arguments.length) 
        ? new StateResult<T>(output, this.currentState) 
        : new StateResult<T>(this.currentState);
    }
    
    /**
     * Stops the state machine
     * @function
     * @returns {StateResult<T>}
     */
    protected stop(): StateResult<T>
    {
      return null;
    }
    
    /**
     * Transitions the state machine to a new state.
     * @function
     * @param {T|State<T>} outputOrNewState - The output from the last state or the new state
     * @param {State<T>} [newState] - The new state if providing an output.
     */
    protected transition(outputOrNewState: T|State<T>, newState?: State<T>): StateResult<T>
    {
      return new StateResult<T>(outputOrNewState, newState);
    }
    
    /**
     * Processes the next state and returns the result.
     * @function
     * @returns {T}
     */
    protected turn(): T
    {
      if (!!this.currentState)
      {
        var result: StateResult<T>;
        do
        {
          result = this.currentState();
          this.currentState = result.next;
        }
        while (!!result && !result.hasOutput);
        
        if (!result)
        {
          return null;
        }
        return result.output;
      }
      return null;
    }
  }
}