import {
  merge,
  Observable,
  Subject,
} from 'rxjs';
import { filter } from 'rxjs/operators';

import { ACTION } from '../../constants';
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
      filter(a => names.includes(a.action.type)),
    ) as Observable<Message<A>>;
}

/**
 * Can be used on both popup and backend
 */
export function sendMessage(action: Action, callback?: (response?: any) => void): void {
  // Mirror for the local needs
  allActions$.next({action, callback});
  // Send message
  chrome.runtime.sendMessage(action, callback);
}
