import {
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { translate } from '../../filters/translate';
import BuyCoffeeButton from '../buttons/buy-coffee.button/buy-coffee.button';
import LeaveFeedbackButton from '../buttons/leave-feedback.button/leave-feedback.button';
import {
  DialogTitle,
  handleCloseModal,
} from './modals.lib';

const DoneModal: FunctionComponent = () => (
  // @TODO ADD DESCRIPTION REGARDING OUTLOOK EVENTS REMOVAL ISSUES
  <Dialog
    open
    onClose={handleCloseModal}
  >
    <DialogTitle>
      {translate('DONE_TITLE')}
    </DialogTitle>

    <DialogContent>
      <Typography variant="body1" color="textSecondary">
        {translate('DONE_DESCRIPTION')}
      </Typography>
    </DialogContent>

    <DialogActions>
      <LeaveFeedbackButton onClick={handleCloseModal} />
      <BuyCoffeeButton variant="outlined" color="secondary" withIcon />
      {/* <DialogCloseButton/> */}
    </DialogActions>

  </Dialog>
);
export default DoneModal;
