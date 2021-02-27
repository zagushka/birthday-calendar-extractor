import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

chrome.tabs.query({active: true, currentWindow: true}, tab => {
  ReactDOM.render(
    <BrowserRouter basename={'/popup/popup.html'}>
      <App/>
    </BrowserRouter>,
    document.getElementById('app'),
  );
});
