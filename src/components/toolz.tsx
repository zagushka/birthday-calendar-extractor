import {
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
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
    return <ListGroup>
      <ListGroupItem onClick={this.clearChromeStorage}>Clear Chrome Local Storage</ListGroupItem>
      <ListGroupItem onClick={this.clearBadge}>Clear Badge</ListGroupItem>
    </ListGroup>;
  }
}
