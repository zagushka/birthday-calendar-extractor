import { DateTime } from 'luxon';
import { STORAGE_KEYS } from '../constants';
import {
  filterBirthdaysForDate,
  retrieveUserSettings,
} from './storage/chrome.storage';

/**
 * Update Badge according to today's birthday counter
 * Set Badge color according to the last click on badge time
 */
export function updateBadge(): void {
  // @TODO Add Check Badge is active
  retrieveUserSettings([STORAGE_KEYS.BIRTHDAYS, STORAGE_KEYS.BADGE_ACTIVE, STORAGE_KEYS.BADGE_VISITED])
    .subscribe((settings) => {
      // filter only today's birthdays
      let badgeNumber = '';
      let badgeColor: string | chrome.browserAction.ColorArray = [0, 0, 0, 0];

      // Update default badge value and color if functionality is active
      if (settings[STORAGE_KEYS.BADGE_ACTIVE]) {
        const birthdays = filterBirthdaysForDate(settings[STORAGE_KEYS.BIRTHDAYS], DateTime.local());
        badgeNumber = birthdays.length ? birthdays.length.toString() : '';
        badgeColor = (settings[STORAGE_KEYS.BADGE_VISITED].ordinal < DateTime.local().ordinal) ? 'red' : [0, 0, 0, 0];
      }

      setBadgeText(badgeNumber);
      setBadgeColor(badgeColor);
    });
}

export function setBadgeColor(color: string | chrome.browserAction.ColorArray = [0, 0, 0, 0]) {
  chrome.browserAction.setBadgeBackgroundColor({color});
}

export function setBadgeText(text: string) {
  chrome.browserAction.setBadgeText({text});
}
