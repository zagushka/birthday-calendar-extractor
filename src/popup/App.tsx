import React, {
  FunctionComponent,
  useEffect,
} from 'react';
import UserSettings from '../components/user-settings/user-settings';
import CurrentStatusContextProvider from '../context/current-status.context';
import LoadingContextProvider from '../context/loading.context';
import { badgeClickedAction } from '../libs/events/actions';
import { sendMessage } from '../libs/events/events';
import { storeUserSettings } from '../libs/storage/chrome.storage';
import './App.scss';

const App: FunctionComponent = () => {

  useEffect(() => {
    // Send notification badge was clicked
    sendMessage(badgeClickedAction(), true);

    // Clean up
    return () => {
      // Remove opened modal
      storeUserSettings({modal: null});
    };
  }, []);

  return (
    <LoadingContextProvider>
      <CurrentStatusContextProvider>
        <UserSettings/>
      </CurrentStatusContextProvider>
    </LoadingContextProvider>
  );
};

export default App;
