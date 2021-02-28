import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  concat,
  Subject,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  listenToUserSettings,
  retrieveUserSettings,
  Settings,
  storeUserSettings,
} from '../libs/storage/chrome.storage';
import { LoadingContext } from './loading.context';

export type CsvDateFormats = 'LL/dd/yyyy' | 'dd/LL/yyyy';

export interface CsvSettings {
  format: CsvDateFormats;
}

export interface IcsSettings {
  groupEvents: boolean;
}

export interface WizardsSettings {
  csv: CsvSettings;
  ics: IcsSettings;
}

interface SettingsContextInterface {
  wizards: WizardsSettings;
  setWizards: (settings: WizardsSettings) => void;
}

export const SettingsContext = React.createContext<SettingsContextInterface>({
  wizards: {
    csv: {format: 'dd/LL/yyyy'},
    ics: {groupEvents: false},
  },
  setWizards: (wizards: WizardsSettings) => {
  },
});

const SettingsContextProvider: FunctionComponent = (props) => {
  const {startLoading, stopLoading} = useContext(LoadingContext);
  const [stateWizards, setStateWizards] = useState<WizardsSettings>();

  // Load initial state here
  useEffect(() => {
    const onDestroy$ = new Subject();
    // Init new loading process flag, since all the app is not waiting for this
    // I have moved 'SETTINGS' loader indicator to LoadingContextProvider default value
    // const loadingInstanceName = startLoading('SETTINGS');
    concat(
      retrieveUserSettings(['wizardSettings']), // Get initial settings
      listenToUserSettings().pipe(takeUntil(onDestroy$)), // Listen to UserSettings changes
    )
      .subscribe((updates) => {
        (Object.keys(updates) as Array<keyof Settings>)
          .forEach((key) => {
            switch (key) {
              case 'wizardSettings':
                return setStateWizards(updates[key]);
            }
          });
        // Remove loading flag
        stopLoading('SETTINGS');
      });

    return () => {
      onDestroy$.next(true);
      onDestroy$.complete();
    };
  }, []);

  const storeWizards = (wizards: WizardsSettings) => {
    storeUserSettings({wizardSettings: wizards});
  };

  return <SettingsContext.Provider value={{
    wizards: stateWizards,
    setWizards: storeWizards,
  }}>
    {props.children}
  </SettingsContext.Provider>;
};

export default SettingsContextProvider;
