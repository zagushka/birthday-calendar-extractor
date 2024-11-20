import {
  createStyles,
  Fab,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import {
  ScanErrorTypes,
  SHOW_MODAL_ADD_BIRTHDAYS,
} from '@/libs/events/executed-script.types';
import { ShowModalTypes } from '@/libs/events/types';
import { storeUserSettings } from '@/libs/storage/chrome.storage';

const useStyles = makeStyles((theme: Theme) => createStyles({
  fab: {
    position: 'absolute',
    bottom: 56 + theme.spacing(1),
    right: theme.spacing(2.5),
  },
}));

export const CreateButton: FunctionComponent = () => {
  const classes = useStyles();

  const openModal = (type: ScanErrorTypes | ShowModalTypes) => () => {
    storeUserSettings({ modal: { type } });
  };

  return (
    <Fab
      className={classes.fab}
      color="secondary"
      aria-label="add new birthday"
      onClick={openModal(SHOW_MODAL_ADD_BIRTHDAYS)}
    >
      <Add />
    </Fab>
  );
};
