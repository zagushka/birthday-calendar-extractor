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

const FacebookRequiredModal: FunctionComponent = () => {
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
          {translate('SCAN_ERROR_FACEBOOK_REQUIRED')}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button size='small'
                color='primary'
                variant='contained'
                onClick={() => handleLinkClickAndCloseModal('SCAN_ERROR_FACEBOOK_REQUIRED_LINK')}
        >
          {translate('SCAN_ERROR_FACEBOOK_REQUIRED_LINK_TITLE')}
        </Button>
        <DialogCloseButton/>
      </DialogActions>
    </Dialog>
  );
};

export default FacebookRequiredModal;
