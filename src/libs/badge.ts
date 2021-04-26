import { DateTime } from 'luxon';
import {
  filterBirthdaysForDate,
  retrieveUserSettings,
  reviveBirthday,
} from './storage/chrome.storage';

/**
 * Update Badge according to today's birthday counter
 * Set Badge color according to the last click on badge time
 */
export function updateBadge(): void {
  retrieveUserSettings(['birthdays', 'activated', 'badgeVisited'])
    .subscribe(({birthdays, badgeVisited, activated}) => {
      // filter only today's birthdays
      let badgeNumber = '';
      let badgeColor: string | chrome.browserAction.ColorArray = [0, 0, 0, 0];

      // Update default badge value and color if functionality is active
      if (activated) {
        const year = DateTime.local().year;
        try { // Adding try so no application update can cause an error
          const filteredBirthdays = filterBirthdaysForDate(birthdays.map(b => reviveBirthday(b, year)), DateTime.local());
          badgeNumber = filteredBirthdays.length ? filteredBirthdays.length.toString() : '';
          badgeColor = (badgeVisited.ordinal < DateTime.local().ordinal) ? 'red' : [0, 0, 0, 0];
        } catch (e) {
          // error while updating the app
        }
      }

      setBadgeText(badgeNumber);
      setBadgeColor(badgeColor);
    });
}

export function setBadgeColor(color: string | chrome.browserAction.ColorArray = [0, 0, 0, 0]) {
  chrome.action.setBadgeBackgroundColor({color});
}

export function setBadgeText(text: string) {
  chrome.action.setBadgeText({text});
}
