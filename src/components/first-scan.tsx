import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import { PlayArrow } from '@material-ui/icons';
import ReplayIcon from '@material-ui/icons/Replay';
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
    root: {
      minHeight: 200,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: 1,
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
    },
    fabProgress: {
      color: green[500],
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1,
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

  const {isScanning, isActive} = useContext(TodayUsersContext);
  const [log, setLog] = useState<string>();
  const [isDone, setIsDone] = useState<boolean>(isScanning);

  useEffect(() => {
    if (!isScanning) {
      setIsDone(true);
    }
  }, [isScanning, isActive]);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: isScanning,
  });

  useEffect(() => {
    const onDestroy$ = new Subject<boolean>();
    // Start listening to scan logs
    listenTo(SEND_SCAN_LOG)
      .pipe(takeUntil(onDestroy$))
      .subscribe(({action}) => {
        if (SEND_SCAN_LOG === action.type) {
          setLog(action.payload.log);
        }
      });

    // Stop listening to scan logs
    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, []);

  return (
    <Layout.Wrapper>
      <Layout.Header navigation={'back'}>
        <Box>First Scan</Box>
      </Layout.Header>

      <Layout.Content
        // flexDirection={'column'}
        //    display={'flex'}
        //    alignItems={'center'}
        //    justifyContent={'center'}
        //    px={2}
        //    style={{minHeight: 200}}
      >
        isScanning {isScanning.toString()} : isActive {isActive.toString()}
        {isScanning ? <Box>Scanning</Box> :
          <>
            <Box>Scan your Facebook friends birthdays.</Box>

            <Fab
              aria-label='save'
              color='primary'
              onClick={startScanHandler}
              disabled={isScanning}
            >
              {isScanning ? <ReplayIcon/> : <PlayArrow/>}
            </Fab>
          </>
        }
        <Box>{log}</Box>
      </Layout.Content>
    </Layout.Wrapper>
  );
};
