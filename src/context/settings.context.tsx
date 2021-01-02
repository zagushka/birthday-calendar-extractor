import React, {
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import {
  ACTIONS_SET,
  STORAGE_KEYS,
  TABS,
} from '../constants';
import {
  DEFAULT_USER_SETTINGS,
  retrieveUserSettings,
  storeUserSettings,
} from '../libs/storage/chrome.storage';

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

  const [action, setAction] = useState<ACTIONS_SET>();
  const [tab, setTab] = useState<TABS>();

  // Load initial state here
  useEffect(() => {
    // Request initial action and tab states
    retrieveUserSettings([STORAGE_KEYS.LAST_ACTIVE_TAB, STORAGE_KEYS.LAST_SELECTED_ACTION])
      .subscribe((storedSettings) => {
        // Check correct data was stored
        const fetchedAction = ACTIONS_SET[storedSettings[STORAGE_KEYS.LAST_SELECTED_ACTION]]
          ? storedSettings[STORAGE_KEYS.LAST_SELECTED_ACTION]
          : DEFAULT_USER_SETTINGS[STORAGE_KEYS.LAST_SELECTED_ACTION];

        const fetchedTab = TABS[storedSettings[STORAGE_KEYS.LAST_ACTIVE_TAB]]
          ? storedSettings[STORAGE_KEYS.LAST_ACTIVE_TAB]
          : DEFAULT_USER_SETTINGS[STORAGE_KEYS.LAST_ACTIVE_TAB];
        setAction(fetchedAction);
        setTab(fetchedTab);
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
