import {
  Button,
  makeStyles,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import React, { FunctionComponent } from 'react';
import handleLink from '@/filters/handleLink';
import { translateString } from '@/filters/translateString';

const useStyles = makeStyles(() => ({
  success: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}));

interface LeaveFeedbackButtonProps {
  onClick?: () => void;
}

const LeaveFeedbackButton: FunctionComponent<LeaveFeedbackButtonProps> = (props) => {
  const classes = useStyles();

  const handleClick = (e: React.MouseEvent) => {
    handleLink('LEAVE_FEEDBACK_LINK', { close: true, active: true }, e);
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <Button
      size="small"
      color="primary"
      variant="contained"
      className={classes.success}
      onClick={handleClick}
    >
      {translateString('LEAVE_FEEDBACK_TITLE')}
    </Button>
  );
};

export default LeaveFeedbackButton;
