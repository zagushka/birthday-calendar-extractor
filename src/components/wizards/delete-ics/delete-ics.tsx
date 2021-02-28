import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import update from 'immutability-helper';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { LoadingContext } from '../../../context/loading.context';
import {
  IcsSettings,
  SettingsContext,
} from '../../../context/settings.context';
import { translate } from '../../../filters/translate';
import { translateString } from '../../../filters/translateString';
import { createCalendarDeleteIcs } from '../../../libs/events/actions';
import { sendMessage } from '../../../libs/events/events';

const DeleteIcsGeneratorWizard: FunctionComponent = (props) => {
  const {startLoading, stopLoading} = useContext(LoadingContext);
  const {wizards, setWizards} = useContext(SettingsContext);

  const startGeneration = () => {
    const loaderName = startLoading();
    sendMessage(
      createCalendarDeleteIcs({
        groupEvents: wizards.ics.groupEvents,
      }),
    )
      .subscribe(() => stopLoading(loaderName));
  };

  const handleChange: <K extends keyof IcsSettings>(property: K) => any = (property) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: boolean = (event.target as HTMLInputElement).checked;
    const newState = update(wizards, {ics: {[property]: {$set: value}}});
    setWizards(newState);
  };

  return (
    <Box flexDirection='column' display='flex'>
      <Box pb={1}>
        {translate('SELECT_DELETE_ICS_DESCRIPTION')}
      </Box>
      <FormControl size='small' component='fieldset'>
        {/*<FormLabel component='legend'>Settings</FormLabel>*/}
        <FormGroup>
          <FormControlLabel control={<Switch size='small' onChange={handleChange('groupEvents')} checked={wizards.ics.groupEvents}/>}
                            label={translateString('CREATE_ICS_SETTINGS_ONE_EVENT_PER_DAY')}/>
        </FormGroup>
      </FormControl>
      <Box display='flex' justifyContent='flex-end'>
        <Button size='small' variant='contained' color='primary' onClick={startGeneration}>{translateString('GENERATE')}</Button>
      </Box>
    </Box>
  );
};

export default DeleteIcsGeneratorWizard;
