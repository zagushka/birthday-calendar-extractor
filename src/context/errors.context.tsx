import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ACTION } from '../constants';
import { ErrorAction } from '../libs/events/actions';
import { listenTo } from '../libs/events/events';

interface ErrorsContextInterface {
  error: string; // error regarding token or not supported language
  resetError: () => void // reset error message
}

export const ErrorsContext = React.createContext<ErrorsContextInterface>({
  error: null,
  resetError: () => {
  },
});

const ErrorsContextProvider: FunctionComponent = (props) => {
  const [error, setError] = useState<string>(null);

  const resetError = () => {
    setError(null);
  };

  useEffect(() => {
    const onDestroy$: Subject<boolean> = new Subject();

    // Listen to Status Updates and update errors accordingly
    listenTo<ErrorAction>(ACTION.ERROR)
      .pipe(
        takeUntil(onDestroy$),
      )
      .subscribe(({action}) => setError(action.status));

    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, []);

  return <ErrorsContext.Provider value={{
    error,
    resetError,
  }}>
    {props.children}
  </ErrorsContext.Provider>;
};

export default ErrorsContextProvider;
