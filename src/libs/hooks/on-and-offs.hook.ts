import {
  useEffect,
  useState,
} from 'react';

/**
 * Listen to `trigger` variable changes
 * Return true after trigger was true
 * For example
 * false | true | false | false -> false | true | true | true
 *
 * @param trigger value to listen to
 */
function useWasOn(trigger: boolean): [boolean, () => void] {
  const [value, setValue] = useState(false);
  useEffect(() => !value && trigger && setValue(true));

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
    console.log('inside', trigger, wasOn, value);
    (wasOn && !trigger && setValue(true));
  }, [wasOn, trigger]);

  function reset() {
    setValue(trigger);
    resetWasOn();
  }

  return [value, reset];
}
