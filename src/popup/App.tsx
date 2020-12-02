import React from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import ChangeLanguageModal from '../components/modals/change-language.modal';
import DoneModal from '../components/modals/done.modal';
import NoTokenDetectedModal from '../components/modals/no-token-detected.modal';
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
import './App.scss';

interface AppState {
  modal?: string
}

export default class App extends React.Component<{}, AppState> {
  onDestroy$: Subject<boolean> = new Subject();

  constructor(params: {}) {
    super(params);
    this.state = {};
  }

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
        this.setModal(action.status);
      });
  }

  setModal(modal: string = null) {
    this.setState({modal: modal});
  }

  render() {
    return <div>
      <UserSettings/>
      <DoneModal show={'DONE' === this.state.modal} onHide={() => this.setModal()}/>
      <ChangeLanguageModal show={'NOT_SUPPORTED_LANGUAGE' === this.state.modal} onHide={() => this.setModal()}/>
      <NoTokenDetectedModal show={'NO_TOKEN_DETECTED' === this.state.modal} onHide={() => this.setModal()}/>
    </div>;
  }
}
