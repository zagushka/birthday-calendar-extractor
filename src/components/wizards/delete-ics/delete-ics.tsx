import { Typography } from '@material-ui/core';
import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { CurrentStatusContext } from '@/context/current-status.context';
import { t } from '@/filters/translate';
import { CREATE_CALENDAR_DELETE_ICS } from "@/libs/events/types";
import { useHandleDownload } from "@/libs/hooks/handle-download-calendar-results.hook";
import GenerateAndDownloadButton from '@/components/buttons/generate.button/generate.button';

const DeleteIcsGeneratorWizard: FunctionComponent = () => {
  const { wizardsSettings: settings, users, isScanning } = useContext(CurrentStatusContext);
  const { startDownload } = useHandleDownload(CREATE_CALENDAR_DELETE_ICS, users, settings.ics);

  const startGeneration = () => startDownload();

  if (!settings) {
    return null;
  }

  return (
    <>
      <Typography variant="body2">
        {t('SELECT_DELETE_ICS_DESCRIPTION')}
      </Typography>

      <GenerateAndDownloadButton
        disabled={isScanning}
        onClick={startGeneration}
        calendarType="delete-ics"
      />
    </>
  );
};

export default DeleteIcsGeneratorWizard;
