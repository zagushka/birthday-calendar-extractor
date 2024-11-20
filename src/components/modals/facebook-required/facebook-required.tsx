import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { t } from '@/filters/translate';
import { DialogCloseButton } from '@/components/buttons/dialog-close/dialog-close';
import {
  DialogTitle,
  handleCloseModal,
  handleLinkClickAndCloseModal,
} from '@/components/modals/modals.lib';

const FacebookRequiredModal: FunctionComponent = () => (
  <Dialog
    open
    onClose={handleCloseModal}
  >
    <DialogTitle>
      {t('ATTENTION_HEADER')}
    </DialogTitle>

    <DialogContent>
      <DialogContentText>
        {t('SCAN_ERROR_FACEBOOK_REQUIRED')}
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button
        size="small"
        color="primary"
        variant="contained"
        onClick={() => handleLinkClickAndCloseModal('SCAN_ERROR_FACEBOOK_REQUIRED_LINK')}
      >
        {t('SCAN_ERROR_FACEBOOK_REQUIRED_LINK_TITLE')}
      </Button>
      <DialogCloseButton />
    </DialogActions>
  </Dialog>
);

export default FacebookRequiredModal;
