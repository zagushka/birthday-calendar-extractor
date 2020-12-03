import React from 'react';
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
import translate from '../filters/translate';
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

interface ToggleShowBadgeButtonState {
  isActive: boolean;
}

export default class ToggleShowBadgeButton extends React.Component<ToggleShowBadgeButtonProps, ToggleShowBadgeButtonState> {

  constructor(props: ToggleShowBadgeButtonProps) {
    super(props);
    this.state = {
      isActive: false,
    };
  }

  onDestroy$: Subject<any> = new Subject();

  deactivate() {
    this.props.onWaiting(true);
    sendMessage(new StartGenerationAction(ACTIONS_SET.DISABLE_BADGE))
      .subscribe(() => {
        this.props.onWaiting(false);
      });
  }

  activate() {
    this.props.onWaiting(true);
    sendMessage(new StartGenerationAction(ACTIONS_SET.ENABLE_BADGE))
      .subscribe(() => {
        this.props.onWaiting(false);
      });
  }

  componentWillUnmount() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  componentDidMount() {
    // Load current status and listen to updates
    listenTo(ACTION.UPDATE_BADGE)
      .pipe(
        takeUntil(this.onDestroy$),
        startWith(true),
        switchMapTo(retrieveUserSettings([STORAGE_KEYS.BADGE_ACTIVE])),
        pluck(STORAGE_KEYS.BADGE_ACTIVE),
      )
      .subscribe(isActive => {
        this.setState({isActive});
      });
  }

  render() {
    return <div className='flex-grow-1'>
      {!this.state.isActive && <div className='flex-row'>
        Activate in order to see badge with number of birthdays.
        <div>{translate('ACTIVATE_BADGE_DESCRIPTION')}</div>
        <div className='d-flex flex-row justify-content-between'>
          <Button size='sm' variant='outline-dark'
                  onClick={() => this.activate()}
          >{translate('ACTIVATE_BADGE_BUTTON_TITLE')}</Button>
        </div>
      </div>
      }

      {this.state.isActive && <div className='flex-column'>
        <div>{translate('DEACTIVATE_BADGE_DESCRIPTION')}</div>
        <div className='d-flex flex-row justify-content-between'>
          <Button size='sm' variant='outline-dark'
                  onClick={() => this.deactivate()}
          >{translate('DEACTIVATE_BADGE_BUTTON_TITLE')}
          </Button>
        </div>

        <BuyCoffeeButton/>
      </div>
      }
    </div>;
  }
}
