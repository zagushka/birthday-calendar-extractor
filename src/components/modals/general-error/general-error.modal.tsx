import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import React, {
  FunctionComponent,
  useRef,
} from 'react';
import handleLink from '../../../filters/handleLink';
import { translate } from '../../../filters/translate';
import { translateString } from '../../../filters/translateString';
import { ScanErrorPayload } from '../../../libs/events/executed-script.types';
import { storeUserSettings } from '../../../libs/storage/chrome.storage';

const handleClose = () => storeUserSettings({modal: null}, true);

const GeneralErrorModal: FunctionComponent<{ error: ScanErrorPayload }> = ({error}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const errorMessage = btoa(JSON.stringify(error));

  const handleReportBugClick = (href: string) => (e: React.MouseEvent) => {
    copyToClipboard();
    handleLink(e, href, {close: true, active: true});
    handleClose();
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
      open={true}
      onClose={handleClose}
    >
      <DialogTitle>{translate('ERROR_HEADER')}</DialogTitle>

      <DialogContent>
        <p>{translate(error.type)}</p>
        <p>{translate('REPORT_A_BUG_DESCRIPTION')}</p>
        <TextField
          inputRef={textAreaRef}
          rows={4}
          margin={'none'}
          value={translateString('REPORT_A_BUG_DETAILS_TEXTAREA', [errorMessage])}
          multiline
          variant='outlined'
          InputProps={{
            readOnly: true,
          }}
        />
        <Button size='small'
                color='primary'
                variant='text'
                onClick={handleReportBugClick(translateString('REPORT_A_BUG_URL'))}
        >
          {translate('REPORT_A_BUG_TITLE')}
        </Button>
      </DialogContent>
      <DialogActions>
        <Button size='small'
                color='primary'
                variant='contained'
                onClick={handleClose}
        >
          {translate('CLOSE')}
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default GeneralErrorModal;
