import {
  Button,
  CircularProgress,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {
  green,
  red,
} from '@material-ui/core/colors';
import {
  Done,
  Error,
  PlayArrow,
} from '@material-ui/icons';
import clsx from 'clsx';

import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TodayUsersContext } from '../context/today-users.context';
import { BirthdaysStartScan } from '../libs/events/actions';
import {
  listenTo,
  sendMessage,
} from '../libs/events/events';
import { SEND_SCAN_LOG } from '../libs/events/types';
import Layout from './layout/layout';

const startScanHandler = () => {
  sendMessage(BirthdaysStartScan(), true);
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
      alignSelf: 'center',
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
    },
    buttonFail: {
      backgroundColor: red[500],
      '&:hover': {
        backgroundColor: red[700],
      },
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);

export const FirstScan: FunctionComponent = () => {
  const classes = useStyles();

  const {isScanning, isScanSucceed, isActive} = useContext(TodayUsersContext);
  const [log, setLog] = useState<string>();
  const [success, setSuccess] = useState<boolean>();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success && isScanSucceed,
    [classes.buttonFail]: success && !isScanSucceed,
  });

  useEffect(() => {
    if ('undefined' === typeof success && !isScanning) {
      setSuccess(false);
      return;
    }

    if (!isScanning) {
      setSuccess(true);
    }

  }, [isScanning]);

  useEffect(() => {
    const onDestroy$ = new Subject<boolean>();
    // Start listening to scan logs
    listenTo(SEND_SCAN_LOG)
      .pipe(takeUntil(onDestroy$))
      .subscribe(({action}) => {
        if (SEND_SCAN_LOG === action.type) {
          setLog(action.payload.messageName.toString());
        }
      });

    // Stop listening to scan logs
    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, []);

  const activeButtons = {birthdays: !isActive, export: !isActive || isScanning};

  console.log('FINE HERE', isScanning, isActive, log);

  return (
    <Layout.Wrapper>
      <Layout.Header disabledButtons={activeButtons}>
        <Box>Scan Birthdays</Box>
      </Layout.Header>

      <Layout.Content>

        {/*Upper part*/}
        <Box display={'flex'} textAlign={'center'} alignItems={'flex-end'} flexGrow={1} justifyContent={'center'}>
          Scan your Facebook friends birthdays.
          Already Existing birthdays will be preserved.
          Once scanned your birthdays can be exported as calendar any time.
        </Box>

        {/*Button*/}
        <Box display={'flex'} flexGrow={0} justifyContent={'center'}>
          <div className={classes.wrapper}>
            <Button
              variant='contained'
              color='primary'
              className={buttonClassname}
              disabled={isScanning}
              onClick={startScanHandler}
              startIcon={success ? (isScanSucceed ? <Done/> : <Error/>) : <PlayArrow/>}
            >
              Start scan
            </Button>
            {isScanning && <CircularProgress size={24} className={classes.buttonProgress}/>}
          </div>
        </Box>

        {/*Bottom part*/}
        <Box flexGrow={1} textAlign={'center'} display={'flex'} alignItems={'flex-start'} justifyContent={'center'}>
          {log}
        </Box>
      </Layout.Content>
    </Layout.Wrapper>
  );
};
