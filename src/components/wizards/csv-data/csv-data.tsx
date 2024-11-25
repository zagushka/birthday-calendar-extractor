import { Typography } from '@material-ui/core';
import React, {
  FunctionComponent,
  useContext,
  useMemo,
} from 'react';
import { CurrentStatusContext } from '@/context/current-status.context';
import { t } from '@/filters/translate';
import { CREATE_CSV_DATA } from "@/libs/events/types";
import { useHandleDownload } from '@/libs/hooks/handle-download-calendar-results.hook';
import { STORED_BIRTHDAY } from '@/libs/storage/storaged.types';
import GenerateAndDownloadButton from '@/components/buttons/generate.button/generate.button';

const CsvDataGeneratorWizard: FunctionComponent = () => {
  const { users, isScanning } = useContext(CurrentStatusContext);

  // Remove "hidden" users from the list
  const activeUsers = useMemo(() => users.filter((u) => {
    const settings = u[STORED_BIRTHDAY.SETTINGS] ?? 0;
    return (settings & 1) === 0;
  }), [users]);

  const { startDownload } = useHandleDownload(CREATE_CSV_DATA, activeUsers);

  const startGeneration = () => startDownload();

  return (
    <>
      <Typography variant="body2">
        {t('SELECT_CSV_DATA_DESCRIPTION')}
      </Typography>

      <GenerateAndDownloadButton
        disabled={isScanning}
        onClick={startGeneration}
        calendarType="csv-data"
      />
    </>
  );
};

export default CsvDataGeneratorWizard;
