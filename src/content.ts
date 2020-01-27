// Icon source : http://free-icon-rainbow.com/birthday-cake-free-icon-2/
import {
  detectFacebookLanguage,
  findLanguageSetByLanguage,
  parseCalendarAndSave,
  scrollDown,
} from './libs/lib';

if (!findLanguageSetByLanguage(detectFacebookLanguage())) {
  chrome.runtime.sendMessage({
    action: 'CONTENT_STATUS_REPORT',
    data: {
      description: 'NOT_SUPPORTED_LANGUAGE',
      link: 'NOT_SUPPORTED_LANGUAGE_LINK',
      title: 'NOT_SUPPORTED_LANGUAGE_TITLE',
    },
  });
} else {
  console.log('it is fine');
  chrome.runtime.sendMessage({
    action: 'CONTENT_STATUS_REPORT',
    data: {
      description: 'WORKING',
      link: 'WORKING_LINK',
      title: 'WORKING_TITLE',
    },
  });
  scrollDown(parseCalendarAndSave);
}
