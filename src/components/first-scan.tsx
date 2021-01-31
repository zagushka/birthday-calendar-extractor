import {
  Button,
  Divider,
  IconButton,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Close } from '@material-ui/icons';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { TodayUsersContext } from '../context/today-users.context';
import { BirthdaysStartScan } from '../libs/events/actions';
import { sendMessage } from '../libs/events/events';
import { closeWindowHandler } from '../libs/tools';
import { useBirthdaysListStyles } from './birthdays-list/birthdays-list.styles';
import { ScanLog } from './scan-log';

const startScanHandler = () => {
  sendMessage(BirthdaysStartScan(), true);
};

export const FirstScan: FunctionComponent = () => {
  const classes = useBirthdaysListStyles();
  const {isScanning} = useContext(TodayUsersContext);

  return (
    <Box style={{minHeight: 200}}>
      <Box p={1} display='flex' alignItems='center' className={classes.day}>
        <Box>First Scan</Box>
        <Box flexGrow={1}/>
        <IconButton size='small' onClick={closeWindowHandler}>
          <Close/>
        </IconButton>
      </Box>

      <Divider/>

      <Box flexDirection={'column'}
           display={'flex'}
           alignItems={'center'}
           justifyContent={'center'}
           px={2}
           style={{minHeight: 200}}
      >
        {isScanning ? <ScanLog/> :
          <>
            <Box>Scan your Facebook friends birthdays.</Box>

            <Button
              color={'secondary'}
              size={'large'}
              onClick={startScanHandler}
            >
              <PlayCircleOutlineIcon fontSize={'large'}/> Start
            </Button>
          </>
        }
      </Box>
    </Box>
  );
};
