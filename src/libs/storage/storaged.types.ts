import { DateTime } from 'luxon';
import type { Location } from 'react-router-dom';
import { ShowModalAction } from '@/libs/events/types';

export type CsvDateFormats = 'LL/dd/yyyy' | 'dd/LL/yyyy';

/**
 * [name, uid, [day, month, year], misc, settings] Stored birthdays format
 * where setting is bitwise settings
 * 1rst bit = 1 << 0- hidden from export
 * 2nd bit = 1 << 1 - custom-made contact
 */
export enum STORED_BIRTHDAY {
  NAME,
  UID,
  BIRTH_DATE,
  MISC,
  SETTINGS
}

export enum STORED_BIRTHDAY_SETTINGS {
  HIDDEN_FOR_EXPORT = 1 << 0,
  CUSTOM_MADE = 1 << 1,
}

export type StoredBirthday = [string, string, [number, number, number], any, number];

export interface RestoredBirthday {
  id: string;
  name: string;
  href: string;
  start: DateTime;
  hidden: boolean;
  birthdate: {
    day: number;
    month: number;
    year: number;
  };
}

export interface CsvSettings {
  format: CsvDateFormats;
}

export interface IcsSettings {
  groupEvents: boolean;
}

export interface WizardsSettings {
  csv: CsvSettings;
  ics: IcsSettings;
}

export interface Settings {
  activated: boolean;
  badgeVisited: DateTime;
  birthdays: Array<StoredBirthday>;
  donated: boolean;
  location: Location;
  modal: ShowModalAction;
  scanning: number;
  scanSuccess: boolean;
  wizardsSettings: WizardsSettings;
}

export interface StoredSettings {
  activated: boolean;
  badgeVisited: number;
  birthdays: Array<StoredBirthday>;
  donated: boolean;
  location: Location;
  modal: ShowModalAction;
  scanning: number;
  scanSuccess: boolean;
  wizardsSettings: WizardsSettings;
}
