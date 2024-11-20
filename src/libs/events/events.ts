import {
  Observable,
  Subject,
} from 'rxjs';
import { filter } from 'rxjs/operators';

import { Message } from '@/libs/events/actions';
import { allChromeMessages$ } from './messages';
import { ActionTypes } from '@/libs/events/types';

/**
 * All actions Observable
 * Messages from listeners and internal sources should be forwarded here.
 */
export const allActions$: Subject<Message<ActionTypes>> = new Subject();
// Forward chrome.runtime.onMessage
allChromeMessages$.subscribe((e) => allActions$.next(e));

/**
 * Listen to allMessages$ filtered by actionName
 */
export function listenTo<U extends ActionTypes, T = Message<U>>(...types: ActionTypes['type'][]): Observable<T>;

export function listenTo(...types: ActionTypes['type'][]) {
  return allActions$
    .pipe(
      filter<Message<ActionTypes>>((a) => types.includes(a.action.type)),
    );
}

const sendMessageWrapper = <P, C>(parameters: P, callback: (c: C) => void) => chrome.runtime.sendMessage(parameters, callback);

/**
 * Can be used on both popup and backend
 */
export function sendMessage(action: ActionTypes): void;
export function sendMessage<T>(action: ActionTypes, wait: true): Promise<T>;
export function sendMessage<T>(action: ActionTypes, wait?: boolean): Promise<T> | void {
  // Mirror for the local needs
  allActions$.next({
    action,
    callback: () => null,
  });
  // Send message
  if (wait) {
    return chrome.runtime.sendMessage(action);
  }

  chrome.runtime.sendMessage(action).catch();
}
