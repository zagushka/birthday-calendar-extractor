import { Subject } from 'rxjs';
import { Message } from './actions';
import { ActionTypes } from './types';

export const allChromeMessages$: Subject<Message<ActionTypes>> = new Subject();

const onMessageListener = (
  action: ActionTypes,
  sender: chrome.runtime.MessageSender,
  callback: (...params: Array<any>) => void,
) => {
  allChromeMessages$.next({action, sender, callback});
  if ('undefined' !== typeof callback) {
    return true;
  }
};

// @TODO Add on destroy ?
chrome.runtime.onMessage.addListener(onMessageListener);
