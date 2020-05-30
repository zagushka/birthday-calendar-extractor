document.getElementById('link').addEventListener('click', () => {
  const url = document.getElementById('link').getAttribute('href');
  if (url) {
    chrome.tabs.create({url});
  }
  window.close();
  return false;
});

chrome.runtime.sendMessage({action: 'CHECK_STATUS'}, (message) => {
  document.getElementById('description').innerHTML = message.description;
  document.getElementById('link').setAttribute('href', message.link);
  document.getElementById('title').innerHTML = message.title;
});
