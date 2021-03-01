import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import update from 'immutability-helper';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { CurrentStatusContext } from '../../../context/current-status.context';
import { translate } from '../../../filters/translate';
import { translateString } from '../../../filters/translateString';
import { downloadCalendar } from '../../../libs/download-calendar';
import { CREATE_CALENDAR_DELETE_ICS } from '../../../libs/events/types';
import { storeUserSettings } from '../../../libs/storage/chrome.storage';
import { IcsSettings } from '../../../libs/storage/storaged.types';

const DeleteIcsGeneratorWizard: FunctionComponent = (props) => {
  const {wizardsSettings: settings, users} = useContext(CurrentStatusContext);

  const startGeneration = () => {
    downloadCalendar(CREATE_CALENDAR_DELETE_ICS, users, settings.ics);
  };

  const handleChange: <K extends keyof IcsSettings>(property: K) => any = (property) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: boolean = event.target.checked;
    const wizardSettings = update(settings, {ics: {[property]: {$set: value}}});
    // Store updated settings
    storeUserSettings({wizardsSettings: wizardSettings});
  };

  if (!settings) {
    return (<></>);
  }

  return (
    <Box flexDirection='column' display='flex'>
      <Box pb={1}>
        {translate('SELECT_DELETE_ICS_DESCRIPTION')}
      </Box>
      {/*<FormControl size='small' component='fieldset'>*/}
      {/*  /!*<FormLabel component='legend'>Settings</FormLabel>*!/*/}
      {/*  <FormGroup>*/}
      {/*    <FormControlLabel control={<Switch size='small' onChange={handleChange('groupEvents')} checked={wizards.ics.groupEvents}/>}*/}
      {/*                      label={translateString('CREATE_ICS_SETTINGS_ONE_EVENT_PER_DAY')}/>*/}
      {/*  </FormGroup>*/}
      {/*</FormControl>*/}
      <Box display='flex' justifyContent='flex-end'>
        <Button size='small' variant='contained' color='primary' onClick={startGeneration}>{translateString('GENERATE')}</Button>
      </Box>
    </Box>
  );
};

export default DeleteIcsGeneratorWizard;
