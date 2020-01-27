// Icon source : http://free-icon-rainbow.com/birthday-cake-free-icon-2/
import {
  detectFacebookLanguage,
  findLanguageSetByLanguage,
  getLanguagesList,
  parseCalendarAndSave,
  scrollDown,
} from './libs/lib';

if (!findLanguageSetByLanguage(detectFacebookLanguage())) {
  chrome.runtime.sendMessage({
    action: 'CONTENT_STATUS_REPORT',
    data: {
      description: chrome.i18n.getMessage('NOT_SUPPORTED_LANGUAGE',
        '<ul><li>' + getLanguagesList().join('<li>') + '</ul>',
      ),
      link: chrome.i18n.getMessage('NOT_SUPPORTED_LANGUAGE_LINK'),
      title: chrome.i18n.getMessage('NOT_SUPPORTED_LANGUAGE_TITLE'),
    },
  });
} else {
  chrome.runtime.sendMessage({
    action: 'CONTENT_STATUS_REPORT',
    data: {
      description: chrome.i18n.getMessage('WORKING'),
      link: chrome.i18n.getMessage('WORKING_LINK'),
      title: chrome.i18n.getMessage('WORKING_TITLE'),
    },
  });
  scrollDown(parseCalendarAndSave);
}
