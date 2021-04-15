import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { translate } from '../../../filters/translate';
import { DialogCloseButton } from '../../buttons/dialog-close/dialog-close';
import LeaveFeedbackButton from '../../buttons/leave-feedback.button/leave-feedback.button';
import {
  DialogTitle,
  handleCloseModal,
} from '../modals.lib';

const ScanSuccessModal: FunctionComponent = () => {
  // @TODO ADD DESCRIPTION REGARDING OUTLOOK EVENTS REMOVAL ISSUES
  return (
    <Dialog
      open={true}
      onClose={handleCloseModal}
    >
      <DialogTitle>
        {translate('MODAL_SCAN_SUCCESS_TITLE')}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {translate('MODAL_SCAN_SUCCESS_DESCRIPTION')}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <LeaveFeedbackButton onClick={handleCloseModal}/>
        <DialogCloseButton/>
      </DialogActions>

    </Dialog>
  );
};

export default ScanSuccessModal;
