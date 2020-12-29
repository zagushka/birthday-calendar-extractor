import { Button } from '@material-ui/core';
import React from 'react';
import {
  setBadgeColor,
  setBadgeText,
} from '../libs/badge';
import { clearStorage } from '../libs/storage/chrome.storage';

export default class Toolz extends React.Component<any, any> {
  clearChromeStorage() {
    clearStorage();
  }

  clearBadge() {
    setBadgeText('');
    setBadgeColor();
  }

  render() {
    return <>
      <Button onClick={this.clearChromeStorage}>Clear Chrome Local Storage</Button>
      <Button onClick={this.clearBadge}>Clear Badge</Button>
    </>;
  }
}
