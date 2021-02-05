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
import { SEND_SCAN_LOG } from '../libs/events/types';

export const ScanLog: FunctionComponent = () => {
  const [log, setLog] = useState<Array<string>>([]);

  useEffect(() => {
    console.log('INIT IT');
    const onDestroy$ = new Subject<boolean>();
    // Start listening to scan logs
    listenTo(SEND_SCAN_LOG)
      .pipe(takeUntil(onDestroy$))
      .subscribe(({action}) => {
        console.log('SCANNED', action);
        if (SEND_SCAN_LOG === action.type) {
          setLog(currentLog => update(currentLog, {$push: [action.payload.log]}));
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
          {log.map((row, index) => <li key={index}>{row}</li>)}
        </ul>
      </Box>
    </Box>
  );
};
