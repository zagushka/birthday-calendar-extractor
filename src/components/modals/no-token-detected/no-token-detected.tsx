import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { t } from '../../../filters/translate';
import { DialogCloseButton } from '../../buttons/dialog-close/dialog-close';
import {
  DialogTitle,
  handleCloseModal,
  handleLinkClickAndCloseModal,
} from '../modals.lib';

const NoTokenDetectedModal: FunctionComponent = () => (
  <Dialog
    open
    onClose={handleCloseModal}
  >
    <DialogTitle>
      {t('ERROR_HEADER')}
    </DialogTitle>

    <DialogContent>
      <DialogContentText>
        {t('SCAN_ERROR_NO_TOKEN_DETECTED')}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        size="small"
        color="primary"
        variant="contained"
        onClick={() => handleLinkClickAndCloseModal('LOG_INTO_FACEBOOK_URL')}
      >
        {t('LOG_INTO_FACEBOOK_TITLE')}
      </Button>
      <DialogCloseButton />
    </DialogActions>
  </Dialog>
);

export default NoTokenDetectedModal;
