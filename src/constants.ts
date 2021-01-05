import { translateString } from './filters/translate';

export enum ACTION {
  ERROR,
  GENERATION_START,
  BADGE_NOTIFICATIONS_DISABLE,
  BADGE_NOTIFICATIONS_ENABLE,
  BADGE_UPDATE,
  BADGE_CLICKED,
  LOG,
  ALARM_NEW_DAY,
  GET_FACEBOOK_SETTINGS
}

export type ApplicationStatus =
  'FACEBOOK_REQUIRED'
  | 'NOT_SUPPORTED_LANGUAGE'
  | 'DONE'
  | 'USER_SETTINGS'
  | 'NO_TOKEN_DETECTED';

export type StorageKeysType = typeof STORAGE_KEYS;
export type StorageKeyNames = keyof typeof STORAGE_KEYS;
export type StorageKeyValues = typeof STORAGE_KEYS[StorageKeyNames];

export const STORAGE_KEYS = {
  BIRTHDAYS: 'BIRTHDAYS_FOR_BADGE',
  BADGE_VISITED: 'BADGE_VISITED',
  BADGE_ACTIVE: 'BADGE_ACTIVE', // Set true when user wants to see notifications
  LAST_ACTIVE_TAB: 'LAST_ACTIVE_TAB',
  LAST_SELECTED_ACTION: 'LAST_SELECTED_ACTION',
  WIZARDS: 'WIZARDS',
} as const;

export enum TABS {
  TODAY_BIRTHDAYS = 'TODAY_BIRTHDAYS',
  CALENDAR_GENERATOR = 'CALENDAR_GENERATOR',
  DEBUG_TOOLS = 'DEBUG_TOOLS'
}

export enum ACTIONS_SET {
  ENABLE_BADGE = 'ENABLE_BADGE',
  DISABLE_BADGE = 'DISABLE_BADGE',
  SELECT_FILE_FORMAT_ICS = 'SELECT_FILE_FORMAT_ICS',
  SELECT_FILE_FORMAT_DELETE_ICS = 'SELECT_FILE_FORMAT_DELETE_ICS',
  SELECT_FILE_FORMAT_CSV = 'SELECT_FILE_FORMAT_CSV',
  SELECT_FILE_FORMAT_JSON = 'SELECT_FILE_FORMAT_JSON'
}

export const ACTIONS_DESC: Array<{
  value: string;
  text: string;
  description: string;
}> = [
  {
    value: ACTIONS_SET.ENABLE_BADGE,
    text: translateString(ACTIONS_SET.ENABLE_BADGE),
    description: '',
  },
  {
    value: ACTIONS_SET.SELECT_FILE_FORMAT_ICS,
    text: translateString(ACTIONS_SET.SELECT_FILE_FORMAT_ICS),
    description: 'SELECT_ICS_DESCRIPTION',
  },
  {
    value: ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS,
    text: translateString(ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS),
    description: 'SELECT_DELETE_ICS_DESCRIPTION',
  },
  {
    value: ACTIONS_SET.SELECT_FILE_FORMAT_CSV,
    text: translateString(ACTIONS_SET.SELECT_FILE_FORMAT_CSV),
    description: 'FILE_FORMAT_CSV_DESCRIPTION',
  },
];
