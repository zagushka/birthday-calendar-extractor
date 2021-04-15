export const EXECUTED_SCRIPT_RESPONSE = 'EXECUTED_SCRIPT_RESPONSE';

export interface RawScannedUser {
  birthdate: {
    day: number;
    month: number;
    year: number;
  };
  name: string;
  id: string;
}

export type CalendarTypes = 'CSV' | 'ICS' | 'DELETE-ICS';


export interface ExportDoneResponse {
  type: typeof RESPONSE_EXPORT_DONE;
  calendar: CalendarTypes; // Created calendar format type
}

export interface ScanErrorPayload {
  type: ScanErrorTypes;
  error?: any;
}

export interface ScanSuccessPayload {
  type: typeof SCAN_SUCCESS;
  users: Array<RawScannedUser>; // Scanned users array
}


export interface ExecutedScriptScanResponseAction {
  type: typeof EXECUTED_SCRIPT_RESPONSE;
  responseId: string;
  payload: ScanErrorPayload | ScanSuccessPayload;
}

export type ExecutedScriptTypes = ExecutedScriptScanResponseAction;

/**
 * Scan process use few types of responses
 * each can be error or success notification
 */

// Thrown when user is not on the facebook page
export const SCAN_ERROR_FACEBOOK_REQUIRED = 'SCAN_ERROR_FACEBOOK_REQUIRED';
// Was unable to make a request and fetch www.facebook.com page
export const SCAN_ERROR_FACEBOOK_PAGE_REQUEST = 'SCAN_ERROR_FACEBOOK_PAGE_REQUEST';
// Was unable to get content of fetch www.facebook.com page
export const SCAN_ERROR_FACEBOOK_PAGE_CONTENT = 'SCAN_ERROR_FACEBOOK_PAGE_CONTENT';
// Was unable to extract facebook token
export const SCAN_ERROR_NO_TOKEN_DETECTED = 'SCAN_ERROR_NO_TOKEN_DETECTED';
// Was unable to extract facebook async token
export const SCAN_ERROR_NO_ASYNC_TOKEN_DETECTED = 'SCAN_ERROR_NO_ASYNC_TOKEN_DETECTED';
// Unable to make fetch birthdays request
export const SCAN_ERROR_FACEBOOK_BIRTHDAYS_REQUEST = 'SCAN_ERROR_FACEBOOK_BIRTHDAYS_REQUEST';
// Unable to get content of the birthdays request
export const SCAN_ERROR_FACEBOOK_BIRTHDAYS_CONTENT = 'SCAN_ERROR_FACEBOOK_BIRTHDAYS_CONTENT';
// Unable to make fetch friends list request
export const SCAN_ERROR_FRIENDS_LIST_REQUEST = 'SCAN_ERROR_FRIENDS_LIST_REQUEST';
// Failed to extract friends list from fetched data
export const SCAN_ERROR_FRIENDS_LIST_CONTENT = 'SCAN_ERROR_FRIENDS_LIST_CONTENT';
// Failed to extract birthdays from fetched birthdays page
export const SCAN_ERROR_BIRTHDAYS_EXTRACT = 'SCAN_ERROR_BIRTHDAYS_EXTRACT';
// Any other error related to scan
export const SCAN_ERROR_GENERAL = 'SCAN_ERROR_GENERAL';
// Scan script timeout error
export const SCAN_ERROR_TIMEOUT = 'SCAN_ERROR_TIMEOUT';
// Facebook language is not supported by application
export const SCAN_ERROR_NOT_SUPPORTED_LANGUAGE = 'SCAN_ERROR_NOT_SUPPORTED_LANGUAGE';
// Scan success
export const SCAN_SUCCESS = 'SCAN_SUCCESS';

/**
 * Types of EXECUTED_SCRIPT_RESPONSE
 *
 * RESPONSE_SCAN_DONE - indicates successful scan
 * RESPONSE_EXPORT_DONE - indicates successful calendar export
 */

export const RESPONSE_EXPORT_DONE = 'RESPONSE_EXPORT_DONE';

export type ScanErrorTypes =
  typeof SCAN_ERROR_FACEBOOK_REQUIRED
  | typeof SCAN_ERROR_FACEBOOK_PAGE_REQUEST
  | typeof SCAN_ERROR_FACEBOOK_PAGE_CONTENT
  | typeof SCAN_ERROR_NO_TOKEN_DETECTED
  | typeof SCAN_ERROR_NO_ASYNC_TOKEN_DETECTED
  | typeof SCAN_ERROR_FACEBOOK_BIRTHDAYS_REQUEST
  | typeof SCAN_ERROR_FACEBOOK_BIRTHDAYS_CONTENT
  | typeof SCAN_ERROR_FRIENDS_LIST_REQUEST
  | typeof SCAN_ERROR_FRIENDS_LIST_CONTENT
  | typeof SCAN_ERROR_BIRTHDAYS_EXTRACT
  | typeof SCAN_ERROR_TIMEOUT
  | typeof SCAN_ERROR_NOT_SUPPORTED_LANGUAGE
  | typeof SCAN_ERROR_GENERAL;

