import {
  useEffect,
  useState,
} from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { translateString } from '../../filters/translateString';
import { listenTo } from '../events/events';
import { SEND_SCAN_LOG } from '../events/types';

/**
 * Listen to SCAN_LOG messages and return translated string
 */
export function useScanLogListener(): string {
  const [log, setLog] = useState<string>();

  useEffect(() => {
    const onDestroy$ = new Subject<boolean>();
    // Start listening to scan logs
    listenTo(SEND_SCAN_LOG)
      .pipe(takeUntil(onDestroy$))
      .subscribe(({action}) => {
        if (SEND_SCAN_LOG === action.type) {
          setLog(translateString(action.payload.messageName, action.payload.substitutions));
        }
      });

    // Stop listening to scan logs
    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, []);
  return log;
}
