import { Button } from '@material-ui/core';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Subject } from 'rxjs';
import {
  pluck,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import {
  ACTION,
  ACTIONS_SET,
  STORAGE_KEYS,
} from '../constants';
import { LoadingContext } from '../context/loading.context';
import { translate } from '../filters/translate';
import { StartGenerationAction } from '../libs/events/actions';
import {
  listenTo,
  sendMessage,
} from '../libs/events/events';
import { retrieveUserSettings } from '../libs/storage/chrome.storage';
import BuyCoffeeButton from './buy-coffee.button';

const ToggleShowBadgeButton: FunctionComponent = (props) => {

  const {stopLoading, startLoading} = useContext(LoadingContext);

  const [isActive, setIsActive] = useState<boolean>(false);

  const onDestroy$: Subject<any> = new Subject();

  const deactivate = () => {
    const loadingInstanceName = startLoading();
    sendMessage(new StartGenerationAction(ACTIONS_SET.DISABLE_BADGE))
      .subscribe(() => {
        stopLoading(loadingInstanceName);
      });
  };

  const activate = () => {
    const loadingInstanceName = startLoading();
    sendMessage(new StartGenerationAction(ACTIONS_SET.ENABLE_BADGE))
      .subscribe(() => {
        stopLoading(loadingInstanceName);
      });
  };

  useEffect(() => {
    // Load current status and listen to updates
    listenTo(ACTION.BADGE_UPDATE)
      .pipe(
        takeUntil(onDestroy$),
        startWith(true),
        switchMap(() => retrieveUserSettings([STORAGE_KEYS.BADGE_ACTIVE])),
        pluck(STORAGE_KEYS.BADGE_ACTIVE),
      )
      .subscribe(active => {
        setIsActive(active);
      });

    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, []);


  return (
    <div className='flex-grow-1'>
      {!isActive && <div className='flex-row'>
        Activate in order to see badge with number of birthdays.
        <div>{translate('ACTIVATE_BADGE_DESCRIPTION')}</div>
        <div className='d-flex flex-row justify-content-between'>
          <Button
            onClick={() => activate()}
          >{translate('ACTIVATE_BADGE_BUTTON_TITLE')}</Button>
        </div>
      </div>
      }

      {isActive && <div className='flex-column'>
        <div>{translate('DEACTIVATE_BADGE_DESCRIPTION')}</div>
        <div className='d-flex flex-row justify-content-between'>
          <Button
            onClick={() => deactivate()}
          >{translate('DEACTIVATE_BADGE_BUTTON_TITLE')}
          </Button>
        </div>

        <BuyCoffeeButton/>
      </div>
      }
    </div>
  );
};

export default ToggleShowBadgeButton;
