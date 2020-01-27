document.getElementById('link').addEventListener('click', () => {
  const url = document.getElementById('link').getAttribute('href');
  if (url) {
    chrome.tabs.update({url});
  }
  window.close();
  return false;
});

chrome.runtime.sendMessage({action: 'CHECK_STATUS'}, (message) => {
  document.getElementById('description').innerHTML = chrome.i18n.getMessage(message.description);
  document.getElementById('link').setAttribute('href', chrome.i18n.getMessage(message.link));
  document.getElementById('title').innerHTML = chrome.i18n.getMessage(message.title);
});
