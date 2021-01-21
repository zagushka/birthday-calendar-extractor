import {
  CsvDateFormats,
  IcsSettings,
} from '../../context/settings.context';
import {
  ActionTypes,
  ALARM_NEW_DAY,
  AlarmTypes,
  BADGE_CLICKED,
  BadgeActionTypes,
  BadgeNotificationActionTypes,
  BIRTHDAYS_EXTRACTION_COMPLETE,
  BIRTHDAYS_START_EXTRACTION,
  BirthdaysExtractionActionTypes,
  CREATE_CALENDAR_CSV,
  CREATE_CALENDAR_DELETE_ICS,
  CREATE_CALENDAR_ICS,
  CREATE_CALENDAR_JSON,
  CreateCalendarActionTypes,
  DISABLE_BADGE_NOTIFICATION,
  ENABLE_BADGE_NOTIFICATION,
  NotificationActionTypes,
  SEND_ERROR,
  SEND_GENERATION_STATUS,
  UPDATE_BADGE,
} from './types';

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

export function enableBadgeNotifications(): BadgeNotificationActionTypes {
  return {
    type: ENABLE_BADGE_NOTIFICATION,
  };
}

export function disableBadgeNotifications(): BadgeNotificationActionTypes {
  return {
    type: DISABLE_BADGE_NOTIFICATION,
  };
}

export function updateBadgeAction(): BadgeActionTypes {
  return {
    type: UPDATE_BADGE,
  };
}

export function createCalendarCsv(format: CsvDateFormats): CreateCalendarActionTypes {
  return {
    type: CREATE_CALENDAR_CSV,
    payload: {format},
  };
}

export function createCalendarIcs(settings: IcsSettings): CreateCalendarActionTypes {
  return {
    type: CREATE_CALENDAR_ICS,
    payload: settings,
  };
}

export function createCalendarDeleteIcs(settings: IcsSettings): CreateCalendarActionTypes {
  return {
    type: CREATE_CALENDAR_DELETE_ICS,
    payload: settings,
  };
}

export function createCalendarJson(): CreateCalendarActionTypes {
  return {
    type: CREATE_CALENDAR_JSON,
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

export function BirthdaysStartExtraction(): BirthdaysExtractionActionTypes {
  return {
    type: BIRTHDAYS_START_EXTRACTION,
  };
}

export function BirthdaysExtractionComplete(): BirthdaysExtractionActionTypes {
  return {
    type: BIRTHDAYS_EXTRACTION_COMPLETE,
  };
}

export interface Message<T extends ActionTypes> {
  action: T,
  sender?: chrome.runtime.MessageSender,
  callback?: (...params: Array<any>) => void
}
