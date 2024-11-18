import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { t } from '../../../filters/translate';
import { DialogCloseButton } from '../../buttons/dialog-close/dialog-close';
import ToExportButton from '../../buttons/to-export.button/to-export.button';
import ToCalendarButton from '../../buttons/to-calendar.button/to-calendar.button';
import {
  DialogTitle,
  handleCloseModal,
} from '../modals.lib';

const ScanSuccessModal: FunctionComponent = () => (
  // @TODO ADD DESCRIPTION REGARDING OUTLOOK EVENTS REMOVAL ISSUES
  <Dialog
    open
    onClose={handleCloseModal}
  >
    <DialogTitle>
      {t('MODAL_SCAN_SUCCESS_TITLE')}
    </DialogTitle>

    <DialogContent>
      <DialogContentText>
        {t('MODAL_SCAN_SUCCESS_DESCRIPTION')}
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <ToCalendarButton />
      <ToExportButton />
      <DialogCloseButton />
    </DialogActions>

  </Dialog>
);
export default ScanSuccessModal;
