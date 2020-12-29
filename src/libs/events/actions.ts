import {
  ACTION,
  ACTIONS_SET,
  ApplicationStatus,
} from '../../constants';

export type ActionType = StartGenerationAction | UpdateBadgeAction | NewDayAction | ErrorAction | LogAction;

export class Action {
  constructor(public type: ACTION) {
  }
}

export class ActionGetFacebookSettings extends Action {
  constructor() {
    super(ACTION.GET_FACEBOOK_SETTINGS);
  }
}

export class NewDayAction extends Action {
  constructor() {
    super(ACTION.ALARM_NEW_DAY);
  }
}

export class StartGenerationAction extends Action {
  constructor(public format: ACTIONS_SET) {
    super(ACTION.GENERATION_START);
  }
}

export class UpdateBadgeAction extends Action {
  constructor() {
    super(ACTION.BADGE_UPDATE);
  }
}

export class BadgeClickedAction extends Action {
  constructor() {
    super(ACTION.BADGE_CLICKED);
  }
}

export class ErrorAction extends Action {
  constructor(public status: ApplicationStatus) {
    super(ACTION.ERROR);
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
  callback?: (...params: Array<any>) => void
}
