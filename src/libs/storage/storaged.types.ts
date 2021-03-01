import { Location } from 'history';
import { DateTime } from 'luxon';
import { ScanErrorPayload } from '../events/executed-script.types';

export type CsvDateFormats = 'LL/dd/yyyy' | 'dd/LL/yyyy';
export type StoredBirthday = [string, number, string]; // [name, ordinal, userId]

export interface RestoredBirthday {
  name: string;
  href: string;
  start: DateTime;
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
  modal: ScanErrorPayload;
  activated: boolean;
  scanning: boolean;
  scanSuccess: boolean;
  wizardsSettings: WizardsSettings;
  badgeVisited: DateTime;
  birthdays: Array<StoredBirthday>;
}

export interface StoredSettings {
  location: Location;
  modal: ScanErrorPayload;
  activated: boolean;
  scanning: boolean;
  scanSuccess: boolean;
  wizardsSettings: WizardsSettings;
  badgeVisited: number;
  birthdays: Array<StoredBirthday>;
}
