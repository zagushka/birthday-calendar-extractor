import React from 'react';
import {
  Button,
  Tab,
  Tabs,
} from 'react-bootstrap';
import { pluck } from 'rxjs/operators';
import {
  ACTIONS_SET,
  STORAGE_KEYS,
} from '../constants';
import translate from '../filters/translate';
import { StartGenerationAction } from '../libs/events/actions';
import { sendMessage } from '../libs/events/events';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../libs/storage/chrome.storage';
import LeaveFeedbackButton from './leave-feedback.button';

interface SelectActionState {
  isWaiting: boolean;
  action: ACTIONS_SET;
}

export default class SelectAction extends React.Component<any, SelectActionState> {
  state: SelectActionState = {
    isWaiting: true,
    action: ACTIONS_SET.SELECT_FILE_FORMAT_CSV,
  };

  componentDidMount() {
    retrieveUserSettings([STORAGE_KEYS.LAST_SELECTED_ACTION])
      .pipe(
        pluck(STORAGE_KEYS.LAST_SELECTED_ACTION),
      )
      .subscribe((action) => {
        this.setState({
          action,
          isWaiting: false,
        });
      });
  }

  setAction(action: ACTIONS_SET) {
    storeUserSettings({[STORAGE_KEYS.LAST_SELECTED_ACTION]: action}, true);
    this.setState({action});
  };

  setWaiting(isWaiting: boolean) {
    this.setState({isWaiting});
  }

  startGeneration() {
    sendMessage(new StartGenerationAction(this.state.action))
      .subscribe(() => this.setWaiting(false));
    this.setWaiting(true);
  }

  render() {
    return <div className='d-flex flex-row' style={{width: '600px', minHeight: '160px'}}>
      <Tabs
        nav-class='no-wrap'
        content-class='mt-2'
        activeKey={this.state.action}
        defaultActiveKey={this.state.action}
        onSelect={(a) => this.setAction(a as ACTIONS_SET)}
      >

        <Tab title={translate(ACTIONS_SET.ENABLE_BADGE)}
             eventKey={ACTIONS_SET.ENABLE_BADGE}>
          <div className='d-flex flex-grow-1 border'>
            {/*        <ResponsiveEmbed*/}
            {/*          autoplay loop*/}
            {/*          type='video' aspect='4by3'>*/}
            {/*          <source src='/media/badge.mp4' type='video/mp4'>*/}
            {/*        </ResponsiveEmbed>*/}
          </div>
        </Tab>

        <Tab title={translate(ACTIONS_SET.SELECT_FILE_FORMAT_ICS)}
             eventKey={ACTIONS_SET.SELECT_FILE_FORMAT_ICS}>
          {translate('SELECT_ICS_DESCRIPTION')}
        </Tab>

        <Tab title={translate(ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS)}
             eventKey={ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS}>
          {translate('SELECT_DELETE_ICS_DESCRIPTION')}
        </Tab>

        <Tab title={translate(ACTIONS_SET.SELECT_FILE_FORMAT_CSV)}
             eventKey={ACTIONS_SET.SELECT_FILE_FORMAT_CSV}>
          {translate('FILE_FORMAT_CSV_DESCRIPTION')}
        </Tab>

      </Tabs>


      <div className='d-flex align-items-start flex-shrink-0 flex-column ml-auto'>
        <div className='d-flex flex-nowrap mt-auto align-self-stretch'>
          <Button size='sm'
                  variant='outline-success'
                  onClick={this.startGeneration}>
            {translate('GENERATE')}
          </Button>

          <LeaveFeedbackButton/>
        </div>
      </div>
    </div>;
  }
}
