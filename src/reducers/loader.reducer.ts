import update from 'immutability-helper';
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
      return update(prevState, {
        loading: {$set: true},
        instances: {[name]: {$apply: (v) => (v || 0) + 1}},
      });
    case 'STOP':
      let newState: LoaderReducerInterface;

      if (instances[name] > 1) {
        newState = update(prevState, {instances: {[name]: {$apply: (v) => v - 1}}});
      } else {
        newState = update(prevState, {instances: {$unset: [name]}});
      }

      return update(newState, {
        loading: {$set: !!Object.keys(newState.instances).length},
      });

    default:
      throw new Error('Should not reach this!');
  }
};

export default LoaderReducer;
