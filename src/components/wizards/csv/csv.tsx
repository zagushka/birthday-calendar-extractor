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
  useEffect,
} from 'react';
import { CurrentStatusContext } from '../../../context/current-status.context';
import { translate } from '../../../filters/translate';
import { translateString } from '../../../filters/translateString';
import { BirthdaysStartScan } from '../../../libs/events/actions';
import { sendMessage } from '../../../libs/events/events';
import { SCAN_ERROR_GENERAL } from '../../../libs/events/executed-script.types';
import {
  CREATE_CALENDAR_CSV,
  SHOW_MODAL_EXPORT_SUCCESS,
  SHOW_MODAL_SCANNING,
} from '../../../libs/events/types';
import { useCalendarDownloader } from '../../../libs/hooks/download-calendar.hook';
import { useWasOnOff } from '../../../libs/hooks/on-and-offs.hook';
import { storeUserSettings } from '../../../libs/storage/chrome.storage';
import { CsvDateFormats } from '../../../libs/storage/storaged.types';
import GenerateAndDownloadButton from '../../buttons/generate.button/generate.button';

const CsvGeneratorWizard: FunctionComponent = (props) => {
  const {wizardsSettings: settings, users, isActive, isScanSucceed, isScanning} = useContext(CurrentStatusContext);
  const [wasScanningAndDone, resetWasScanningAndDone] = useWasOnOff(isScanning);

  const {error, result, startDownload} = useCalendarDownloader(CREATE_CALENDAR_CSV, users, settings.csv);

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
