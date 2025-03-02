import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "@/popup/App";

chrome.tabs.query({ active: true, currentWindow: true }, () => {
  ReactDOM.render(
    <BrowserRouter basename="/popup/popup.html">
      <App />
    </BrowserRouter>,
    document.getElementById("app"),
  );
});
