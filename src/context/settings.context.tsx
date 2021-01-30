import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
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
  action: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES];
  setAction: (action: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES]) => void;
  wizards: WizardsSettings;
  setWizards: (settings: WizardsSettings) => void;
}

export const SettingsContext = React.createContext<SettingsContextInterface>({
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
  const [stateWizards, setStateWizards] = useState<WizardsSettings>();

  // Load initial state here
  useEffect(() => {
    // Init new loading process flag, since all the app is not waiting for this
    // I have moved 'SETTINGS' loader indicator to LoadingContextProvider default value
    // const loadingInstanceName = startLoading('SETTINGS');
    // Request initial action and tab states
    retrieveUserSettings([
      'lastSelectedWizard',
      'wizardSettings',
    ])
      .subscribe(({
                    wizardSettings: storedWizards,
                    lastSelectedWizard: storedAction,
                  }) => {
        setStateAction(storedAction);
        setStateWizards(storedWizards);

        // Remove loading flag
        stopLoading('SETTINGS');
      });
  }, []);

  const storeAction = (action: typeof WIZARD_NAMES[keyof typeof WIZARD_NAMES]) => {
    storeUserSettings({lastSelectedWizard: action})
      .subscribe(() => setStateAction(action));
  };

  const storeWizards = (wizards: WizardsSettings) => {
    storeUserSettings({wizardSettings: wizards})
      .subscribe(() => setStateWizards(wizards));
  };

  return <SettingsContext.Provider value={{
    action: stateAction,
    setAction: storeAction,
    wizards: stateWizards,
    setWizards: storeWizards,
  }}>
    {props.children}
  </SettingsContext.Provider>;
};

export default SettingsContextProvider;
