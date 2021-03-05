import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { translate } from '../../filters/translate';
import LeaveFeedbackButton from '../leave-feedback.button/leave-feedback.button';
import {
  DialogCloseButton,
  DialogTitle,
  handleCloseModal,
} from './modals.lib';

const DoneModal: FunctionComponent = () => {

  // @TODO ADD DESCRIPTION REGARDING OUTLOOK EVENTS REMOVAL ISSUES
  return (
    <Dialog
      open={true}
      onClose={handleCloseModal}
    >
      <DialogTitle>
        {translate('DONE_TITLE')}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {translate('DONE_DESCRIPTION')}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <LeaveFeedbackButton onClick={handleCloseModal}/>
        <DialogCloseButton/>
      </DialogActions>

    </Dialog>
  );
};

export default DoneModal;
