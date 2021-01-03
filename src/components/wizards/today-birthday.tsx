import { Button } from '@material-ui/core';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { ACTIONS_SET } from '../../constants';
import { LoadingContext } from '../../context/loading.context';
import { StartGenerationAction } from '../../libs/events/actions';
import { sendMessage } from '../../libs/events/events';

const TodayBirthdayWizard: FunctionComponent = () => {
  const {startLoading, stopLoading} = useContext(LoadingContext);

  const startGeneration = () => {
    const loaderName = startLoading();
    sendMessage(new StartGenerationAction(ACTIONS_SET.ENABLE_BADGE))
      .subscribe(() => stopLoading(loaderName));
  };

  return (
    <>
      <video loop autoPlay={true}>
        <source src='/media/badge.mp4' type='video/mp4'/>
      </video>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <Button size='small' variant='contained' color='primary' onClick={startGeneration}>NEXT</Button>
    </>
  );
};

export default TodayBirthdayWizard;
