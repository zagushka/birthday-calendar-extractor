import {
  createStyles,
  Fab,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: 56 + theme.spacing(1),
      right: theme.spacing(2.5),
    },
  }),
);


export const CreateButton: FunctionComponent = () => {
  const classes = useStyles();

  return (
    <Fab className={classes.fab} color='secondary' aria-label='add new birthday'>
      <Add/>
    </Fab>
  );
};

