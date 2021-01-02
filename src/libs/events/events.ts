import {
  bindCallback,
  merge,
  Observable,
  Subject,
} from 'rxjs';
import {
  filter,
  tap,
} from 'rxjs/operators';

import { ACTION } from '../../constants';
import { Settings } from '../storage/chrome.storage';
import {
  Action,
  ActionType,
  Message,
} from './actions';
import { alChromeAlarms$ } from './alarms';
import { allChromeMessages$ } from './messages';

/**
 * All actions Observable
 * Messages from listeners and internal sources should be forwarded here.
 */

export const allActions$: Subject<Message<ActionType>> = new Subject();
// Forward chrome.runtime.onMessage and chrome.alarms.onAlarm events to allMessages$
// Merged with alarms listener
merge(
  allChromeMessages$, // Messages
  alChromeAlarms$, // Alarms
)
  .subscribe(e => allActions$.next(e));

/**
 * Listen to allMessages$ filtered by actionName
 */
export function listenTo<A extends Action>(...args: Array<ACTION>): Observable<Message<A>> {
  const names = [...arguments] as Array<ACTION>;

  return allActions$
    .pipe(
      // @ts-ignore
      filter(a => names.includes(a.action.type)),
    ) as Observable<Message<A>>;
}

const sendMessageWrapper = <P, C>(parameters: P, callback: (c: C) => void) => chrome.runtime.sendMessage(parameters, callback);

/**
 * Can be used on both popup and backend
 */
export function sendMessage<T>(action: Action): Observable<T>;
export function sendMessage(action: Action, dontWait: boolean): void;
export function sendMessage<T>(action: Action, dontWait?: boolean) {
  // Mirror for the local needs
  allActions$.next({
    action,
    callback: () => null,
  });
  // Send message
  if ('undefined' === typeof dontWait || false === dontWait) {
    return bindCallback<Action, T>(sendMessageWrapper)(action);

    // return new Observable(subscriber => {
    //   console.log('[SEND MESSAGE OBSERVABLE]', action.type);
    //   chrome.runtime.sendMessage(action, (p) => {
    //     console.log('[SEND MESSAGE NEXT]', action.type, p);
    //     subscriber.next(p);
    //     subscriber.complete();
    //   });
    // });
  }
  return chrome.runtime.sendMessage(action);

}
