import { Typography } from '@material-ui/core';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
} from 'react';
import { CurrentStatusContext } from '../../../context/current-status.context';
import { translate } from '../../../filters/translate';
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
import GenerateAndDownloadButton from '../../buttons/generate.button/generate.button';

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

  if (!settings) {
    return null;
  }

  return (
    <>
      <Typography variant='body2' paragraph>
        {translate('SELECT_ICS_DESCRIPTION')}
      </Typography>

      <GenerateAndDownloadButton
        disabled={isScanning}
        onClick={startGeneration}
      />
    </>
  );
};

export default IcsGeneratorWizard;
