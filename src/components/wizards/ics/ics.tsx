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
import { BirthdaysStartScan } from '../../../libs/events/actions';
import { sendMessage } from '../../../libs/events/events';
import { SCAN_ERROR_GENERAL } from '../../../libs/events/executed-script.types';
import {
  CREATE_CALENDAR_ICS,
  SHOW_MODAL_EXPORT_SUCCESS,
  SHOW_MODAL_SCANNING,
} from '../../../libs/events/types';
import { useCalendarDownloader } from '../../../libs/hooks/download-calendar.hook';
import { useWasOnOff } from '../../../libs/hooks/on-and-offs.hook';
import { storeUserSettings } from '../../../libs/storage/chrome.storage';

const IcsGeneratorWizard: FunctionComponent = () => {
  const {wizardsSettings: settings, users, isActive, isScanSucceed, isScanning} = useContext(CurrentStatusContext);

  const [wasScanningAndDone, resetWasScanningAndDone] = useWasOnOff(isScanning);

  const {error, result, startDownload} = useCalendarDownloader(CREATE_CALENDAR_ICS, users, settings.ics);

  useEffect(() => {
    if ('success' === result) {
      storeUserSettings({modal: {type: SHOW_MODAL_EXPORT_SUCCESS}});
    }
  }, [result]);

  useEffect(() => {
    if (!!error) {
      storeUserSettings({modal: {type: SCAN_ERROR_GENERAL, error}});
    }
  }, [error]);

  useEffect(() => {
    if (wasScanningAndDone && isScanSucceed) {
      startDownload();
    }
  }, [wasScanningAndDone, isScanSucceed]);

  const startGeneration = () => {
    if (!isActive) {
      resetWasScanningAndDone();
      storeUserSettings({modal: {type: SHOW_MODAL_SCANNING}});
      sendMessage(BirthdaysStartScan(), true);
    } else {
      startDownload();
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
