import {
  useEffect,
  useState,
} from 'react';
import { Subject } from 'rxjs';
import {
  scan,
  takeUntil,
} from 'rxjs/operators';
import { translateString } from '@/filters/translateString';
import { Message } from '@/libs/events/actions';
import { listenTo } from '@/libs/events/events';
import {
  SEND_SCAN_LOG,
  SendScanLogAction,
} from '@/libs/events/types';

/**
 * Listen to SCAN_LOG messages and return translated string
 */
export function useScanLogListener(limit: number = 256): [Array<string>, () => void] {
  const [log, setLog] = useState<Array<string>>([]);

  useEffect(() => {
    const onDestroy$ = new Subject<boolean>();
    // Start listening to scan logs
    listenTo<SendScanLogAction>(SEND_SCAN_LOG)
      .pipe(
        scan<Message<SendScanLogAction>, Array<string>>((accumulator, { action }) => accumulator
          .concat(translateString(action.payload.messageName, action.payload.substitutions))
          .slice(-limit), []),
        takeUntil(onDestroy$),
      )
      .subscribe((logs) => {
        setLog(logs);
      });

    // Stop listening to scan logs
    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, [limit]);

  function reset() {
    setLog([]);
  }

  return [log, reset];
}
