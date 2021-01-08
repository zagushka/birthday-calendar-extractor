import { DateTime } from 'luxon';
import {
  bindCallback,
  Observable,
} from 'rxjs';
import {
  filter,
  map,
} from 'rxjs/operators';
import {
  alarmNewDay,
  Message,
} from './actions';
import { AlarmTypes } from './types';


// Listen to Alarms and get them as Message
export const alChromeAlarms$: Observable<Message<AlarmTypes>> = bindCallback<chrome.alarms.Alarm>(chrome.alarms.onAlarm.addListener)
  .call(chrome.alarms.onAlarm)
  .pipe(
    filter(alarm => 'new-day-alarm' === alarm.name),
    map((alarm) => ({action: alarmNewDay()})),
  );

// Setup Alarms
export function setupAlarms() {
// Calculate next time to check (tomorrow)
  const now = DateTime.local();
// Wait till tomorrow
  const wait = Math.floor((DateTime.local(now.year, now.month, now.day)
    .plus({day: 1, minute: 1}).toSeconds() - now.toSeconds()) / 60);

// Repeat every 24 hours
  const period = 60 * 24;

// Create Alarm
  chrome.alarms.create('new-day-alarm', {delayInMinutes: wait, periodInMinutes: period});
}
