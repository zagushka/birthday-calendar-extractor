import { Button } from '@material-ui/core';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { LoadingContext } from '../context/loading.context';
import { BirthdaysStartScan } from '../libs/events/actions';
import { sendMessage } from '../libs/events/events';

export const ActivateBadge: FunctionComponent = () => {
  const {startLoading, isLoading} = useContext(LoadingContext);
  const handleClick = () => {
    // startLoading('WAITING_FOR_BADGE_TO_BE_ENABLED');
    sendMessage(BirthdaysStartScan(), true);
  };
  return (
    <>
      <Button onClick={handleClick}>Activate NOW</Button>
      {isLoading('WAITING_FOR_BADGE_TO_BE_ENABLED') && <div>Loading</div>}
    </>
  );
};
