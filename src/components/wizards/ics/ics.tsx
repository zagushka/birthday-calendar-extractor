import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
} from 'react';
import { CurrentStatusContext } from '../../../context/current-status.context';
import { translate } from '../../../filters/translate';
import { translateString } from '../../../filters/translateString';
import { downloadCalendar } from '../../../libs/download-calendar';
import { BirthdaysStartScan } from '../../../libs/events/actions';
import { sendMessage } from '../../../libs/events/events';
import { CREATE_CALENDAR_ICS } from '../../../libs/events/types';
import { useWasOnOff } from '../../../libs/hooks/on-and-offs.hook';

const IcsGeneratorWizard: FunctionComponent = (props) => {
  const {wizardsSettings: settings, users, isActive, isScanSucceed, isScanning} = useContext(CurrentStatusContext);
  const [wasScanningAndDone, resetWasScanningAndDone] = useWasOnOff(isScanning);

  useEffect(() => {
    if (wasScanningAndDone && isScanSucceed) {
      downloadCalendar(CREATE_CALENDAR_ICS, users, settings.ics);
    }
  }, [wasScanningAndDone, isScanSucceed]);

  const startGeneration = () => {
    if (!isActive) {
      resetWasScanningAndDone();
      sendMessage(BirthdaysStartScan(), true);
    } else {
      downloadCalendar(CREATE_CALENDAR_ICS, users, settings.ics);
    }
  };

  // const handleChange: <K extends keyof IcsSettings>(property: K) => any = (property) => (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value: boolean = event.target.checked;
  //   const wizardSettings = update(settings, {ics: {[property]: {$set: value}}});
  //   // Store updated settings
  //   storeUserSettings({wizardsSettings: wizardSettings});
  // };

  if (!settings) {
    return (<></>);
  }

  return (
    <Box flexDirection='column' display='flex'>
      <Box pb={1}>
        {translate('SELECT_ICS_DESCRIPTION')}
      </Box>
      {/*<FormControl size='small' component='fieldset'>*/}
      {/*  /!*<FormLabel component='legend'>Settings</FormLabel>*!/*/}
      {/*  <FormGroup>*/}
      {/*    <FormControlLabel control={<Switch size='small' onChange={handleChange('groupEvents')} checked={wizards.ics.groupEvents}/>}*/}
      {/*                      label={translateString('CREATE_ICS_SETTINGS_ONE_EVENT_PER_DAY')}/>*/}
      {/*  </FormGroup>*/}
      {/*</FormControl>*/}
      <Box display='flex' justifyContent='flex-end'>
        <Button size='small'
                variant='contained'
                color='primary'
                disabled={isScanning}
                onClick={startGeneration}>
          {translateString('GENERATE')}
        </Button>
      </Box>
    </Box>
  );
};

export default IcsGeneratorWizard;
