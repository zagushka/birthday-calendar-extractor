import { DateTime } from 'luxon';
import {
  filterBirthdaysForDate,
  retrieveUserSettings,
  reviveBirthdayThisYear,
} from './storage/chrome.storage';

/**
 * Update Badge according to today's birthday counter
 * Set Badge color according to the last click on badge time
 */
export function updateBadge(): void {
  // @TODO Add Check Badge is active
  retrieveUserSettings(['birthdays', 'activated', 'badgeVisited'])
    .subscribe(({birthdays, badgeVisited, activated}) => {
      // filter only today's birthdays
      let badgeNumber = '';
      let badgeColor: string | chrome.browserAction.ColorArray = [0, 0, 0, 0];

      // Update default badge value and color if functionality is active
      if (activated) {
        const filteredBirthdays = filterBirthdaysForDate(birthdays.map(reviveBirthdayThisYear), DateTime.local());
        badgeNumber = filteredBirthdays.length ? filteredBirthdays.length.toString() : '';
        badgeColor = (badgeVisited.ordinal < DateTime.local().ordinal) ? 'red' : [0, 0, 0, 0];
      }

      setBadgeText(badgeNumber);
      setBadgeColor(badgeColor);
    });
}

export function setBadgeColor(color: string | chrome.browserAction.ColorArray = [0, 0, 0, 0]) {
  // @ts-ignore
  chrome.action.setBadgeBackgroundColor({color});
}

export function setBadgeText(text: string) {
  // @ts-ignore
  chrome.action.setBadgeText({text});
}
