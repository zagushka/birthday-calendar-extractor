import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import handleLink from '../../../filters/handleLink';
import { translate } from '../../../filters/translate';
import { translateString } from '../../../filters/translateString';
import { storeUserSettings } from '../../../libs/storage/chrome.storage';

const handleClose = () => storeUserSettings({modal: null}, true);
const handleClick = (href: string) => (e: React.MouseEvent) => {
  handleLink(e, href, {close: true, active: true});
  handleClose();
};

const NoTokenDetectedModal: FunctionComponent = (props) => {
  return (
    <Dialog
      open={true}
      onClose={handleClose}
    >
      <DialogTitle>{translate('ERROR_HEADER')}</DialogTitle>
      <DialogContent>
        {translate('SCAN_ERROR_NO_TOKEN_DETECTED')}
      </DialogContent>
      <DialogActions>
        <Button size='small'
                color='primary'
                variant='contained'
                onClick={handleClick(translateString('LOG_INTO_FACEBOOK_URL'))}
        >
          {translate('LOG_INTO_FACEBOOK_TITLE')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoTokenDetectedModal;
