import { DateTime } from 'luxon';
import { getInfoForBadge } from './storage';

/**
 * Init Badge state:
 * 1. Setup current state
 * 2. Create alarm to update the badge tomorrow
 */
export function setupBadges() {
  // Set current badge
  updateBadge();

  // Setup Alarms
  // Calculate next time to check (tomorrow)
  const now = DateTime.local();
  // Wait till tomorrow
  const wait = Math.floor((DateTime.local(now.year, now.month, now.day)
    .plus({day: 1, minute: 1}).toSeconds() - now.toSeconds()) / 60);

  // Repeat every 24 hours
  const period = 60 * 24;

  // Create Alarm
  chrome.alarms.create({delayInMinutes: wait, periodInMinutes: period});
  // Wait for alarm and update badges
  chrome.alarms.onAlarm.addListener(updateBadge);
}

/**
 * Update Badge according to today's birthday counter
 * Set Badge color according to the last click on badge time
 */
export function updateBadge(): void {
  getInfoForBadge()
    .subscribe(({birthdays, dateVisited}) => {
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
