import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  ListGroup,
  Tab,
} from 'react-bootstrap';
import { pluck } from 'rxjs/operators';
import {
  ACTIONS_SET,
  STORAGE_KEYS,
} from '../constants';
import { translate } from '../filters/translate';
import { StartGenerationAction } from '../libs/events/actions';
import { sendMessage } from '../libs/events/events';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../libs/storage/chrome.storage';
import LeaveFeedbackButton from './leave-feedback.button';

const SelectAction: FunctionComponent = () => {

  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [selectedAction, setSelectedAction] = useState<ACTIONS_SET>(ACTIONS_SET.SELECT_FILE_FORMAT_CSV);

  const setAction = (action: ACTIONS_SET) => {
    storeUserSettings({[STORAGE_KEYS.LAST_SELECTED_ACTION]: action}, true);
    setSelectedAction(action);
  };

  const startGeneration = () => {
    sendMessage(new StartGenerationAction(selectedAction))
      .subscribe(() => setIsWaiting(false));
    setIsWaiting(true);
  };

  useEffect(() => {
    retrieveUserSettings([STORAGE_KEYS.LAST_SELECTED_ACTION])
      .pipe(
        pluck(STORAGE_KEYS.LAST_SELECTED_ACTION),
      )
      .subscribe((a) => {
        setIsWaiting(false);
        setSelectedAction(a);
      });
  }, []);

  return <>
    <div className='d-flex flex-row' style={{width: '600px', minHeight: '160px'}}>

      <Tab.Container
        activeKey={selectedAction}
        onSelect={(e) => setAction(e as ACTIONS_SET)}
      >
        <ListGroup className='flex-column no-wrap'>
          <ListGroup.Item
            action
            eventKey={ACTIONS_SET.ENABLE_BADGE}
          >
            {translate(ACTIONS_SET.ENABLE_BADGE)}
          </ListGroup.Item>

          <ListGroup.Item
            action
            eventKey={ACTIONS_SET.SELECT_FILE_FORMAT_ICS}
          >
            {translate(ACTIONS_SET.SELECT_FILE_FORMAT_ICS)}
          </ListGroup.Item>

          <ListGroup.Item
            action
            eventKey={ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS}
          >
            {translate(ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS)}
          </ListGroup.Item>

          <ListGroup.Item
            action
            eventKey={ACTIONS_SET.SELECT_FILE_FORMAT_CSV}
          >
            {translate(ACTIONS_SET.SELECT_FILE_FORMAT_CSV)}
          </ListGroup.Item>
        </ListGroup>

        <Tab.Content>
          <Tab.Pane eventKey={ACTIONS_SET.ENABLE_BADGE}>
            {/*<div className='d-flex flex-grow-1 border'>*/}
            {/*        <ResponsiveEmbed*/}
            {/*          autoplay loop*/}
            {/*          type='video' aspect='4by3'>*/}
            {/*          <source src='/media/badge.mp4' type='video/mp4'>*/}
            {/*        </ResponsiveEmbed>*/}
            {/*</div>*/}
          </Tab.Pane>

          <Tab.Pane eventKey={ACTIONS_SET.SELECT_FILE_FORMAT_ICS}>
            {translate('SELECT_ICS_DESCRIPTION')}
          </Tab.Pane>

          <Tab.Pane eventKey={ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS}>
            {translate('SELECT_DELETE_ICS_DESCRIPTION')}
          </Tab.Pane>

          <Tab.Pane eventKey={ACTIONS_SET.SELECT_FILE_FORMAT_CSV}>
            {translate('FILE_FORMAT_CSV_DESCRIPTION')}
          </Tab.Pane>
        </Tab.Content>

      </Tab.Container>
    </div>
    <div className='d-flex align-items-start flex-shrink-0 flex-column ml-auto'>
      <div className='d-flex flex-nowrap mt-auto align-self-end'>
        <Button size='sm'
                variant='outline-success'
                onClick={startGeneration}>
          {translate('GENERATE')}
        </Button>
        {' '}
        <LeaveFeedbackButton/>
      </div>
    </div>
  </>;
};

export default SelectAction;
