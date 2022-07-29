import { DateTime } from 'luxon';
import { RestoredBirthday } from './storage/storaged.types';

export interface PreparedEvent {
  uid: string; // User Id, unique id generated from facebook page url
  name: string;
  start: DateTime;
  end: DateTime;
  href: string;
}

/**
 * Convert array of strings to escaped array by converting by stringifying array and removing wrapping []
 */
export function arrayToCSVRow(notEscaped: Array<string>): string {
  return JSON.stringify(notEscaped).slice(1, -1);
}

/**
 * Convert RawEvent to PreparedEvent
 * * Validate date
 * * Take care of leap year
 * * Generate uid from user href
 * * convert to the form suitable for further usage
 */
export function prepareEvent(event: RestoredBirthday, year: number): PreparedEvent {
  // @TODO Check RestoredBirthday start, is it local, is it utc? Cause in output formats it should be utc
  // Take care of leap year
  // Since all coming birthdays are from 2020 (leap year) 02/29 can occur
  // I change the year to required and
  // luxon knows to handle leap years and change 29 to 28 for Feb if needed
  const start = event.start.set({ year });

  // Wrong date
  if (!start.isValid) {
    return null;
  }

  return {
    name: event.name,
    start,
    end: start.plus({ days: 1 }),
    href: event.href,
    uid: btoa(event.href),
  };
}

/**
 * Generate Array of events for required years range
 * RawEvent is not connected to any year, so we convert it to PreparedEvent and assign the year
 */
export function generatePreparedEventsForYears(events: Array<RestoredBirthday>, year: number, tillYear: number): Array<PreparedEvent> {
  const result: Array<PreparedEvent> = [];

  do {
    events.forEach((event) => {
      const preparedEvent = prepareEvent(event, year);
      if (preparedEvent) {
        result.push(preparedEvent);
      }
    });
    year++;
    // Generate for all required years
  } while (tillYear >= year);

  return result;
}
