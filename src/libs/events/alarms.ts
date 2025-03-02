import { DateTime } from "luxon";
import { alarmNewDay } from "@/libs/events/actions";
import { sendMessage } from "@/libs/events/events";

const onAlarmListener = (alarm: chrome.alarms.Alarm) => {
  if (alarm.name === "new-day-alarm") {
    sendMessage(alarmNewDay());
  }
  return true;
};

// Alarms should forward their events via `sendMessage`
chrome.alarms.onAlarm.addListener(onAlarmListener);

// Setup Alarms
export function setupAlarms() {
  // Calculate next time to check (tomorrow)
  const now = DateTime.local();
  // Wait till tomorrow
  const wait = Math.floor(
    (DateTime.local(now.year, now.month, now.day).plus({ days: 1, minutes: 1 }).toSeconds() - now.toSeconds()) / 60,
  );

  // Repeat every 24 hours
  const period = 60 * 24;

  // Create Alarm
  chrome.alarms.create("new-day-alarm", { delayInMinutes: wait, periodInMinutes: period });
}
