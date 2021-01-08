import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { LoadingContext } from '../../context/loading.context';
import { translateString } from '../../filters/translate';
import { enableBadgeNotifications } from '../../libs/events/actions';
import { sendMessage } from '../../libs/events/events';

const TodayBirthdayWizard: FunctionComponent = () => {
  const {startLoading, stopLoading} = useContext(LoadingContext);

  const startGeneration = () => {
    const loaderName = startLoading();
    sendMessage(enableBadgeNotifications())
      .subscribe(() => stopLoading(loaderName));
  };

  return (
    <Box flexDirection='column' display='flex'>
      <video loop autoPlay={true}>
        <source src='/media/badge.mp4' type='video/mp4'/>
      </video>
      <Box>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </Box>
      <Box display='flex' justifyContent='flex-end'>
        <Button size='small' variant='contained' color='primary' onClick={startGeneration}>{translateString('GENERATE')}</Button>
      </Box>
    </Box>
  );
};

export default TodayBirthdayWizard;
