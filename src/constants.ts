import translatePipe from './filters/translate';

export enum ACTION {
  STATUS_REPORT = 'STATUS_REPORT',
  START_GENERATION = 'START_GENERATION',
  CHECK_STATUS = 'CHECK_STATUS',
  LOG = 'LOG',
}

export type ApplicationStatus =
  'FACEBOOK_REQUIRED'
  | 'NOT_SUPPORTED_LANGUAGE'
  | 'DONE'
  | 'USER_SETTINGS'
  | 'NO_TOKEN_DETECTED';

export abstract class Action {
  abstract type: ACTION;
}

export class StartGenerationAction extends Action {
  type = ACTION.START_GENERATION;

  constructor(public format: ACTIONS_SET) {
    super();
  }
}

export class StatusReportAction extends Action {
  type = ACTION.STATUS_REPORT;

  constructor(public status: ApplicationStatus) {
    super();
  }
}

export class LogAction extends Action {
  type = ACTION.LOG;

  constructor(public data: any) {
    super();

  }
}

export enum STORAGE_KEYS {
  BIRTHDAYS = 'BIRTHDAYS_FOR_BADGE',
  BADGE_VISITED = 'BADGE_VISITED',
  BADGE_ACTIVE = 'BADGE_ACTIVE',
  LAST_ACTIVE_TAB = 'LAST_ACTIVE_TAB',
  LAST_SELECTED_ACTION = 'LAST_SELECTED_ACTION',
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
    text: translatePipe(ACTIONS_SET.ENABLE_BADGE),
    description: '',
  },
  {
    value: ACTIONS_SET.SELECT_FILE_FORMAT_ICS,
    text: translatePipe(ACTIONS_SET.SELECT_FILE_FORMAT_ICS),
    description: 'SELECT_ICS_DESCRIPTION',
  },
  {
    value: ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS,
    text: translatePipe(ACTIONS_SET.SELECT_FILE_FORMAT_DELETE_ICS),
    description: 'SELECT_DELETE_ICS_DESCRIPTION',
  },
  {
    value: ACTIONS_SET.SELECT_FILE_FORMAT_CSV,
    text: translatePipe(ACTIONS_SET.SELECT_FILE_FORMAT_CSV),
    description: 'FILE_FORMAT_CSV_DESCRIPTION',
  },
];
