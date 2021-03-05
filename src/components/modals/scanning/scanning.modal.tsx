import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { translate } from '../../../filters/translate';
import { useScanLogListener } from '../../../libs/hooks/scan-log-listener.hook';
import {
  DialogCloseButton,
  DialogTitle,
  handleCloseModal,
} from '../modals.lib';

const ScanningModal: FunctionComponent = () => {
  const [logs] = useScanLogListener();

  return (
    <Dialog
      open={true}
      onClose={handleCloseModal}
    >
      <DialogTitle>
        {translate('MODAL_SCANNING_TITLE')}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {logs.map((value, index) => <li key={index}>{value}</li>)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <DialogCloseButton/>
      </DialogActions>
    </Dialog>
  );
};

export default ScanningModal;
