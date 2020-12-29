import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { translate } from '../../filters/translate';

interface DoneModalProps {
  onHide: () => void;
  open?: boolean;
}

const DoneModal: FunctionComponent<DoneModalProps> = (props) => {
  const {onHide, open = true} = props;

  const handleClose = () => {
    onHide();
  };

  // @TODO ADD DESCRIPTION REGARDING OUTLOOK EVENTS REMOVAL ISSUES
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id='DONE'> {translate('DONE_TITLE')}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {translate('DONE_DESCRIPTION')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          {translate('LEAVE_FEEDBACK_TITLE')}
        </Button>
        <Button onClick={handleClose} color='primary' autoFocus>
          {translate('CLOSE')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoneModal;
