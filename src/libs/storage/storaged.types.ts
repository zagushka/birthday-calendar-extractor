import { Location } from 'history';
import { DateTime } from 'luxon';
import { ShowModalAction } from '../events/types';

export type CsvDateFormats = 'LL/dd/yyyy' | 'dd/LL/yyyy';

/**
 * [name, ordinal, userId, settings] Stored birthdays format
 * where setting is bitwise settings
 * 1 bit - hidden from export
 */
export type StoredBirthday = [string, number, string, number?];

export interface RestoredBirthday {
  id: string;
  name: string;
  href: string;
  start: DateTime;
  hidden: boolean;
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
  location: Location;
  modal: ShowModalAction;
  activated: boolean;
  scanning: boolean;
  scanSuccess: boolean;
  wizardsSettings: WizardsSettings;
  badgeVisited: DateTime;
  birthdays: Array<StoredBirthday>;
}

export interface StoredSettings {
  location: Location;
  modal: ShowModalAction;
  activated: boolean;
  scanning: boolean;
  scanSuccess: boolean;
  wizardsSettings: WizardsSettings;
  badgeVisited: number;
  birthdays: Array<StoredBirthday>;
}
