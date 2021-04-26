import { arrayToCSVRow } from '../lib';
import { reviveBirthday } from '../storage/chrome.storage';
import {
  RestoredBirthday,
  STORED_BIRTHDAY,
  StoredBirthday,
} from '../storage/storaged.types';


/**
 * Sort function comparing two birthdays by user name
 *
 * @param first first element to compare
 * @param second second element to compare
 */
function sortStoredBirthdaysByName(first: StoredBirthday, second: StoredBirthday): number {
  const firstName = first[STORED_BIRTHDAY.NAME];
  const secondName = second[STORED_BIRTHDAY.NAME];
  return firstName.localeCompare(secondName);
}

/**
 * Sort function comparing two birthdays by Month and Day
 *
 * @param first first element to compare
 * @param second second element to compare
 */
function sortStoredBirthdaysByMonthDay(first: StoredBirthday, second: StoredBirthday): number {
  const firstBirthday = first[STORED_BIRTHDAY.BIRTH_DATE];
  const secondBirthday = second[STORED_BIRTHDAY.BIRTH_DATE];
  return firstBirthday[1] * 100 + firstBirthday[0] - secondBirthday[1] * 100 - secondBirthday[0];
}

export const calendarCSVData = (storedBirthdays: Array<StoredBirthday>) => {
  const rows = storedBirthdays
    // Sort birthdays incrementally by month and date
    .sort(sortStoredBirthdaysByName) // Stable sort, so sort by Name first
    .sort(sortStoredBirthdaysByMonthDay) // Sort by Month and Day
    .map(reviveBirthday) // Convert to pretty form
    .map(generateEvent);

  /**
   * Generate Calendar
   */
  const headers = arrayToCSVRow([
    'Name',
    'Year',
    'Month',
    'Day',
    'Link to Profile',
  ]);

  // Prepend headers to rows
  rows.unshift(headers);

  return rows
    .join('\n') // Separate each element by line
    .replace(/\r?\n/g, '\r\n');

  function generateEvent(formattedEvent: RestoredBirthday): string {
    const preEscaped = [
      // There is unicode cake character before event.name, you may not see it in you editor
      formattedEvent.name, // `Name,`,
      formattedEvent.birthdate.year?.toString(), // `Year`,
      formattedEvent.birthdate.month.toString(), // `Month`,
      formattedEvent.birthdate.day.toString(), // `Day`,
      formattedEvent.href, // `Link to Profile`
    ];

    return arrayToCSVRow(preEscaped);
  }
};

