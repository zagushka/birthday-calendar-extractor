// ACTIONS
import {
  CsvSettings,
  IcsSettings,
} from '../../context/settings.context';

export const SEND_ERROR = 'SEND_ERROR'; // Send error message
export const SEND_GENERATION_STATUS = 'SEND_GENERATION_STATUS'; // Send result of generation process

export const ENABLE_BADGE_NOTIFICATION = 'ENABLE_BADGE_NOTIFICATION'; // Enable birthdays in badge notifications
export const DISABLE_BADGE_NOTIFICATION = 'DISABLE_BADGE_NOTIFICATION'; // Disable birthdays in badge notifications

export const UPDATE_BADGE = 'UPDATE_BADGE'; // Update badge status

export const CREATE_CALENDAR_ICS = 'CREATE_CALENDAR_ICS';
export const CREATE_CALENDAR_DELETE_ICS = 'CREATE_CALENDAR_DELETE_ICS';
export const CREATE_CALENDAR_CSV = 'CREATE_CALENDAR_CSV';
export const CREATE_CALENDAR_JSON = 'CREATE_CALENDAR_JSON';

export const BIRTHDAYS_START_EXTRACTION = 'BIRTHDAYS_START_EXTRACTION';
export const BIRTHDAYS_EXTRACTION_COMPLETE = 'BIRTHDAYS_EXTRACTION_COMPLETE';

export const GET_FACEBOOK_SETTINGS = 'GET_FACEBOOK_SETTINGS';

export const SEND_LOG = 'SEND_LOG';

// NOTIFICATIONS
export const BADGE_CLICKED = 'BADGE_CLICKED';
export const ALARM_NEW_DAY = 'ALARM_NEW_DAY';

interface SendErrorAction {
  type: typeof SEND_ERROR;
  payload: { error: string };
}

interface SendGenerationStatusAction {
  type: typeof SEND_GENERATION_STATUS;
  payload: { status: string };
}

export type NotificationActionTypes = SendErrorAction | SendGenerationStatusAction;

interface EnableBadgeNotificationAction {
  type: typeof ENABLE_BADGE_NOTIFICATION;
}

interface DisableBadgeNotificationAction {
  type: typeof DISABLE_BADGE_NOTIFICATION;
}

export type BadgeNotificationActionTypes = EnableBadgeNotificationAction | DisableBadgeNotificationAction;

interface UpdateBadgeAction {
  type: typeof UPDATE_BADGE;
}

export type BadgeActionTypes = UpdateBadgeAction;

interface BirthdaysStartExtractionAction {
  type: typeof BIRTHDAYS_START_EXTRACTION;
}

interface BirthdaysExtractionCompleteAction {
  type: typeof BIRTHDAYS_EXTRACTION_COMPLETE;
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

export type ActionTypes =
  NotificationActionTypes
  | BadgeNotificationActionTypes
  | BadgeActionTypes
  | CreateCalendarActionTypes
  | AlarmTypes;

export type ApplicationStatus =
  'FACEBOOK_REQUIRED'
  | 'NOT_SUPPORTED_LANGUAGE'
  | 'DONE'
  | 'USER_SETTINGS'
  | 'NO_TOKEN_DETECTED';

