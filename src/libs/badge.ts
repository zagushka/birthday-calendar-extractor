import { DateTime } from 'luxon';
import { getInfoForBadge } from './storage/chrome.storage';

/**
 * Update Badge according to today's birthday counter
 * Set Badge color according to the last click on badge time
 */
export function updateBadge(): void {
  // @TODO Add Check Badge is active
  getInfoForBadge()
    .subscribe(({birthdays, dateVisited = DateTime.fromMillis(0)}) => {
      const badgeNumber = birthdays.length ? birthdays.length.toString() : '';
      const badgeColor: string | chrome.browserAction.ColorArray = (dateVisited.ordinal < DateTime.local().ordinal) ? 'red' : [0, 0, 0, 0];

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
