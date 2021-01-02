import { Reducer } from 'react';

interface LoaderAction {
  type: 'START' | 'STOP';
  name: string;
}

interface LoaderReducerInterface {
  loading: boolean;
  instances: { [key: string]: number };
}

const LoaderReducer: Reducer<LoaderReducerInterface, LoaderAction> = (prevState, action) => {
  const instances = prevState.instances;
  const name = action.name;

  switch (action.type) {
    case 'START':
      return {
        loading: true,
        instances: {
          ...instances,
          ...{[name]: (instances[name] || 0) + 1},
        },
      };

    case 'STOP':
      const value = instances[name];
      const newMap = {...instances};

      if (value > 1) {
        newMap[name] = value - 1;
      } else {
        delete newMap[name];
      }
      return {
        loading: !!newMap.size,
        instances: newMap,
      };
    default:
      throw new Error('Should not reach this!');
  }
};

export default LoaderReducer;
