export enum ACTION {
  STATUS_REPORT = 'STATUS_REPORT',
  USER_CONFIG = 'USER_CONFIG',
  USER_CONFIG_SET = 'USER_CONFIG_SET',
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

export class GetUserConfigAction extends Action {
  type = ACTION.USER_CONFIG;
}

export class SetUserConfigAction extends Action {
  type = ACTION.USER_CONFIG_SET;

  constructor(public targetFormat: 'ics' | 'csv' | 'delete-ics') {
    super();
  }
}

export class StartGenerationAction extends Action {
  type = ACTION.START_GENERATION;
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

export const STORAGE_KEY = {
  DATA: chrome.i18n.getMessage('STORAGE_KEY_NAME'),
  BADGE_VISITED: chrome.i18n.getMessage('STORAGE_KEY_BADGE_VISITED'),
};
