import {
  ActionTypes,
  ALARM_NEW_DAY,
  AlarmTypes,
  BADGE_CLICKED,
  BadgeActionTypes,
  BIRTHDAYS_SCAN_COMPLETE,
  BIRTHDAYS_START_SCAN,
  BirthdaysExtractionActionTypes,
  NotificationActionTypes,
  SEND_ERROR,
  SEND_GENERATION_STATUS,
  SEND_SCAN_LOG,
  SendScanLogAction,
  UPDATE_BADGE,
} from '@/libs/events/types';

export function sendError(error: string): NotificationActionTypes {
  return {
    type: SEND_ERROR,
    payload: {error},
  };
}

export function sendGenerationStatus(status: string): NotificationActionTypes {
  return {
    type: SEND_GENERATION_STATUS,
    payload: {status},
  };
}

export function updateBadgeAction(): BadgeActionTypes {
  return {
    type: UPDATE_BADGE,
  };
}

export function badgeClickedAction(): AlarmTypes {
  return {
    type: BADGE_CLICKED,
  };
}

export function alarmNewDay(): AlarmTypes {
  return {
    type: ALARM_NEW_DAY,
  };
}

export function BirthdaysStartScan(): BirthdaysExtractionActionTypes {
  return {
    type: BIRTHDAYS_START_SCAN,
  };
}

export function BirthdaysScanComplete(): BirthdaysExtractionActionTypes {
  return {
    type: BIRTHDAYS_SCAN_COMPLETE,
  };
}

export function SendScanLog(messageName: string, substitutions?: Array<string>): SendScanLogAction {
  return {
    type: SEND_SCAN_LOG,
    payload: {messageName, substitutions},
  };
}

export interface Message<T extends ActionTypes> {
  action: T,
  sender?: chrome.runtime.MessageSender,
  callback?: (...params: Array<any>) => void
}
