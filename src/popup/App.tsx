import React, {
  FunctionComponent,
  useContext,
  useEffect,
} from 'react';
import ChangeLanguageModal from '../components/modals/change-language.modal';
import DoneModal from '../components/modals/done.modal';
import NoTokenDetectedModal from '../components/modals/no-token-detected.modal';
import UserSettings from '../components/user-settings/user-settings';
import ErrorsContextProvider, { ErrorsContext } from '../context/errors.context';
import LoadingContextProvider from '../context/loading.context';
import SettingsContextProvider from '../context/settings.context';
import { badgeClickedAction } from '../libs/events/actions';
import { sendMessage } from '../libs/events/events';
import './App.scss';

const App: FunctionComponent = () => {
  const {error, resetError} = useContext(ErrorsContext);

  useEffect(() => {
    // Send notification badge was clicked
    sendMessage(badgeClickedAction(), true);
  }, []);

  const content = (() => {
    switch (error) {
      case 'DONE':
        return <DoneModal onHide={() => resetError()}/>;
      case 'NOT_SUPPORTED_LANGUAGE':
        return <ChangeLanguageModal onHide={() => resetError()}/>;
      case 'NO_TOKEN_DETECTED':
        return <NoTokenDetectedModal onHide={() => resetError()}/>;
      default:
        return <UserSettings/>;
    }
  })();

  return (
    <LoadingContextProvider>
      <SettingsContextProvider>
        <ErrorsContextProvider>
          {content}
        </ErrorsContextProvider>
      </SettingsContextProvider>
    </LoadingContextProvider>
  );
};

export default App;
