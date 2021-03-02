import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { translate } from '../../../filters/translate';
import { useScanLogListener } from '../../../libs/hooks/scan-log-listener.hook';
import { storeUserSettings } from '../../../libs/storage/chrome.storage';

const handleClose = () => storeUserSettings({modal: null});

const ScanningModal: FunctionComponent = (props) => {
  const [logs] = useScanLogListener();

  return (
    <Dialog
      open={true}
      onClose={handleClose}
    >
      <DialogTitle>
        {translate('MODAL_SCANNING_TITLE')}
      </DialogTitle>

      <DialogContent>
        {logs.map((value, index) => <li key={index}>{value}</li>)}
      </DialogContent>
    </Dialog>
  );
};

export default ScanningModal;
