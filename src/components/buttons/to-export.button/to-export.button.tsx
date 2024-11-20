import {
  Button,
  makeStyles,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../../../filters/translate';
import { handleCloseModal } from '../../modals/modals.lib';

const useStyles = makeStyles(() => ({
  success: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}));

const ToExportButton: FunctionComponent = () => {
  const classes = useStyles();
  const [countdown, setCountDown] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountDown((oldCountdown) => --oldCountdown);
    }, 1_000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      handleClick();
    }
  }, [countdown]);

  const handleClick = () => {
    navigate('/export', { replace: true });
    handleCloseModal();
  };

  return (
    <Button
      size="small"
      color="primary"
      variant="contained"
      className={classes.success}
      onClick={handleClick}
    >
      {t('TO_CALENDAR_EXPORT_TITLE', [countdown.toString()])}
    </Button>
  );
};

export default ToExportButton;
