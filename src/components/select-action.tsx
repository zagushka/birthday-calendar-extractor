import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';

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
import ActionAccordion from './action-accordion';

const SelectAction: FunctionComponent = () => {

  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [action, setAction] = useState<ACTIONS_SET>(ACTIONS_SET.SELECT_FILE_FORMAT_CSV);

  const startGeneration = () => {
    sendMessage(new StartGenerationAction(action))
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
        setAction(a);
      });
  }, []);

  const handleChange = (selectedAction: ACTIONS_SET) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    const newAction = isExpanded ? selectedAction : null;
    storeUserSettings({[STORAGE_KEYS.LAST_SELECTED_ACTION]: newAction}, true);
    setAction(newAction);
  };

  return (
    <>
      <ActionAccordion action={ACTIONS_SET.ENABLE_BADGE} currentAction={action} onChange={handleChange}>
        Hi
        {/*<div className='d-flex flex-grow-1 border'>*/}
        {/*        <ResponsiveEmbed*/}
        {/*          autoplay loop*/}
        {/*          type='video' aspect='4by3'>*/}
        {/*          <source src='/media/badge.mp4' type='video/mp4'>*/}
        {/*        </ResponsiveEmbed>*/}
        {/*</div>*/}
      </ActionAccordion>

      <ActionAccordion action={ACTIONS_SET.SELECT_FILE_FORMAT_ICS} currentAction={action} onChange={handleChange}>
        {translate('SELECT_ICS_DESCRIPTION')}
      </ActionAccordion>

      <ActionAccordion action={ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS} currentAction={action} onChange={handleChange}>
        {translate('SELECT_DELETE_ICS_DESCRIPTION')}
      </ActionAccordion>

      <ActionAccordion action={ACTIONS_SET.SELECT_FILE_FORMAT_CSV} currentAction={action} onChange={handleChange}>
        {translate('FILE_FORMAT_CSV_DESCRIPTION')}
      </ActionAccordion>
    </>
  );
};

export default SelectAction;
