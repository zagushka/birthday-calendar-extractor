import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React from 'react';
import {
  setBadgeColor,
  setBadgeText,
} from '../libs/badge';
import { clearStorage } from '../libs/storage/chrome.storage';
import Layout from './layout/layout';

const DevTools: React.FunctionComponent = () => {
  const clearChromeStorage = () => {
    clearStorage();
  };

  const clearBadge = () => {
    setBadgeText('');
    setBadgeColor();
  };

  return (
    <Layout.Wrapper>
      <Layout.Header>
        <Box>Dev Tools</Box>
      </Layout.Header>
      <Layout.Content>
        <Button onClick={clearChromeStorage}>Clear Chrome Local Storage</Button>
        <Button onClick={clearBadge}>Clear Badge</Button>
      </Layout.Content>
    </Layout.Wrapper>);
};

export default DevTools;
