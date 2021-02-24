import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import React, { FunctionComponent } from 'react';
import handleLink from '../../filters/handleLink';
import { translate } from '../../filters/translate';
import { translateString } from '../../filters/translateString';
import { storeUserSettings } from '../../libs/storage/chrome.storage';

const useStyles = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}));

const handleClose = () => storeUserSettings({modal: null}, true);
const handleClick = (href: string) => (e: React.MouseEvent) => {
  handleLink(e, href, {close: true, active: true});
  handleClose();
};
const DoneModal: FunctionComponent = (props) => {

  const classes = useStyles();

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
        <Button size='small'
                color='primary'
                variant='contained'
                className={classes.success}
                onClick={handleClick(translateString('LEAVE_FEEDBACK_LINK'))}
        >
          {translateString('LEAVE_FEEDBACK_TITLE')}
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default DoneModal;
