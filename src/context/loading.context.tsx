import React, {
  FunctionComponent,
  useMemo,
  useReducer,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import LoaderReducer from '../reducers/loader.reducer';

interface LoadingContextInterface {
  loading: boolean;
  isLoading: (instanceName: string) => boolean;
  startLoading: (instanceName?: string) => string;
  stopLoading: (instanceName: string) => void;
}

export const LoadingContext = React.createContext<LoadingContextInterface>({
  loading: false,
  isLoading: () => false,
  startLoading: (instanceName: string = uuidv4()) => instanceName,
  stopLoading: () => {},
});

/**
 * @TODO add desctription
 *
 * Context provider for loading states.
 * I can create multiple instances of loading states.
 * Loader reducer is used to manage loading states.
 *
 * @param props
 * @constructor
 */
const LoadingContextProvider: FunctionComponent = (props) => {
  const [loader, dispatch] = useReducer(LoaderReducer, {
    loading: true,
    instances: {},
  });

  /**
   * Check the loading state of the instance.
   * @param instanceName
   */
  const isLoading = (instanceName?: string) => {
    if (typeof instanceName === 'undefined') {
      return loader.loading;
    }
    return !!loader.instances[instanceName];
  };

  /**
   * Use this method to start a new loading instance or create a new instance if it doesn't exist yet.
   * @param instanceName
   */
  const startLoading = (instanceName: string = uuidv4()) => {
    dispatch({ type: 'START', name: instanceName });
    console.log('STARTING', instanceName);
    return instanceName;
  };

  /**
   * Use this method to stop a loading instance.
   * @param instanceName
   */
  const stopLoading = (instanceName: string) => {
    console.log('STOPPING', instanceName);
    dispatch({ type: 'STOP', name: instanceName });
  };

  const providerValues = useMemo(() => ({
    loading: loader.loading,
    isLoading,
    startLoading,
    stopLoading,
  }), [loader.loading]);

  return (
    <LoadingContext.Provider value={providerValues}>
      {props.children}
    </LoadingContext.Provider>
  );
};

export default LoadingContextProvider;
