import { Location } from 'history';
import React, { FunctionComponent } from 'react';
import { ScanErrorPayload } from '../libs/events/executed-script.types';
import { useCurrentStatus } from '../libs/hooks/current-status.hook';
import {
  RestoredBirthday,
  WizardsSettings,
} from '../libs/storage/storaged.types';

interface CurrentStatusContextInterface {
  initDone: boolean;
  location: Location;
  modal: ScanErrorPayload;
  isActive: boolean;
  isScanning: boolean;
  isScanSucceed: boolean;
  users: Array<RestoredBirthday>;
  wizardsSettings: WizardsSettings;
}

export const CurrentStatusContext = React.createContext<CurrentStatusContextInterface>({
  initDone: false,
  location: null,
  modal: null,
  isActive: false,
  isScanning: false,
  isScanSucceed: true,
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
