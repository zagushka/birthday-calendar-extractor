import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  TABS,
  WIZARD_NAMES,
} from '../constants';
import {
  retrieveUserSettings,
  storeUserSettings,
} from '../libs/storage/chrome.storage';
import { LoadingContext } from './loading.context';

export type CsvDateFormats = 'LL/dd/yyyy' | 'dd/LL/yyyy';

export interface CsvSettings {
  format: CsvDateFormats;
}

export interface IcsSettings {
  allDayEvent: boolean;
  groupEvents: boolean;
}

export interface WizardsSettings {
  csv: CsvSettings;
  ics: IcsSettings;
}

interface SettingsContextInterface {
  tab: keyof typeof TABS;
  setTab: (tab: keyof typeof TABS) => void;
  action: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES];
  setAction: (action: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES]) => void;
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
    csv: {format: 'dd/LL/yyyy'},
    ics: {allDayEvent: false, groupEvents: false},
  },
  setWizards: (wizards: WizardsSettings) => {
  },
});

const SettingsContextProvider: FunctionComponent = (props) => {
  const {startLoading, stopLoading} = useContext(LoadingContext);

  const [stateAction, setStateAction] = useState<typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES]>();
  const [stateTab, setStateTab] = useState<keyof typeof TABS>();
  const [stateWizards, setStateWizards] = useState<WizardsSettings>();

  // Load initial state here
  useEffect(() => {
    // Init new loading process flag, since all the app is not waiting for this
    // I have moved 'SETTINGS' loader indicator to LoadingContextProvider default value
    // const loadingInstanceName = startLoading('SETTINGS');
    // Request initial action and tab states
    retrieveUserSettings([
      'lastActiveTab',
      'lastSelectedWizard',
      'wizardSettings',
    ])
      .subscribe(({
                    lastActiveTab: storedTab,
                    wizardSettings: storedWizards,
                    lastSelectedWizard: storedAction,
                  }) => {
        setStateAction(storedAction);
        setStateTab(storedTab);
        setStateWizards(storedWizards);

        // Remove loading flag
        stopLoading('SETTINGS');
      });
  }, []);

  const storeAction = (action: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES]) => {
    storeUserSettings({lastSelectedWizard: action})
      .subscribe(() => setStateAction(action));
  };

  const storeTab = (tab: keyof typeof TABS) => {
    storeUserSettings({lastActiveTab: tab})
      .subscribe(() => setStateTab(tab));
  };

  const storeWizards = (wizards: WizardsSettings) => {
    storeUserSettings({wizardSettings: wizards})
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
