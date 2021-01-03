import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Switch,
} from '@material-ui/core';
import update from 'immutability-helper';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { ACTIONS_SET } from '../../constants';
import { LoadingContext } from '../../context/loading.context';
import {
  IcsSettings,
  SettingsContext,
} from '../../context/settings.context';
import { translate } from '../../filters/translate';
import { StartGenerationAction } from '../../libs/events/actions';
import { sendMessage } from '../../libs/events/events';

const DeleteIcsGeneratorWizard: FunctionComponent = (props) => {
  const {startLoading, stopLoading} = useContext(LoadingContext);
  const {wizards, setWizards} = useContext(SettingsContext);

  const startGeneration = () => {
    const loaderName = startLoading();
    sendMessage(new StartGenerationAction(ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS))
      .subscribe(() => stopLoading(loaderName));
  };

  const handleChange: <K extends keyof IcsSettings>(property: K) => any = (property) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: boolean = (event.target as HTMLInputElement).checked;
    const newState = update(wizards, {ics: {[property]: {$set: value}}});
    setWizards(newState);
  };

  return (
    <>
      {translate('SELECT_DELETE_ICS_DESCRIPTION')}
      <FormControl size='small' component='fieldset'>
        <FormLabel component='legend'>Settings</FormLabel>
        <FormGroup>
          <FormControlLabel control={<Switch size='small' onChange={handleChange('groupEvents')} checked={wizards.ics.groupEvents}/>}
                            label={'One event per day'}/>
          <FormControlLabel control={<Switch size='small' onChange={handleChange('allDayEvent')} checked={wizards.ics.allDayEvent}/>}
                            label={'All day event'}/>
        </FormGroup>
      </FormControl>
      <Button size='small' variant='contained' color='primary' onClick={startGeneration}>NEXT</Button>
    </>
  );
};

export default DeleteIcsGeneratorWizard;
