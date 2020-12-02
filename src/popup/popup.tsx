import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

chrome.tabs.query({ active: true, currentWindow: true }, tab => {
  ReactDOM.render(<App />, document.getElementById('app'));
});
