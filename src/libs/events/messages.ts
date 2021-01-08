import {
  bindCallback,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Message,
} from './actions';
import { ActionTypes } from './types';

export const allChromeMessages$: Observable<Message<ActionTypes>> =
  bindCallback<ActionTypes, chrome.runtime.MessageSender, () => void>(chrome.runtime.onMessage.addListener)
    .call(chrome.runtime.onMessage)
    .pipe(map(([action, sender, callback]) => ({action, sender, callback})));
