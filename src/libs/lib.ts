import { DateTime } from 'luxon';
import {
  concat,
  Observable,
  of,
  Subject,
  throwError,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  catchError,
  map,
  mapTo,
  scan,
  switchMap,
  tap,
  toArray,
} from 'rxjs/operators';
import {
  BirthdaysScanComplete,
  SendScanLog,
} from './events/actions';
import { sendMessage } from './events/events';

import {
  languages,
  LanguageSet,
} from './languages';
import {
  RestoredBirthday,
  retrieveUserSettings,
  storeUserSettings,
} from './storage/chrome.storage';

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
  const start = event.start.set({year: year});

  // Wrong date
  if (!start.isValid) {
    return null;
  }

  return {
    name: event.name,
    start: start,
    end: start.plus({days: 1}),
    href: event.href,
    uid: window.btoa(event.href),
  };
}

/**
 * Generate Array of events for required years range
 * RawEvent is not connected to any year, so we convert it to PreparedEvent and assign the year
 */
export function generatePreparedEventsForYears(events: Array<RestoredBirthday>, year: number, tillYear: number): Array<PreparedEvent> {
  const result: Array<PreparedEvent> = [];

  do {
    events.forEach(event => {
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

export function weekDates(): { [name: number]: DateTime } {
  const days: { [name: number]: DateTime } = {};

  for (let i = 1; i <= 7; i++) {
    // Have to use DateTime.local() for a case when generated in the window between local() and utc() day change.
    const date = DateTime.local().plus({days: i});
    const weekDayNumber = +date.toFormat('c') - 1; // toFormat('c') returns weekday from 1-7 (Monday is 1, Sunday is 7)
    days[weekDayNumber] = date;
  }
  return days;
}

export function getLanguagesList() {
  return languages.flatMap(l => l.languages);
}

export function findLanguageSetByLanguage(language: string): LanguageSet {
  return languages.find((data) => -1 !== data.languages.findIndex(l => l === language));
}

function extractCardWithDate(src: string, patterns: Array<RegExp>): { name: string, day: number, month: number } {
  let result: RegExpMatchArray;

  patterns.find((p) => {
    result = src.match(p);
    return result;
  });

  if (!result) {
    return;
  }

  return {
    name: result.groups.name,
    day: +result.groups.day,
    month: +result.groups.month,
  };
}

function weekDayNumberByName(languageSet: LanguageSet, weekDayName: string) {
  return languageSet.weekdays.findIndex(w => w === weekDayName);
}

function extractCardWithWeek(src: string, pattern: RegExp, languageSet: LanguageSet): { name: string, day: number, month: number } {
  // Parse as weekday for each pattern
  const result = src.match(pattern);

  if (!result) {
    return;
  }

  // find week day number by the name
  const weekDayNumber = weekDayNumberByName(languageSet, result.groups.weekDayName);

  if (-1 === weekDayNumber) {
    return;
  }
  const weekDay = weekDates()[weekDayNumber];
  return {
    name: result.groups.name,
    day: +weekDay.day,
    month: +weekDay.month,
  };
}

/**
 * RestoredBirthday have basic information extracted from parsed html, such as
 * href, user name, and birthdate in 2020
 */
function generateBirthdaysFromRaw(data: Array<{ href: string; user: string }>, languageSet: LanguageSet): Array<RestoredBirthday> {
  return data.map(item => {
    const card = extractCardWithDate(item.user, languageSet.pattern) ||
      extractCardWithWeek(item.user, languageSet.weekdays_pattern, languageSet);

    if (card && item.href.length) {
      return {
        name: card.name,
        start: DateTime.local(2020, card.month, card.day),
        href: item.href,
      };
    }
  });
}

export function decode(str: string) {
  return (str + '')
    .replace(/&#x[0-9a-f]+;/gm, (s) => {
      return String.fromCharCode(parseInt(s.match(/[0-9a-f]+/gm)[0], 16));
    });
}

function extractBirthdayDataFromHtml(rawData: string): Array<{ href: string, user: string }> {
  rawData = decode(rawData);
  const regex = new RegExp('<a href="([^"]*)"[^>]+?data-tooltip-content="([^"]*)"', 'gm');
  let m: RegExpExecArray;
  const result = [];
  // tslint:disable-next-line:no-conditional-assignment
  while ((m = regex.exec(rawData)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    result.push({
      href: m[1],
      user: m[2],
    });
  }
  return result;
}

function loopDates() {
  /**
   * Request dates are mess
   * To fetch monthly birthdays Facebook uses timestamp with 1rst day of the month
   * Though time used is different from month to month,
   * i.e Dec, Jan, Feb, Mar use 8:00
   * rest of the month use 7:00
   *
   * Additionally when requesting 1 March, 8:00 - no 31 of March birthdays appear,
   * they can be found when requesting 1 April 6:00 !!!
   *
   * So to make sure I fetch all the birthdays I'll make two requests per month.
   */
  return Array(12)
    .fill([8, 7])
    .fill([7, 6], 3, 10)
    .map((v, k) => [
        DateTime.utc(2020, k + 1, 1, v[0]).toSeconds(),
        DateTime.utc(2020, k + 1, 1, v[1]).toSeconds(),
      ],
    ).flat();
}

/**
 * Parse provided html page and extract language from structures as
 * ["LocaleInitialData",[],{"locale":"en_US","language":"English (US)"},273]
 */
function extractLanguageFromPage(page: string): string {
  const pattern = new RegExp('."language":"(.*?)"', 'm');
  const result = pattern.exec(page);
  return result && result[1];
}

/**
 * Parse provided html page and extract async_get_token
 */
function extractTokenFromPage(page: string): string {
  const pattern = new RegExp('.*async_get_token":"(.*?)"', 'm');
  const result = pattern.exec(page);
  return result && result[1];
}

/**
 * Make request to facebook.com in order to receive html with vital information such as
 * async_get_token and used language
 *
 * return {language, token}
 */
export function parsePageForConfig(): Observable<{ token: string; language: string }> {
  sendMessage(SendScanLog('CHECKING FOR FACEBOOK LOGIN AND LANGUAGE'), true);
  return ajax({
    url: 'https://www.facebook.com',
    headers: {
      'accept': 'text/html',
    },
    responseType: 'text',
  })
    .pipe(
      map(data => data.response),
      switchMap(page => {
        const token = extractTokenFromPage(page);
        const language = extractLanguageFromPage(page);

        if (!token) {
          sendMessage(SendScanLog('ERROR: NO FACEBOOK LOGIN DETECTED'), true);
          return throwError('NO_TOKEN_DETECTED');
        }

        if (!findLanguageSetByLanguage(language)) {
          sendMessage(SendScanLog('ERROR: DETECTED NOT SUPPORTED LANGUAGE'), true);
          return throwError('NOT_SUPPORTED_LANGUAGE');
        }
        sendMessage(SendScanLog('FACEBOOK LOGIN AND LANGUAGE ARE FINE'), true);
        return of({token, language});
      }),
    );
}

function fetchBirthdaysPage(url: string): Observable<string> {
  return ajax({url, responseType: 'text'})
    .pipe(
      map(r => JSON.parse(r.response.substring(9))),
      map(r => r.domops[0][3].__html),
    );
}

export function fetchBirthdays(token: string, language: string): Observable<Array<RestoredBirthday>> {
  sendMessage(SendScanLog('PREPARING REQUESTS'), true);

  const languageSet = findLanguageSetByLanguage(language);

  const requests = loopDates()
    .map(date => 'https://www.facebook.com/async/birthdays/?date=' + date + '&__a=1&fb_dtsg_ag=' + token)
    .map(fetchBirthdaysPage)
    .map((r) => r.pipe(tap(() => messages.next(null))));

  const messages = new Subject();
  messages
    .pipe(
      scan((curr) => ++curr, 0),
    )
    .subscribe(
      (count) => {
        sendMessage(SendScanLog(`Executed ${count.toString()} of ${requests.length.toString()} requests.`), true);
      },
      error => {
        sendMessage(SendScanLog(`Error: ${error}`), true);
      },
      () => {
        sendMessage(SendScanLog(`REQUESTS DONE`), true);
      },
    );

  return concat(...requests)
    .pipe(
      toArray(),
      map(
        responses => {
          sendMessage(SendScanLog(`EXTRACTING BIRTHDAYS DATA`), true);
          const nonUniques: Array<[string, RestoredBirthday]> = responses
            .map(extractBirthdayDataFromHtml)
            .map(items => generateBirthdaysFromRaw(items, languageSet))
            .flat()
            .map(i => [i.href, i]);

          return Array.from(new Map(nonUniques).values()); // All non-uniques are removed
        }),
      catchError((err) => {
        messages.error(err);
        messages.complete();
        return throwError(err);
      }),
    );
}

/**
 * Make new full scan of the birthdays data
 * Store fetched data to local storage
 */
export function forceBirthdaysScan() {
  // First of all check for the token and language
  return parsePageForConfig()
    .pipe(
      // Fetch the data from facebook
      switchMap(({token, language}) => fetchBirthdays(token, language)),
      // Store fetched data for further usage
      switchMap(data => {
        sendMessage(SendScanLog(`STORING FETCHED BIRTHDAYS`), true);
        return storeUserSettings({birthdays: data, activated: true})
          .pipe(
            mapTo(data),
            tap(() => {
              sendMessage(BirthdaysScanComplete(), true);
            }),
          );
      }),
    );
}

export function getBirthdaysList(): Observable<Array<RestoredBirthday>> {
  return retrieveUserSettings(['birthdays', 'activated'])
    .pipe(
      switchMap(({birthdays, activated}) => {
        if (activated) {
          // Using cached version
          return of(birthdays);
        }

        // Make full run for the data
        return forceBirthdaysScan();
      }),
    );
}

