import {
  bindCallback,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Action,
  ActionType,
  Message,
} from './actions';

export const allChromeMessages$: Observable<Message<ActionType>> =
  bindCallback<Action, chrome.runtime.MessageSender, () => void>(chrome.runtime.onMessage.addListener)
    .call(chrome.runtime.onMessage)
    .pipe(map(([action, sender, callback]) => ({action, sender, callback})));
