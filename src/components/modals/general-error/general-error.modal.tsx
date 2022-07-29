import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from '@material-ui/core';
import React, {
  FunctionComponent,
  useRef,
} from 'react';
import { translate } from '../../../filters/translate';
import { translateString } from '../../../filters/translateString';
import { ShowModalAction } from '../../../libs/events/types';
import { DialogCloseButton } from '../../buttons/dialog-close/dialog-close';
import {
  DialogTitle,
  handleCloseModal,
  handleLinkClickAndCloseModal,
} from '../modals.lib';

const GeneralErrorModal: FunctionComponent<{ error: ShowModalAction }> = ({ error }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const errorMessage = btoa(JSON.stringify(error));

  const handleReportBugClick = () => {
    copyToClipboard();
    handleLinkClickAndCloseModal('REPORT_A_BUG_URL');
  };

  const copyToClipboard = () => {
    const element = textAreaRef.current;
    element.focus();
    element.select();
    document.execCommand('Copy');
    element.blur();
  };
  return (
    <Dialog
      open
      onClose={handleCloseModal}
    >
      <DialogTitle>
        {translate('ERROR_HEADER')}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="textSecondary" paragraph>
          {translate(error.type)}
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          {translate('REPORT_A_BUG_DESCRIPTION')}
        </Typography>
        <TextField
          inputRef={textAreaRef}
          rows={4}
          fullWidth
          margin="none"
          value={translateString('REPORT_A_BUG_DETAILS_TEXTAREA', [errorMessage])}
          multiline
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          size="small"
          color="primary"
          variant="contained"
          onClick={handleReportBugClick}
        >
          {translate('REPORT_A_BUG_TITLE')}
        </Button>
        <DialogCloseButton />
      </DialogActions>

    </Dialog>
  );
};

export default GeneralErrorModal;
