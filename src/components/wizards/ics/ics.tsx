import { Typography } from '@material-ui/core';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { CurrentStatusContext } from '../../../context/current-status.context';
import { translate } from '../../../filters/translate';
import { CREATE_CALENDAR_ICS } from '../../../libs/events/types';
import { useHandleDownload } from '../../../libs/hooks/handle-download-calendar-results.hook';
import GenerateAndDownloadButton from '../../buttons/generate.button/generate.button';

const IcsGeneratorWizard: FunctionComponent = () => {
  const {wizardsSettings: settings, users, isScanning} = useContext(CurrentStatusContext);
  const {startDownload} = useHandleDownload(CREATE_CALENDAR_ICS, users, settings.ics);

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
