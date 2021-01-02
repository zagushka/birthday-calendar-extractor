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

interface SettingsContextInterface {
  tab: TABS;
  setTab: (tab: TABS) => void;
  action: ACTIONS_SET;
  setAction: (action: ACTIONS_SET) => void;
}

export const SettingsContext = React.createContext<SettingsContextInterface>({
  tab: TABS.CALENDAR_GENERATOR,
  setTab: () => {
  },
  action: ACTIONS_SET.SELECT_FILE_FORMAT_CSV,
  setAction: () => {
  },
});

const SettingsContextProvider: FunctionComponent = (props) => {
  const {startLoading, stopLoading} = useContext(LoadingContext);

  const [action, setAction] = useState<ACTIONS_SET>();
  const [tab, setTab] = useState<TABS>();

  // Load initial state here
  useEffect(() => {
    // Init new loading process flag, since all the app is not waiting for this
    // I have moved 'SETTINGS' loader indicator to LoadingContextProvider default value
    // const loadingInstanceName = startLoading('SETTINGS');
    // Request initial action and tab states
    retrieveUserSettings([STORAGE_KEYS.LAST_ACTIVE_TAB, STORAGE_KEYS.LAST_SELECTED_ACTION])
      .subscribe((storedSettings) => {
        const storedAction = storedSettings[STORAGE_KEYS.LAST_SELECTED_ACTION];
        const storedTab = storedSettings[STORAGE_KEYS.LAST_ACTIVE_TAB];

        // Check correct data was stored
        const fetchedAction = ACTIONS_SET[storedAction]
          ? storedAction
          : DEFAULT_SETTINGS[STORAGE_KEYS.LAST_SELECTED_ACTION];

        const fetchedTab = TABS[storedTab]
          ? storedTab
          : DEFAULT_SETTINGS[STORAGE_KEYS.LAST_ACTIVE_TAB];

        setAction(fetchedAction);
        setTab(fetchedTab);

        // Remove loading flag
        stopLoading('SETTINGS');
      });
  }, []);

  const storeAction = (actionToStore: ACTIONS_SET) => {
    storeUserSettings({[STORAGE_KEYS.LAST_SELECTED_ACTION]: actionToStore})
      .subscribe(() => setAction(actionToStore));
  };

  const storeTab = (tabToStore: TABS) => {
    storeUserSettings({[STORAGE_KEYS.LAST_ACTIVE_TAB]: tabToStore})
      .subscribe(() => setTab(tabToStore));
  };

  return <SettingsContext.Provider value={{
    tab,
    setTab: storeTab,
    action,
    setAction: storeAction,
  }}>
    {props.children}
  </SettingsContext.Provider>;
};

export default SettingsContextProvider;
