import { Subject } from 'rxjs';
import { Message } from '@/libs/events/actions';
import { ActionTypes } from '@/libs/events/types';

export const allChromeMessages$: Subject<Message<ActionTypes>> = new Subject();

const onMessageListener = (
  action: ActionTypes,
  sender: chrome.runtime.MessageSender,
  callback: (...params: Array<any>) => void,
) => {
  allChromeMessages$.next({ action, sender, callback });
  if (typeof callback !== 'undefined') {
    return true;
  }
};

// @TODO Add on destroy ?
chrome.runtime.onMessage.addListener(onMessageListener);
