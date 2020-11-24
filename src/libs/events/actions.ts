import {
  ACTION,
  ACTIONS_SET,
  ApplicationStatus,
} from '../../constants';

export type ActionType = StartGenerationAction | UpdateBadgeAction | NewDayAction | StatusReportAction | LogAction;

export class Action {
  constructor(public type: ACTION) {
  }
}

export class NewDayAction extends Action {
  constructor() {
    super(ACTION.ALARM_NEW_DAY);
  }
}

export class StartGenerationAction extends Action {
  constructor(public format: ACTIONS_SET) {
    super(ACTION.START_GENERATION);
  }
}

export class UpdateBadgeAction extends Action {
  constructor() {
    super(ACTION.UPDATE_BADGE);
  }
}

export class StatusReportAction extends Action {
  constructor(public status: ApplicationStatus) {
    super(ACTION.STATUS_REPORT);
  }
}

export class LogAction extends Action {
  constructor(public data: any) {
    super(ACTION.LOG);
  }
}

export interface Message<T extends Action> {
  action: T,
  sender?: chrome.runtime.MessageSender,
  callback?: () => void
}
