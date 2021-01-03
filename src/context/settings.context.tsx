import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  ACTIONS_SET,
  STORAGE_KEYS,
  TABS,
} from '../constants';
import {
  DEFAULT_SETTINGS,
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
  tab: TABS;
  setTab: (tab: TABS) => void;
  action: ACTIONS_SET;
  setAction: (action: ACTIONS_SET) => void;
  wizards: WizardsSettings;
  setWizards: (settings: WizardsSettings) => void;
}

export const SettingsContext = React.createContext<SettingsContextInterface>({
  tab: TABS.CALENDAR_GENERATOR,
  setTab: () => {
  },
  action: ACTIONS_SET.SELECT_FILE_FORMAT_CSV,
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

  const [stateAction, setStateAction] = useState<ACTIONS_SET>();
  const [stateTab, setStateTab] = useState<TABS>();
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

        // Check correct data was stored
        const fetchedAction = ACTIONS_SET[storedAction]
          ? storedAction
          : DEFAULT_SETTINGS[STORAGE_KEYS.LAST_SELECTED_ACTION];

        const fetchedTab = TABS[storedTab]
          ? storedTab
          : DEFAULT_SETTINGS[STORAGE_KEYS.LAST_ACTIVE_TAB];

        setStateAction(fetchedAction);
        setStateTab(fetchedTab);
        setStateWizards(storedWizards);

        // Remove loading flag
        stopLoading('SETTINGS');
      });
  }, []);

  const storeAction = (action: ACTIONS_SET) => {
    storeUserSettings({[STORAGE_KEYS.LAST_SELECTED_ACTION]: action})
      .subscribe(() => setStateAction(action));
  };

  const storeTab = (tab: TABS) => {
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
