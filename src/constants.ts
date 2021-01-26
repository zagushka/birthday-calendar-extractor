export enum ACTION {
  STATUS_REPORT = 'STATUS_REPORT',
  USER_CONFIG = 'USER_CONFIG',
  USER_CONFIG_SET = 'USER_CONFIG_SET',
  START_GENERATION = 'START_GENERATION',
  CHECK_STATUS = 'CHECK_STATUS',
  LOG = 'LOG',
  GENERATION_FLOW_STATUS = 'GENERATION_FLOW_STATUS'
}

export type ApplicationStatus =
  'FACEBOOK_REQUIRED'
  | 'NOT_SUPPORTED_LANGUAGE'
  | 'DONE'
  | 'USER_SETTINGS'
  | 'NO_TOKEN_DETECTED'
  | 'UNKNOWN_ERROR';

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

  constructor(public status: ApplicationStatus, public message?: any) {
    super();
  }
}

export class GenerationFlowStatus extends Action {
  type = ACTION.GENERATION_FLOW_STATUS;

  constructor(public status: string, public message?: string) {
    super();
  }
}

export class CheckStatusAction extends Action {
  type = ACTION.CHECK_STATUS;
}

export class LogAction extends Action {
  type = ACTION.LOG;

  constructor(public data: any) {
    super();

  }
}
