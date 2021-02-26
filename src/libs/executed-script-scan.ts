import {
  ScanErrorTypes,
  ExecutedScriptScanResponseAction,
  RawScannedUser,
} from './events/executed-script.types';

export const fetchUserFriendsBirthdayInfoFromContext = (): string => {
  const responseId = Math.random().toString();
  sendScanLog('SCAN_LOG_EXTRACT_TOKEN');
  /**
   * Make request to facebook.com in order to receive html with vital information such as
   * token
   */
  getFacebookPage()
    .then(extractFacebookToken)
    // Fetch user friends birthday data
    .then(fetchFriendsBirthdayInfo)
    .then(extractBirthdays)
    .then((result) => executedScriptUserContextResponse(result))
    .catch(error => executedScriptUserContextError(error.messageName, error.modal));

  /**
   * Send message with Scan log update
   *
   * @param messageName - message name to be used for i18n internalisation
   * @param substitutions - optional substitutions for messageName
   */
  function sendScanLog(messageName: string, substitutions?: Array<string>) {
    chrome.runtime.sendMessage({
      type: 'SEND_SCAN_LOG',
      payload: {messageName, substitutions},
    });
  }

  /**
   * Send message with an error, background and popup script will listen for `EXECUTED_SCRIPT_RESPONSE` event type
   *
   * @param messageName - error description to be used with i18n
   * @param error - anything else describes the error
   */
  function executedScriptUserContextError(messageName: ScanErrorTypes, error?: any) {
    const message: ExecutedScriptScanResponseAction = {
      type: 'EXECUTED_SCRIPT_RESPONSE',
      responseId,
      payload: {
        type: messageName ?? 'SCAN_ERROR_GENERAL',
        error,
      },
    };
    chrome.runtime.sendMessage(message);
  }

  /**
   * Fake ExecutedScriptContextResponse since the function is not accessible from here
   *
   * @param users - Array of extracted user birthdays
   */
  function executedScriptUserContextResponse(users: Array<RawScannedUser>) {
    const message: ExecutedScriptScanResponseAction = {
      type: 'EXECUTED_SCRIPT_RESPONSE',
      responseId,
      payload: {
        type: 'SCAN_SUCCESS',
        users,
      },
    };
    chrome.runtime.sendMessage(message);
  }

  /**
   * Parse provided html page and extract token
   * token will be found on the page inside json like construction "token":"TOKEN_VALUE"
   *
   * @param page - fetched facebook page
   */
  function extractTokenFromPage(page: string): string {
    const pattern = new RegExp('.*"token":"(.*?)"', 'm');
    const result = pattern.exec(page);
    return result && result[1];
  }

  /**
   * Fetch https://www.facebook.com page and handle related errors
   */
  async function getFacebookPage(): Promise<string> {
    let response: Response;
    try {
      sendScanLog('SCAN_LOG_PAGE_REQUEST');
      /**
       * Make request to facebook.com in order to receive html with vital information such as
       * token
       */
      response = await fetch('https://www.facebook.com', {headers: {accept: 'text/html'}});
    } catch (error) {
      sendScanLog('SCAN_LOG_PAGE_REQUEST_ERROR', [error]);
      return Promise.reject({messageName: 'SCAN_ERROR_FACEBOOK_PAGE_REQUEST', error});
    }

    try {
      sendScanLog('SCAN_LOG_PAGE_CONTENT');
      return await response.text();
    } catch (error) {
      sendScanLog('SCAN_LOG_PAGE_CONTENT_ERROR', [error]);
      return Promise.reject({messageName: 'SCAN_ERROR_FACEBOOK_PAGE_CONTENT', error});
    }
  }

  /**
   * Make graphQL request and page and handle response errors
   *
   * @param token - token to use with facebook requests
   */
  async function fetchFriendsBirthdayInfo(token: string) {
    let response: Response;
    try {
      /**
       * Make request to facebook.com in order to receive html with vital information such as
       * token
       */
      sendScanLog('SCAN_LOG_BIRTHDAYS_REQUEST');
      response = await fetch('https://www.facebook.com/api/graphql/', {
        'headers': {
          'content-type': 'application/x-www-form-urlencoded',
        },
        'body': '&__a=1'
          + '&fb_dtsg=' + encodeURIComponent(token)
          + '&fb_api_caller_class=RelayModern'
          + '&fb_api_req_friendly_name=BirthdayCometMonthlyBirthdaysRefetchQuery'
          + '&variables=' + encodeURIComponent(JSON.stringify({'count': 12}))
          + '&server_timestamps=true'
          + '&doc_id=3681233908586032',
        'method': 'POST',
      });
    } catch (error) {
      sendScanLog('SCAN_LOG_BIRTHDAYS_REQUEST_ERROR', [error]);
      return Promise.reject({messageName: 'SCAN_ERROR_FACEBOOK_BIRTHDAYS_REQUEST', error});
    }

    try {
      sendScanLog('SCAN_LOG_BIRTHDAYS_CONTENT');
      return await response.json();
    } catch (error) {
      sendScanLog('SCAN_LOG_BIRTHDAYS_CONTENT_ERROR', [error]);
      return Promise.reject({messageName: 'SCAN_ERROR_FACEBOOK_BIRTHDAYS_CONTENT', error});
    }
  }

  /**
   * Extract facebook token from fetched facebook page, handle errors
   *
   * @param page - page content
   */
  async function extractFacebookToken(page: string) {
    const token = extractTokenFromPage(page);
    // No token found, report an error, quit
    if ('string' !== typeof token) {
      sendScanLog('SCAN_LOG_EXTRACT_TOKEN_ERROR');
      return Promise.reject({messageName: 'SCAN_ERROR_NO_TOKEN_DETECTED'});
    }
    return token;
  }

  /**
   * Extract user birthdays info from previously fetched data
   *
   * @param response - previously fetched json with user birthday data
   */
  async function extractBirthdays(response: any) {
    sendScanLog('SCAN_LOG_EXTRACT_BIRTHDAYS');
    try {
      return response.data.viewer.all_friends_by_birthday_month.edges
        .map(({node}: any) => node.friends.edges)
        .flat()
        .map(({node}: any) => ({
          name: node.name,
          birthdate: node.birthdate,
          id: node.id,
        }));
    } catch (error) {
      sendScanLog('SCAN_LOG_EXTRACT_BIRTHDAYS_ERROR', [error]);
      return Promise.reject({messageName: 'SCAN_ERROR_BIRTHDAYS_EXTRACT', error});
    }
  }

  return responseId;
};
