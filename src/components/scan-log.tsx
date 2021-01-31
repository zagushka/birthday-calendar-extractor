import Box from '@material-ui/core/Box';
import update from 'immutability-helper';
import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { listenTo } from '../libs/events/events';
import { SCAN_LOG } from '../libs/events/types';

export const ScanLog: FunctionComponent = () => {
  const [log, setLog] = useState<Array<string>>([]);

  useEffect(() => {
    const onDestroy$ = new Subject<boolean>();
    // Start listening to scan logs
    listenTo(SCAN_LOG)
      .pipe(takeUntil(onDestroy$))
      .subscribe(({action}) => {
        if (SCAN_LOG === action.type) {
          setLog(update(log, {$push: [action.payload.log]}));
        }
      });

    // Stop listening to scan logs
    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, []);

  return (
    <Box flexDirection={'column'}
         display={'flex'}
         alignItems={'center'}
         justifyContent={'center'}
         px={2}
         style={{minHeight: 200}}
    >
      <Box>Scan Log</Box>
      <Box>
        <ul>
          {log.map((row) => <li>{row}</li>)}
        </ul>
      </Box>
    </Box>
  );
};
