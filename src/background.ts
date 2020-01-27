const handleContentResponse = (firstLevelCallback: (data: any) => void) => (message: any) => {
  if ('CONTENT_STATUS_REPORT' !== message.action) {
    return;
  }
  chrome.runtime.onMessage.removeListener(handleContentResponse(firstLevelCallback));
  firstLevelCallback(message.data);
};

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  if ('CHECK_STATUS' !== message.action) {
    return;
  }

  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
    const url = tabs[0].url;

    if (url !== 'https://www.facebook.com/events/birthdays/') {
      callback({
        description: 'FACEBOOK_REQUIRED',
        link: 'FACEBOOK_REQUIRED_LINK',
        title: 'FACEBOOK_REQUIRED_LINK_TITLE',
      });
      return;
    }

    chrome.runtime.onMessage.addListener(handleContentResponse((data: any) => {
      callback(data);
    }));
    chrome.tabs.executeScript({file: './content/content.js'});
  });
  return true;
});
