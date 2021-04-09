import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { translate } from '../../../filters/translate';
import {
  DialogCloseButton,
  DialogTitle,
  handleCloseModal,
  handleLinkClickAndCloseModal,
} from '../modals.lib';

const NotSupportedLanguageModal: FunctionComponent = () => {
  return (
    <Dialog
      open={true}
      onClose={handleCloseModal}
    >
      <DialogTitle>
        {translate('ATTENTION_HEADER')}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {translate('SCAN_ERROR_NOT_SUPPORTED_LANGUAGE')}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button size='small'
                color='primary'
                variant='contained'
                onClick={() => handleLinkClickAndCloseModal('SCAN_ERROR_NOT_SUPPORTED_LANGUAGE_LINK')}
        >
          {translate('SCAN_ERROR_NOT_SUPPORTED_LANGUAGE_TITLE')}
        </Button>
        <DialogCloseButton/>
      </DialogActions>
    </Dialog>
  );
};

export default NotSupportedLanguageModal;
