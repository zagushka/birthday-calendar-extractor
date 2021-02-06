import {
  bindCallback,
  Observable,
  Subject,
} from 'rxjs';
import { filter } from 'rxjs/operators';

import { Message } from './actions';
import { allChromeMessages$ } from './messages';
import { ActionTypes } from './types';

/**
 * All actions Observable
 * Messages from listeners and internal sources should be forwarded here.
 */
export const allActions$: Subject<Message<ActionTypes>> = new Subject();
// Forward chrome.runtime.onMessage
allChromeMessages$.subscribe(e => allActions$.next(e));

/**
 * Listen to allMessages$ filtered by actionName
 */
export function listenTo(...types: ActionTypes['type'][]) {
  return allActions$
    .pipe(
      filter<Message<ActionTypes>>(a => types.includes(a.action.type)),
    );
}

const sendMessageWrapper = <P, C>(parameters: P, callback: (c: C) => void) => chrome.runtime.sendMessage(parameters, callback);

/**
 * Can be used on both popup and backend
 */
export function sendMessage<T>(action: ActionTypes): Observable<T>;
export function sendMessage(action: ActionTypes, dontWait: boolean): void;
export function sendMessage<T>(action: ActionTypes, dontWait?: boolean) {
  // Mirror for the local needs
  allActions$.next({
    action,
    callback: () => null,
  });
  // Send message
  if ('undefined' === typeof dontWait || false === dontWait) {
    return bindCallback<ActionTypes, T>(sendMessageWrapper)(action);
  }
  return chrome.runtime.sendMessage(action);

}
