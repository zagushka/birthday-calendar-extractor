import React, {
  FunctionComponent,
  useEffect,
} from 'react';
import UserSettings from '../components/user-settings/user-settings';
import LoadingContextProvider from '../context/loading.context';
import SettingsContextProvider from '../context/settings.context';
import TodayUsersContextProvider from '../context/today-users.context';
import { badgeClickedAction } from '../libs/events/actions';
import { sendMessage } from '../libs/events/events';
import './App.scss';

const App: FunctionComponent = () => {

  useEffect(() => {
    // Send notification badge was clicked
    sendMessage(badgeClickedAction(), true);
  }, []);

  return (
    <LoadingContextProvider>
      <SettingsContextProvider>
        <TodayUsersContextProvider>
          <UserSettings/>
        </TodayUsersContextProvider>
      </SettingsContextProvider>
    </LoadingContextProvider>
  );
};

export default App;
