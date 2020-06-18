// Icon source : http://free-icon-rainbow.com/birthday-cake-free-icon-2/
import Vue from 'vue';

import App from './App.vue';
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
  console.log('HERE I GO');
  chrome.runtime.sendMessage({
    action: 'CONTENT_STATUS_REPORT',
    data: {
      description: chrome.i18n.getMessage('WORKING'),
      link: chrome.i18n.getMessage('WORKING_LINK'),
      title: chrome.i18n.getMessage('WORKING_TITLE'),
    },
  });
  // scrollDown(parseCalendarAndSave);
  scrollDown(() => {
    console.log('HEYEYE');
    const div = document.createElement('div');
    div.id = 'popsa';
    document.body.append(div);
    //
    // const data = {calendar: parseCalendarAndSave()};
    // console.log(data);

    new Vue({
      el: '#popsa',
      // data: data,
      render: h => h(App),
    });
  });
}



