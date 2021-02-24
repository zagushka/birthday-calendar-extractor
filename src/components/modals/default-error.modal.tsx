import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { translate } from '../../filters/translate';
import { ScanErrorPayload } from '../../libs/events/executed-script.types';
import { storeUserSettings } from '../../libs/storage/chrome.storage';

const handleClose = () => storeUserSettings({modal: null}, true);

const DefaultErrorModal: FunctionComponent<{ data: ScanErrorPayload }> = ({data}) => {

  return (
    <Dialog
      open={true}
      onClose={handleClose}
    >
      <DialogTitle>{translate('ERROR_HEADER')}</DialogTitle>

      <DialogContent>
        <p>{translate('GENERAL_ERROR')}</p>
        <p>{translate(data.type, data.error)}</p>
      </DialogContent>
      <DialogActions>
        <Button size='small'
                color='primary'
                variant='contained'
                onClick={handleClose}
        >
          {translate('CLOSE')}
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default DefaultErrorModal;
