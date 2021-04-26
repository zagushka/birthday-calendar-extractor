import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import update from 'immutability-helper';
import React, {
  FunctionComponent,
  useContext,
  useMemo,
} from 'react';
import { CurrentStatusContext } from '../../../context/current-status.context';
import { translate } from '../../../filters/translate';
import { translateString } from '../../../filters/translateString';
import { CREATE_CALENDAR_CSV } from '../../../libs/events/types';
import { useHandleDownload } from '../../../libs/hooks/handle-download-calendar-results.hook';
import { storeUserSettings } from '../../../libs/storage/chrome.storage';
import {
  CsvDateFormats,
  STORED_BIRTHDAY,
} from '../../../libs/storage/storaged.types';
import GenerateAndDownloadButton from '../../buttons/generate.button/generate.button';

const CsvGeneratorWizard: FunctionComponent = (props) => {
  const {wizardsSettings: settings, users, isScanning} = useContext(CurrentStatusContext);

  // Remove "hidden" users from the list
  const activeUsers = useMemo(() => users.filter(u => !(u[STORED_BIRTHDAY.SETTINGS] ?? 0 & 1 << 0)), [users]);

  const {startDownload} = useHandleDownload(CREATE_CALENDAR_CSV, activeUsers, settings.csv);

  const startGeneration = () => {
    startDownload();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as CsvDateFormats;
    const wizardSettings = update(settings, {csv: {format: {$set: value}}});
    // Store updated settings
    storeUserSettings({wizardsSettings: wizardSettings});
  };

  if (!settings) {
    return null;
  }

  return (
    <>
      <Typography variant='body2'>
        {translate('FILE_FORMAT_CSV_DESCRIPTION')}
      </Typography>

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
      <GenerateAndDownloadButton
        disabled={isScanning}
        onClick={startGeneration}
      />
    </>
  );
};

export default CsvGeneratorWizard;
