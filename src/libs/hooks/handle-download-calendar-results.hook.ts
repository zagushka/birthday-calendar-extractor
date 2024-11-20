import { useEffect } from 'react';
import { SCAN_ERROR_GENERAL } from '@/libs/events/executed-script.types';
import { SHOW_MODAL_EXPORT_SUCCESS } from '@/libs/events/types';
import { storeUserSettings } from '@/libs/storage/chrome.storage';
import { StoredBirthday } from '@/libs/storage/storaged.types';
import { useCalendarDownloader } from './download-calendar.hook';

export const useHandleDownload = (calendarType: any, users: Array<StoredBirthday>, settings?: any) => {
  const { error, result, startDownload } = useCalendarDownloader(calendarType, users, settings);

  useEffect(() => {
    if (result === 'success') {
      storeUserSettings({ modal: { type: SHOW_MODAL_EXPORT_SUCCESS } });
    }
  }, [result]);

  useEffect(() => {
    if (error) {
      storeUserSettings({ modal: { type: SCAN_ERROR_GENERAL, error } });
    }
  }, [error]);

  return { error, result, startDownload };
};
