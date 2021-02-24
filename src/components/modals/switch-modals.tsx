import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TodayUsersContext } from '../../context/today-users.context';
import {
  SCAN_ERROR_BIRTHDAYS_EXTRACT,
  SCAN_ERROR_GENERAL,
  SCAN_ERROR_FACEBOOK_BIRTHDAYS_CONTENT,
  SCAN_ERROR_FACEBOOK_BIRTHDAYS_REQUEST,
  SCAN_ERROR_FACEBOOK_PAGE_CONTENT,
  SCAN_ERROR_FACEBOOK_PAGE_REQUEST,
  SCAN_ERROR_FACEBOOK_REQUIRED,
  SCAN_ERROR_NO_TOKEN_DETECTED,
  SCAN_ERROR_TIMEOUT,
} from '../../libs/events/executed-script.types';
import DefaultErrorModal from './default-error.modal';
import FacebookRequiredModal from './facebook-required.modal';
import NoTokenDetectedModal from './no-token-detected.modal';

const SwitchModals: FunctionComponent = (props) => {

  const {modal} = useContext(TodayUsersContext);
  const [modalDialog, setModalDialog] = useState<JSX.Element>(null);

  useEffect(() => {
    if (!modal) {
      return setModalDialog(null);
    }

    switch (modal.type) {
      case SCAN_ERROR_FACEBOOK_REQUIRED:
        return setModalDialog(<FacebookRequiredModal/>);

      case SCAN_ERROR_FACEBOOK_PAGE_REQUEST:
      case SCAN_ERROR_FACEBOOK_PAGE_CONTENT:
      case SCAN_ERROR_NO_TOKEN_DETECTED:
        return setModalDialog(<NoTokenDetectedModal/>);

      case SCAN_ERROR_FACEBOOK_BIRTHDAYS_REQUEST:
      case SCAN_ERROR_FACEBOOK_BIRTHDAYS_CONTENT:
      case SCAN_ERROR_BIRTHDAYS_EXTRACT:
        return setModalDialog(<NoTokenDetectedModal/>);
      // case 'DONE':
      //   return setModalDialog(<DoneModal/>);
      // case 'SCAN_SUCCESS':
      //   return setModalDialog(<ScanSuccessModal/>);

      case SCAN_ERROR_TIMEOUT:
      case SCAN_ERROR_GENERAL:
      default:
        setModalDialog(<DefaultErrorModal data={modal}/>);
    }
  }, [modal]);

  return (
    <>
      {modalDialog}
    </>
  );
};

export default SwitchModals;