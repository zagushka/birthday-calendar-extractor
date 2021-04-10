import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { DateTime } from 'luxon';
import React from 'react';
import {
  setBadgeColor,
  setBadgeText,
} from '../libs/badge';
import {
  SCAN_ERROR_BIRTHDAYS_EXTRACT,
  SCAN_ERROR_FACEBOOK_REQUIRED,
  SCAN_ERROR_NO_TOKEN_DETECTED,
  ScanErrorTypes,
} from '../libs/events/executed-script.types';
import {
  SHOW_MODAL_EXPORT_SUCCESS,
  SHOW_MODAL_SCANNING,
  ShowModalTypes,
} from '../libs/events/types';
import {
  clearStorage,
  storeUserSettings,
} from '../libs/storage/chrome.storage';
import Layout from './layout/layout';

const DevTools: React.FunctionComponent = () => {
  const clearChromeStorage = () => {
    clearStorage();
  };

  const clearBadge = () => {
    setBadgeText('');
    setBadgeColor();
    storeUserSettings({badgeVisited: DateTime.fromMillis(0)});
  };

  const openModal = (type: ScanErrorTypes | ShowModalTypes) => () => {
    storeUserSettings({modal: {type}});
  };

  return (
    <Layout.Wrapper>

      <Layout.Header>
        <Box>Dev Tools</Box>
      </Layout.Header>

      <Layout.Content>
        <Button variant='outlined' color='secondary' onClick={clearChromeStorage}>Clear Chrome Local Storage</Button>
        <Button variant='outlined' onClick={clearBadge}>Clear Badge</Button>
        <Button variant='outlined' onClick={openModal(SCAN_ERROR_BIRTHDAYS_EXTRACT)}>Birthdays Extract Failed Modal</Button>
        <Button variant='outlined' onClick={openModal(SHOW_MODAL_SCANNING)}>Scanning Modal</Button>
        <Button variant='outlined' onClick={openModal(SHOW_MODAL_EXPORT_SUCCESS)}>Export Success Modal</Button>
        <Button variant='outlined' onClick={openModal(SCAN_ERROR_FACEBOOK_REQUIRED)}>Facebook Required Modal</Button>
        <Button variant='outlined' onClick={openModal(SCAN_ERROR_NO_TOKEN_DETECTED)}>No token detected Modal</Button>
      </Layout.Content>

    </Layout.Wrapper>);
};

export default DevTools;
