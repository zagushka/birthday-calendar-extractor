import { useEffect, useState } from "react";

/**
 * Listen to `trigger` variable changes
 * Return true after trigger was true
 * For example
 * false | true | false | false -> false | true | true | true
 *
 * @param trigger value to listen to
 */
export function useWasOn(trigger: boolean): [boolean, () => void] {
  const [value, setValue] = useState(false);
  useEffect(() => !value && trigger && setValue(true), [trigger]);

  function reset() {
    setValue(trigger);
  }

  return [value, reset];
}

/**
 * Listen to `trigger` variable changes
 * Return true after trigger was false
 * For example
 * false | true | false | false -> true | true | true | true
 * true | false | true | false -> false | true | true | true
 *
 * @param trigger value to listen to
 */
export function useWasOff(trigger: boolean): [boolean, () => void] {
  const [value, setValue] = useState(false);
  useEffect(() => !value && !trigger && setValue(true));

  function reset() {
    setValue(trigger);
  }

  return [value, reset];
}

/**
 * Start emitting true when trigger was changed from false to true and back
 *
 * false | true | false | false -> false | false | true | true
 *
 * @param trigger value to listen to
 */
export function useWasOnOff(trigger: boolean): [boolean, () => void] {
  const [value, setValue] = useState(false);
  const [wasOn, resetWasOn] = useWasOn(trigger);

  useEffect(() => {
    wasOn && !trigger && setValue(true);
  }, [wasOn, trigger]);

  function reset() {
    setValue(trigger);
    resetWasOn();
  }

  return [value, reset];
}

export type ChainStatusType = "on" | "off" | "pending";
const chainStatuses: Record<ChainStatusType, ChainStatusType> = {
  pending: "on",
  on: "off",
  off: "pending",
};

/**
 * The idea behind the chainStatus is the state that can be changed only in cycle
 * 'on' -> 'off' -> 'pending' -> 'on' -> 'off'
 *
 */
export function useChainStatus(): [ChainStatusType, (status: ChainStatusType) => boolean, () => void] {
  const [switchStatus, setSwitchStatus] = useState<ChainStatusType>("pending");

  function reset() {
    setSwitchStatus("pending");
  }

  function update(status: ChainStatusType) {
    if (chainStatuses[switchStatus] === status) {
      setSwitchStatus(status);
      return true;
    }
    return false;
  }

  return [switchStatus, update, reset];
}
