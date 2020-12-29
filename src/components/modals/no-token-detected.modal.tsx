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

interface NoTokenDetectedModalProps {
  onHide: () => void;
  open?: boolean;
}

const NoTokenDetectedModal: FunctionComponent<NoTokenDetectedModalProps> = (props) => {
  const {onHide, open = true} = props;

  const handleClose = () => {
    onHide();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id='NO_TOKEN_DETECTED'> {translate('ERROR_HEADER')}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {translate('NO_TOKEN_DETECTED')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          {translate('LOG_INTO_FACEBOOK_TITLE')}
        </Button>
        <Button onClick={handleClose} color='primary' autoFocus>
          {translate('CLOSE')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoTokenDetectedModal;
