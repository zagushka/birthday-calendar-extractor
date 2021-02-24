import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { translate } from '../../filters/translate';
import { storeUserSettings } from '../../libs/storage/chrome.storage';
import LeaveFeedbackButton from '../leave-feedback.button/leave-feedback.button';

const handleClose = () => storeUserSettings({modal: null}, true);

const DoneModal: FunctionComponent = (props) => {

  // @TODO ADD DESCRIPTION REGARDING OUTLOOK EVENTS REMOVAL ISSUES
  return (
    <Dialog
      open={true}
      onClose={handleClose}
    >
      <DialogTitle id='DONE'> {translate('DONE_TITLE')}</DialogTitle>

      <DialogContent>
        {translate('DONE_DESCRIPTION')}
      </DialogContent>

      <DialogActions>
        <LeaveFeedbackButton onClick={handleClose}/>
      </DialogActions>

    </Dialog>
  );
};

export default DoneModal;
