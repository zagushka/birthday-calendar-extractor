import {
  useEffect,
  useState,
} from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { downloadCalendar } from '../download-calendar';
import { StoredBirthday } from '@/libs/storage/storaged.types';

export function useCalendarDownloader(calendarType: any, users: Array<StoredBirthday>, settings?: any) {
  const [status, setStatus] = useState<'working' | 'standby'>('standby');
  const [result, setResult] = useState<'success' | 'failure' | 'pending'>('pending');
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (status === 'standby') {
      return;
    }

    const onDestroy$ = new Subject();
    downloadCalendar(calendarType, users, settings)
      .pipe(takeUntil(onDestroy$))
      .subscribe({
        next: () => {
          setResult('success');
          setStatus('standby');
        },
        error: (e) => {
          setResult('failure');
          setStatus('standby');
          setError(e);
        },
      });

    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
      setResult('pending');
    };
  }, [status, calendarType, users, settings]);

  return {
    status,
    result,
    error,
    startDownload: () => setStatus('working'),
  };
}
