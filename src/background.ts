const handleContentResponse = (firstLevelCallback: (data: any) => void) => (message: any) => {
  if ('CONTENT_STATUS_REPORT' !== message.action) {
    return;
  }
  chrome.runtime.onMessage.removeListener(handleContentResponse(firstLevelCallback));
  firstLevelCallback(message.message);
};

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  if ('CHECK_STATUS' !== message.action) {
    return;
  }

  // Check current page url
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
    // console.log('Action is here', tabs[0].url);
    const url = tabs[0].url;

    // Wrong URL
    if (!url.startsWith(chrome.i18n.getMessage('FACEBOOK_REQUIRED_LINK'))) {
      callback('FACEBOOK_REQUIRED');
      return;
    }

    // Correct URL, wait for content response
    chrome.runtime.onMessage.addListener(
      handleContentResponse((data: any) => callback(data)),
    );
    // Execute content script and CSS`
    chrome.tabs.insertCSS({file: './content.css'}, () => {
      chrome.tabs.executeScript({file: './content.js'});
    });
  });
  return true;
});
