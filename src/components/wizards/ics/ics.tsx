import { Typography } from '@material-ui/core';
import React, {
  FunctionComponent,
  useContext,
  useMemo,
} from 'react';
import { CurrentStatusContext } from '../../../context/current-status.context';
import { translate } from '../../../filters/translate';
import { CREATE_CALENDAR_ICS } from '../../../libs/events/types';
import { useHandleDownload } from '../../../libs/hooks/handle-download-calendar-results.hook';
import { STORED_BIRTHDAY } from '../../../libs/storage/storaged.types';
import GenerateAndDownloadButton from '../../buttons/generate.button/generate.button';

const IcsGeneratorWizard: FunctionComponent = () => {
  const {wizardsSettings: settings, users, isScanning} = useContext(CurrentStatusContext);

  // Remove "hidden" users from the list
  const activeUsers = useMemo(() => users.filter(u => !(u[STORED_BIRTHDAY.SETTINGS] ?? 0 & 1 << 0)), [users]);

  const {startDownload} = useHandleDownload(CREATE_CALENDAR_ICS, activeUsers, settings.ics);

  const startGeneration = () => startDownload();

  if (!settings) {
    return null;
  }

  return (
    <>
      <Typography variant='body2'>
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
