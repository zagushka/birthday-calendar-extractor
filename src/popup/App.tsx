import './App.scss';
import React from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import UserSettings from '../components/user-settings/user-settings';
import { ACTION } from '../constants';
import {
  StatusReportAction,
  UpdateBadgeAction,
} from '../libs/events/actions';
import {
  listenTo,
  sendMessage,
} from '../libs/events/events';
import { storeLastBadgeClicked } from '../libs/storage/chrome.storage';

export default class App extends React.Component<any, any> {
  public status = 'USER_SETTINGS';
  onDestroy$: Subject<boolean> = new Subject();

  componentWillUnmount() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  componentDidMount() {
    // Store Badge is clicked now and send event later
    storeLastBadgeClicked()
      .subscribe(() => sendMessage(new UpdateBadgeAction()));

    // Listen to Show modal event on status report
    listenTo<StatusReportAction>(ACTION.STATUS_REPORT)
      .pipe(
        takeUntil(this.onDestroy$),
      )
      .subscribe(({action}) => {
        this.status = action.status;
        this.showModal(action.status);
      });
  }

  showModal(status: string) {
    // this.$root.$emit('bv::show::modal', status);
  }

  render() {
    return <div>
      <UserSettings/>
      {/*<done-modal/>*/}

      {/*<change-language-modal/>*/}
      {/*<no-token-detected-modal/>*/}
    </div>;
  }
}
