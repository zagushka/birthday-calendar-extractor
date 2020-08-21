import {
  ACTION,
  StatusReportAction,
} from './constants';
import { sendMessage } from './libs/lib';

export interface UserConfig {
  targetFormat: 'ics' | 'csv' | 'delete-ics';
}

const userConfig: UserConfig = {targetFormat: 'ics'};

const handleContentResponse = (firstLevelCallback: (data: any) => void) => (message: any) => {
  if (ACTION.STATUS_REPORT !== message.type) {
    return;
  }
  chrome.runtime.onMessage.removeListener(handleContentResponse(firstLevelCallback));
  firstLevelCallback(message.status);
};

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  // if (ACTION.LOG === message.type) {
  //   console.log(message.data);
  //   return;
  // }

  if (ACTION.USER_CONFIG_SET === message.type) {
    userConfig.targetFormat = message.targetFormat;
    return true;
  }
  if (ACTION.USER_CONFIG === message.type) {
    callback(userConfig);
    return true;
  }

  if (ACTION.START_GENERATION === message.type) {
    // Correct URL, wait for content response
    chrome.runtime.onMessage.addListener(
      handleContentResponse((data: any) => callback(data)),
    );
    // Execute content script and CSS`
    // chrome.tabs.insertCSS({file: './content.css'}, () => {
    chrome.tabs.executeScript({file: './content.js'});
    // });
    return true;
  }
  if (ACTION.CHECK_STATUS === message.type) {
    // Check current page url
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
      // console.log('Action is here', tabs[0].url);
      const url = tabs[0].url;

      // Wrong URL
      if (!url.startsWith(chrome.i18n.getMessage('FACEBOOK_REQUIRED_LINK'))) {
        sendMessage(new StatusReportAction('FACEBOOK_REQUIRED'));
        return true;
      }

      sendMessage(new StatusReportAction('USER_SETTINGS'));
    });
    return true;
  }
});
