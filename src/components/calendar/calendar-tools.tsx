import {
  DateTime,
  DateTimeFormatOptions,
} from 'luxon';
import { RestoredBirthday } from '../../libs/storage/storaged.types';

export const DAY_HEADER_HEIGHT = 38;
export const USER_ROW_HEIGHT = 32;

export type GroupedUsers = Array<[number, Array<RestoredBirthday>]>;

export interface UserDisplayDataMap {
  offset: number;
  ordinal: number;
  height: number
}

export interface UserMapInterface {
  userGroups: GroupedUsers;
  usersMap: Array<UserDisplayDataMap>;
}

export const groupUsersByOrdinal = (rawUsers: Array<RestoredBirthday>): GroupedUsers => {
  return Array.from(
    rawUsers
      // Sort birthdays by user name
      .sort((a, b) => a.name.localeCompare(b.name))
      // create Map with birthday date as a key (unix time stamp) and array of users as value
      .reduce((ac, user) => ac.set(user.start.toMillis(), [...(ac.get(user.start.toMillis()) ?? []), user])
        , new Map<number, Array<RestoredBirthday>>(),
      ),
    )
    // Sort days
    .sort((a, b) => a[0] - b[0]);
};

export const mapGroupedUsersToDisplayItemDimensions = (grouped: GroupedUsers): Array<UserDisplayDataMap> => {
  return grouped.reduce((acc, [day, items]) => {
    return acc.concat({
      // Map ordinal of the day to its index in final array
      ordinal: DateTime.fromMillis(day).ordinal,
      // Calculate the height for each day
      height: DAY_HEADER_HEIGHT + items.length * USER_ROW_HEIGHT,
      // Offset of the index
      offset: acc.length ? (acc[acc.length - 1].offset + acc[acc.length - 1].height) : 0,
    });
  }, []);
};

export function asLongDate(date: DateTime | number): string {
  const format: DateTimeFormatOptions = {weekday: 'long', month: 'long', day: 'numeric'};
  if ('number' === typeof date) {
    return DateTime.fromMillis(date).toLocaleString(format);
  }
  return date.toLocaleString(format);
}


export function asShortDate(date: DateTime | number): string {
  const format: DateTimeFormatOptions = {weekday: 'short', month: 'short', day: 'numeric'};
  if ('number' === typeof date) {
    return DateTime.fromMillis(date).toLocaleString(format);
  }
  return date.toLocaleString(format);
}
