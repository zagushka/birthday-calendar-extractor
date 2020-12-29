import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { Button } from 'react-bootstrap';
import { Subject } from 'rxjs';
import {
  pluck,
  startWith,
  switchMapTo,
  takeUntil,
} from 'rxjs/operators';

import {
  ACTION,
  ACTIONS_SET,
  STORAGE_KEYS,
} from '../constants';
import { translate } from '../filters/translate';
import { StartGenerationAction } from '../libs/events/actions';
import {
  listenTo,
  sendMessage,
} from '../libs/events/events';
import { retrieveUserSettings } from '../libs/storage/chrome.storage';
import BuyCoffeeButton from './buy-coffee.button';


interface ToggleShowBadgeButtonProps {
  onWaiting: (isWaiting: boolean) => void;
}

const ToggleShowBadgeButton: FunctionComponent<ToggleShowBadgeButtonProps> = (props) => {
  const {onWaiting} = props;
  const [isActive, setIsActive] = useState<boolean>(false);

  const onDestroy$: Subject<any> = new Subject();


  const deactivate = () => {
    onWaiting(true);
    sendMessage(new StartGenerationAction(ACTIONS_SET.DISABLE_BADGE))
      .subscribe(() => {
        onWaiting(false);
      });
  };

  const activate = () => {
    onWaiting(true);
    sendMessage(new StartGenerationAction(ACTIONS_SET.ENABLE_BADGE))
      .subscribe(() => {
        onWaiting(false);
      });
  };

  useEffect(() => {
    // Load current status and listen to updates
    listenTo(ACTION.BADGE_UPDATE)
      .pipe(
        takeUntil(onDestroy$),
        startWith(true),
        switchMapTo(retrieveUserSettings([STORAGE_KEYS.BADGE_ACTIVE])),
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


  return <div className='flex-grow-1'>
    {!isActive && <div className='flex-row'>
      Activate in order to see badge with number of birthdays.
      <div>{translate('ACTIVATE_BADGE_DESCRIPTION')}</div>
      <div className='d-flex flex-row justify-content-between'>
        <Button size='sm' variant='outline-dark'
                onClick={() => activate()}
        >{translate('ACTIVATE_BADGE_BUTTON_TITLE')}</Button>
      </div>
    </div>
    }

    {isActive && <div className='flex-column'>
      <div>{translate('DEACTIVATE_BADGE_DESCRIPTION')}</div>
      <div className='d-flex flex-row justify-content-between'>
        <Button size='sm' variant='outline-dark'
                onClick={() => deactivate()}
        >{translate('DEACTIVATE_BADGE_BUTTON_TITLE')}
        </Button>
      </div>

      <BuyCoffeeButton/>
    </div>
    }
  </div>;
};


export default ToggleShowBadgeButton;
