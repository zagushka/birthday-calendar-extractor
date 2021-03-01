import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import update from 'immutability-helper';
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
import { CREATE_CALENDAR_CSV } from '../../../libs/events/types';
import { useWasOnOff } from '../../../libs/hooks/on-and-offs.hook';
import { storeUserSettings } from '../../../libs/storage/chrome.storage';
import { CsvDateFormats } from '../../../libs/storage/storaged.types';

const CsvGeneratorWizard: FunctionComponent = (props) => {
  const {wizardsSettings: settings, users, isActive, isScanSucceed, isScanning} = useContext(CurrentStatusContext);
  const [wasScanningAndDone, resetWasScanningAndDone] = useWasOnOff(isScanning);

  useEffect(() => {
    if (wasScanningAndDone && isScanSucceed) {
      downloadCalendar(CREATE_CALENDAR_CSV, users, settings.csv);
    }
  }, [wasScanningAndDone, isScanSucceed]);

  const startGeneration = () => {
    if (!isActive) {
      resetWasScanningAndDone();
      sendMessage(BirthdaysStartScan(), true);
    } else {
      downloadCalendar(CREATE_CALENDAR_CSV, users, settings.csv);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as CsvDateFormats;
    const wizardSettings = update(settings, {csv: {format: {$set: value}}});
    // Store updated settings
    storeUserSettings({wizardsSettings: wizardSettings});
  };

  if (!settings) {
    return (<></>);
  }

  return (
    <Box flexDirection='column' display='flex'>
      <Box pb={1}>
        {translate('FILE_FORMAT_CSV_DESCRIPTION')}
      </Box>
      <FormControl size='small' component='fieldset'>
        <FormLabel component='legend'>{translateString('CREATE_CSV_SETTINGS_DATE_FORMAT')}</FormLabel>
        <RadioGroup row name='date-format' value={settings.csv.format} onChange={handleChange}>
          <FormControlLabel
            value='dd/LL/yyyy'
            control={<Radio size='small'/>}
            label={translateString('CREATE_CSV_SETTINGS_DATE_FORMAT_DAY_MONTH')}/>
          <FormControlLabel
            value='LL/dd/yyyy'
            control={<Radio size='small'/>}
            label={translateString('CREATE_CSV_SETTINGS_DATE_FORMAT_MONTH_DAY')}/>
        </RadioGroup>
      </FormControl>
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

export default CsvGeneratorWizard;
