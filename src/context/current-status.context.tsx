import React, { FunctionComponent } from 'react';
import { ScanErrorPayload } from '../libs/events/executed-script.types';
import { useCurrentStatus } from '../libs/hooks/current-status.hook';
import {
  RestoredBirthday,
  WizardsSettings,
} from '../libs/storage/storaged.types';

interface CurrentStatusContextInterface {
  modal: ScanErrorPayload | null;
  isActive: boolean;
  isScanning: boolean;
  isScanSucceed: boolean;
  users: Array<RestoredBirthday>;
  wizardsSettings: WizardsSettings;
}

export const CurrentStatusContext = React.createContext<CurrentStatusContextInterface>({
  modal: null,
  isActive: false,
  isScanning: false,
  isScanSucceed: true,
  users: [],
  wizardsSettings: {csv: {format: 'dd/LL/yyyy'}, ics: {groupEvents: false}},
});

const CurrentStatusContextProvider: FunctionComponent = (props) => {

  const {
    users,
    isActive,
    isScanSucceed,
    isScanning,
    modal,
    wizardsSettings,
  } = useCurrentStatus();

  return <CurrentStatusContext.Provider value={{
    modal,
    isActive,
    isScanning,
    isScanSucceed,
    users,
    wizardsSettings,
  }}>
    {props.children}
  </CurrentStatusContext.Provider>;
};

export default CurrentStatusContextProvider;
