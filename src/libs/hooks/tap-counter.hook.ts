import { useEffect, useState } from "react";

/**
 * Little helper to emulate click chains (double, triple, etc) with custom delay between them.
 * `executeFunction` will be executed the moment amount of taps reach `maxTaps`
 *
 * @param maxTaps number of taps before `executeFunction`
 * @param delay maximum delay between taps
 * @param executeFunction function to execute when maxTaps reached
 */
export const useTapsCounter = (maxTaps: number, delay: number, executeFunction: () => void) => {
  const [counter, setCounter] = useState(0);
  const [lastTap, setLastTap] = useState(0);

  useEffect(() => {
    // reset counter and start over
    setCounter(0);
    setLastTap(0);
  }, [maxTaps, delay]);

  useEffect(() => {
    if (counter >= maxTaps) {
      executeFunction();
      // and reset counter
      setCounter(0);
    }
  }, [counter, maxTaps, executeFunction]);

  /**
   * Update the counter or reset it in case delay is greater than period between events
   */
  const eventHandler = () => {
    const now = Date.now();
    setCounter((prevCounter) => +(now - lastTap <= delay) + prevCounter);
    setLastTap(now);
  };

  return eventHandler;
};
