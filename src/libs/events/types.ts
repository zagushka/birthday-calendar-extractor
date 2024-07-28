// ACTIONS
import {
  CsvSettings,
  IcsSettings,
} from '../storage/storaged.types';
import {
  ExecutedScriptTypes,
  ScanErrorTypes,
} from './executed-script.types';

export const SEND_ERROR = 'SEND_ERROR'; // Send error message
export const SEND_GENERATION_STATUS = 'SEND_GENERATION_STATUS'; // Send result of generation process

export const UPDATE_BADGE = 'UPDATE_BADGE'; // Update badge status

export const CREATE_CALENDAR_ICS = 'CREATE_CALENDAR_ICS';
export const CREATE_CALENDAR_DELETE_ICS = 'CREATE_CALENDAR_DELETE_ICS';
export const CREATE_CALENDAR_CSV = 'CREATE_CALENDAR_CSV';
export const CREATE_CALENDAR_JSON = 'CREATE_CALENDAR_JSON';
export const CREATE_CSV_DATA = 'CREATE_CSV_DATA';

export type CreateCalendarTypes = typeof CREATE_CALENDAR_ICS |
  typeof CREATE_CALENDAR_DELETE_ICS |
  typeof CREATE_CALENDAR_CSV |
  typeof CREATE_CSV_DATA |
  typeof CREATE_CALENDAR_JSON;

export const BIRTHDAYS_START_SCAN = 'BIRTHDAYS_START_SCAN';
export const BIRTHDAYS_SCAN_COMPLETE = 'BIRTHDAYS_SCAN_COMPLETE';

export const GET_FACEBOOK_SETTINGS = 'GET_FACEBOOK_SETTINGS';

export const SEND_SCAN_LOG = 'SEND_SCAN_LOG';

// NOTIFICATIONS
export const BADGE_CLICKED = 'BADGE_CLICKED'; // @TODO REMOVE IT, not used anymore
export const ALARM_NEW_DAY = 'ALARM_NEW_DAY';

// MODALS
export const SHOW_MODAL_SCAN_SUCCESS = 'SHOW_MODAL_SCAN_SUCCESS';
export const SHOW_MODAL_EXPORT_SUCCESS = 'SHOW_MODAL_EXPORT_SUCCESS';

export type ShowModalTypes =
  typeof SHOW_MODAL_SCAN_SUCCESS
  | typeof SHOW_MODAL_EXPORT_SUCCESS;

export interface ShowModalAction {
  type: ScanErrorTypes | ShowModalTypes;
  error?: any;
}

interface SendErrorAction {
  type: typeof SEND_ERROR;
  payload: { error: string };
}

interface SendGenerationStatusAction {
  type: typeof SEND_GENERATION_STATUS;
  payload: { status: string };
}

export type NotificationActionTypes = SendErrorAction | SendGenerationStatusAction;

interface UpdateBadgeAction {
  type: typeof UPDATE_BADGE;
}

export type BadgeActionTypes = UpdateBadgeAction;

export interface BirthdaysStartExtractionAction {
  type: typeof BIRTHDAYS_START_SCAN;
}

interface BirthdaysExtractionCompleteAction {
  type: typeof BIRTHDAYS_SCAN_COMPLETE;
}

export type BirthdaysExtractionActionTypes = BirthdaysStartExtractionAction | BirthdaysExtractionCompleteAction;

interface CreateCalendarCsvAction {
  type: typeof CREATE_CALENDAR_CSV;
  payload: CsvSettings;
}

interface CreateCalendarIcsAction {
  type: typeof CREATE_CALENDAR_ICS;
  payload: IcsSettings;
}

interface CreateCalendarDeleteIcsAction {
  type: typeof CREATE_CALENDAR_DELETE_ICS;
  payload: IcsSettings;
}

interface CreateCalendarJsonAction {
  type: typeof CREATE_CALENDAR_JSON;
}

export type CreateCalendarActionTypes =
  CreateCalendarCsvAction
  | CreateCalendarIcsAction
  | CreateCalendarDeleteIcsAction
  | BirthdaysExtractionActionTypes
  | CreateCalendarJsonAction;

// @TODO Check this is suitable to AlarmTypes
interface BadgeClicked {
  type: typeof BADGE_CLICKED;
}

interface AlarmNewDay {
  type: typeof ALARM_NEW_DAY;
}

export type AlarmTypes = AlarmNewDay | BadgeClicked;

export interface SendScanLogAction {
  type: typeof SEND_SCAN_LOG;
  payload: {
    messageName: string;
    substitutions?: Array<string>;
  };
}

export type ActionTypes =
  NotificationActionTypes
  | BadgeActionTypes
  | CreateCalendarActionTypes
  | AlarmTypes
  | SendScanLogAction
  | ExecutedScriptTypes;
