import { Location } from 'history';
import React, { FunctionComponent } from 'react';
import { ShowModalAction } from '../libs/events/types';
import { useCurrentStatus } from '../libs/hooks/current-status.hook';
import {
  StoredBirthday,
  WizardsSettings,
} from '../libs/storage/storaged.types';

interface CurrentStatusContextInterface {
  initDone: boolean;
  location: Location;
  modal: ShowModalAction;
  isActive: boolean;
  isScanning: boolean;
  isScanSucceed: boolean;
  isDonated: boolean;
  users: Array<StoredBirthday>;
  wizardsSettings: WizardsSettings;
}

export const CurrentStatusContext = React.createContext<CurrentStatusContextInterface>({
  initDone: false,
  location: null,
  modal: null,
  isActive: false,
  isScanning: false,
  isScanSucceed: true,
  isDonated: false,
  users: [],
  wizardsSettings: {csv: {format: 'dd/LL/yyyy'}, ics: {groupEvents: false}},
});

const CurrentStatusContextProvider: FunctionComponent = (props) => {

  const statusVariables = useCurrentStatus();

  return <CurrentStatusContext.Provider value={statusVariables}>
    {props.children}
  </CurrentStatusContext.Provider>;
};

export default CurrentStatusContextProvider;
