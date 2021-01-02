import React, {
  FunctionComponent,
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
  isLoading: (instanceName: string) => false,
  startLoading: (instanceName: string = uuidv4()) => instanceName,
  stopLoading: (instanceName: string) => {
  },
});

const LoadingContextProvider: FunctionComponent = (props) => {
  const [loader, dispatch] = useReducer(LoaderReducer, {
    loading: true,
    instances: {'SETTINGS': 1},
  });

  const isLoading = (instanceName?: string) => {
    if (undefined === typeof instanceName) {
      return loader.loading;
    }
    return !!loader.instances[instanceName];
  };

  const startLoading = (instanceName: string = uuidv4()) => {
    dispatch({type: 'START', name: instanceName});
    console.log('STARTING', instanceName);
    return instanceName;
  };

  const stopLoading = (instanceName: string) => {
    console.log('STOPPING', instanceName);
    dispatch({type: 'STOP', name: instanceName});
  };
  return (
    <LoadingContext.Provider value={{
      loading: loader.loading,
      isLoading,
      startLoading,
      stopLoading,
    }}>
      {props.children}
    </LoadingContext.Provider>
  );
};

export default LoadingContextProvider;
