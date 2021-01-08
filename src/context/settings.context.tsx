import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  STORAGE_KEYS,
  TABS,
  WIZARD_NAMES,
} from '../constants';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../libs/storage/chrome.storage';
import { LoadingContext } from './loading.context';

export interface IcsSettings {
  allDayEvent: boolean;
  groupEvents: boolean;
}

export interface WizardsSettings {
  csv: {
    format: 'dd/mm' | 'mm/dd'
  };
  ics: IcsSettings;
}

interface SettingsContextInterface {
  tab: keyof typeof TABS;
  setTab: (tab: keyof typeof TABS) => void;
  action: keyof typeof WIZARD_NAMES;
  setAction: (action: keyof typeof WIZARD_NAMES) => void;
  wizards: WizardsSettings;
  setWizards: (settings: WizardsSettings) => void;
}

export const SettingsContext = React.createContext<SettingsContextInterface>({
  tab: TABS.CALENDAR_GENERATOR,
  setTab: () => {
  },
  action: WIZARD_NAMES.CREATE_ICS,
  setAction: () => {
  },
  wizards: {
    csv: {format: 'dd/mm'},
    ics: {allDayEvent: false, groupEvents: false},
  },
  setWizards: (wizards: WizardsSettings) => {
  },
});

const SettingsContextProvider: FunctionComponent = (props) => {
  const {startLoading, stopLoading} = useContext(LoadingContext);

  const [stateAction, setStateAction] = useState<keyof typeof WIZARD_NAMES>();
  const [stateTab, setStateTab] = useState<keyof typeof TABS>();
  const [stateWizards, setStateWizards] = useState<WizardsSettings>();

  // Load initial state here
  useEffect(() => {
    // Init new loading process flag, since all the app is not waiting for this
    // I have moved 'SETTINGS' loader indicator to LoadingContextProvider default value
    // const loadingInstanceName = startLoading('SETTINGS');
    // Request initial action and tab states
    retrieveUserSettings([
      STORAGE_KEYS.LAST_ACTIVE_TAB,
      STORAGE_KEYS.LAST_SELECTED_ACTION,
      STORAGE_KEYS.WIZARDS,
    ])
      .subscribe((storedSettings) => {
        const storedAction = storedSettings[STORAGE_KEYS.LAST_SELECTED_ACTION];
        const storedTab = storedSettings[STORAGE_KEYS.LAST_ACTIVE_TAB];
        const storedWizards = storedSettings[STORAGE_KEYS.WIZARDS];


        setStateAction(storedAction);
        setStateTab(storedTab);
        setStateWizards(storedWizards);

        // Remove loading flag
        stopLoading('SETTINGS');
      });
  }, []);

  const storeAction = (action: keyof typeof WIZARD_NAMES) => {
    storeUserSettings({[STORAGE_KEYS.LAST_SELECTED_ACTION]: action})
      .subscribe(() => setStateAction(action));
  };

  const storeTab = (tab: keyof typeof TABS) => {
    storeUserSettings({[STORAGE_KEYS.LAST_ACTIVE_TAB]: tab})
      .subscribe(() => setStateTab(tab));
  };

  const storeWizards = (wizards: WizardsSettings) => {
    storeUserSettings({[STORAGE_KEYS.WIZARDS]: wizards})
      .subscribe(() => setStateWizards(wizards));
  };

  return <SettingsContext.Provider value={{
    tab: stateTab,
    setTab: storeTab,
    action: stateAction,
    setAction: storeAction,
    wizards: stateWizards,
    setWizards: storeWizards,
  }}>
    {props.children}
  </SettingsContext.Provider>;
};

export default SettingsContextProvider;
