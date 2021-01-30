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
import { LoadingContext } from '../context/loading.context';
import { BirthdaysStartExtraction } from '../libs/events/actions';
import { sendMessage } from '../libs/events/events';
import { closeWindowHandler } from '../libs/tools';
import { useBirthdaysListStyles } from './birthdays-list/birthdays-list.styles';

export const FirstScan: FunctionComponent = () => {
  const {startLoading, isLoading} = useContext(LoadingContext);
  const classes = useBirthdaysListStyles();

  const handleClick = () => {
    startLoading('WAITING_FOR_BADGE_TO_BE_ENABLED');
    sendMessage(BirthdaysStartExtraction(), true);
  };

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
           style={{height: 200}}
      >
        <Box>Scan your Facebook friends birthdays.</Box>

        <Button color={'secondary'} size={'large'} onClick={handleClick}>
          <PlayCircleOutlineIcon fontSize={'large'}/> Start
        </Button>
      </Box>
    </Box>
  );
};
