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
} from 'react';
import { CurrentStatusContext } from '../../context/current-status.context';
import { translateString } from '../../filters/translateString';
import { BirthdaysStartScan } from '../../libs/events/actions';
import { sendMessage } from '../../libs/events/events';
import { useWasOnOff } from '../../libs/hooks/on-and-offs.hook';
import { useScanLogListener } from '../../libs/hooks/scan-log-listener.hook';
import Layout from '../layout/layout';

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

export const Scan: FunctionComponent = () => {
  const classes = useStyles();

  const {isScanning, isScanSucceed, isActive} = useContext(CurrentStatusContext);
  const [[log], resetLog] = useScanLogListener(1);
  const [wasScanningAndDone, resetWasScanningAndDone] = useWasOnOff(isScanning);

  const startScanHandler = () => {
    resetWasScanningAndDone();
    resetLog();
    sendMessage(BirthdaysStartScan(), true);
  };

  const buttonClassname = clsx({
    [classes.buttonSuccess]: wasScanningAndDone && isScanSucceed,
    [classes.buttonFail]: wasScanningAndDone && !isScanSucceed,
  });

  const disabledButtons = {birthdays: !isActive, export: isScanning};
  const activeTooltips = {export: isActive && wasScanningAndDone && isScanSucceed};

  return (
    <Layout.Wrapper>
      <Layout.Header disabledButtons={disabledButtons} tooltipButtons={activeTooltips}>
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
              startIcon={wasScanningAndDone ? (isScanSucceed ? <Done/> : <Error/>) : <PlayArrow/>}
            >
              {translateString('START_SCAN')}
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
