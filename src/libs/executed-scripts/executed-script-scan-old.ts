import {
  ExecutedScriptScanResponseAction,
  RawScannedUser,
  ScanErrorTypes,
} from '../events/executed-script.types';

interface LanguageSet {
  languages: Array<string>;
  pattern: Array<RegExp>;
  weekdays_pattern: RegExp;
  weekdays: Array<string>;
}

export const fetchUserFriendsBirthdayInfoFromContextOld = (): string => {
  const responseId = Math.random().toString();
  sendScanLog('SCAN_LOG_EXTRACT_TOKEN');

  const WEEKDAY_REGEXP = new RegExp('(?<name>.*) \\((?<weekDayName>[^)]*)\\)$');
  const languages: Array<LanguageSet> = [
    {
      languages: ['English (UK)'],
      pattern: [new RegExp('(?<name>.*) \\((?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\)$')],
      weekdays_pattern: WEEKDAY_REGEXP,
      weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    {
      languages: ['English (US)'],
      pattern: [new RegExp('(?<name>.*) \\((?<month>[0-9]{1,2})[^0-9](?<day>[0-9]{1,2})\\)$')],
      weekdays_pattern: WEEKDAY_REGEXP,
      weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    {
      languages: ['Русский'],
      pattern: [new RegExp('(?<name>.*) \\((?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\)$')],
      weekdays_pattern: WEEKDAY_REGEXP,
      weekdays: ['воскресенье', 'понедельник', 'вторник', 'cреда', 'четверг', 'пятница', 'суббота'],
    },
    {
      languages: ['Українська'],
      pattern: [new RegExp('(?<name>.*) \\((?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\)$')],
      weekdays_pattern: WEEKDAY_REGEXP,
      weekdays: ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'],
    },
    {
      languages: ['עברית'],
      pattern: [
        new RegExp('\\u{200f}\\u{200e}(?<name>.*)\\u{200e}\\u{200f} \\(\\u{200f}(?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\u{200f}\\)$', 'u'),
        new RegExp('\\u{200f}(?<name>.*)\\u{200f} \\(\\u{200f}(?<day>[0-9]{1,2})[^0-9](?<month>[0-9]{1,2})\\u{200f}\\)$', 'u'),
      ],
      weekdays_pattern: new RegExp('\\u{200f}\\u{200e}(?<name>.*)\\u{200e}\\u{200f} \\((?<weekDayName>[^)]*)\\)$', 'u'),
      weekdays: ['ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'שישי', 'שבת'],
    },
  ];

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
      day: weekDay.getDate(),
      month: weekDay.getMonth() + 1,
    };
  }

  function weekDates(): { [name: number]: Date } {
    const days: { [name: number]: Date } = {};

    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      days[date.getDay()] = date;
    }
    return days;
  }

  function decode(str: string) {
    return (str + '')
      .replace(/&#x[0-9a-f]+;/gm, (s) => {
        return String.fromCharCode(parseInt(s.match(/[0-9a-f]+/gm)[0], 16));
      });
  }

  function findLanguageSetByLanguage(language: string): LanguageSet {
    return languages.find((data) => -1 !== data.languages.findIndex(l => l === language));
  }

  /**
   * Make request to facebook.com in order to receive html with vital information such as
   * token
   */
  getFacebookPage()
    .then(extractFacebookTokens)
    // Fetch user friends birthday data
    .then(async ({asyncToken, language, token}) => {
      const languageSet = findLanguageSetByLanguage(language);
      let fetchedBirthdays: Array<{ name: string; id: string; birthdate: any }>;
      let mappedUsers: Array<{ name: string; id: string }>;

      try {
        mappedUsers = await fetchFriendsInfo(token);
        fetchedBirthdays = await concatPromise(
          ...[
            1606809600, // DateTime.utc(2020, 12, 1, 8).toSeconds()
            1606806000, // DateTime.utc(2020, 12, 1, 7).toSeconds()
          ] // Make all the request with even assets
            .map(date => () => fetchFriendsBirthdayInfo(asyncToken, date)
              .then(r => extractBirthdays(r, languageSet)),
            ),
        )
          .then(monthArray => [].concat(...monthArray));
      } catch (e) {
        return Promise.reject(e);
      }

      // Detect user facebook id and replace with it original human readable part of their profile url
      return fetchedBirthdays.map(birthday => {
        const found = mappedUsers.filter(u => u.name === birthday.name);
        if (1 === found.length) {
          return Object.assign(birthday, {id: found[0].id});
        }
        return birthday;
      });
    })
    .then((result) => executedScriptUserContextResponse(result))
    .catch(error => executedScriptUserContextError(error.messageName, error.error));

  /**
   * Send message with Scan log update
   *
   * @param messageName - message name to be used for i18n internalisation
   * @param substitutions - optional substitutions for messageName
   */
  function sendScanLog(messageName: string, substitutions?: Array<string>) {
    chrome.runtime.sendMessage({
      type: 'SEND_SCAN_LOG',
      payload: {messageName, substitutions},
    });
  }

  /**
   * Send message with an error, background and popup script will listen for `EXECUTED_SCRIPT_RESPONSE` event type
   *
   * @param messageName - error description to be used with i18n
   * @param error - anything else describes the error
   */
  function executedScriptUserContextError(messageName: ScanErrorTypes, error?: any) {
    const message: ExecutedScriptScanResponseAction = {
      type: 'EXECUTED_SCRIPT_RESPONSE',
      responseId,
      payload: {
        type: messageName ?? 'SCAN_ERROR_GENERAL',
        error,
      },
    };
    chrome.runtime.sendMessage(message);
  }

  /**
   * Fake ExecutedScriptContextResponse since the function is not accessible from here
   *
   * @param users - Array of extracted user birthdays
   */
  function executedScriptUserContextResponse(users: Array<RawScannedUser>) {
    const message: ExecutedScriptScanResponseAction = {
      type: 'EXECUTED_SCRIPT_RESPONSE',
      responseId,
      payload: {
        type: 'SCAN_SUCCESS',
        users,
      },
    };
    chrome.runtime.sendMessage(message);
  }

  /**
   * Parse provided html page and extract token
   * token will be found on the page inside json like construction "token":"TOKEN_VALUE"
   *
   * @param page - fetched facebook page
   */
  function extractAsyncTokenFromPage(page: string): string {
    const pattern = new RegExp('.*async_get_token":"(.*?)"', 'm');
    const result = pattern.exec(page);
    return result && result[1];
  }

  /**
   * Parse provided html page and extract token
   * token will be found on the page inside json like construction "token":"TOKEN_VALUE"
   *
   * @param page - fetched facebook page
   */
  function extractTokenFromPage(page: string): string {
    const pattern = new RegExp('.*"token":"(.*?)"', 'm');
    const result = pattern.exec(page);
    return result && result[1];
  }

  /**
   * Parse provided html page and extract language from structures as
   * ["LocaleInitialData",[],{"locale":"en_US","language":"English (US)"},273]
   */
  function extractLanguageFromPage(page: string): string {
    // Example: "{"current_locale":{"localized_name":"English (US)"}}
    const pattern = new RegExp('."localized_name":"(.*?)"', 'm');
    const result = pattern.exec(page);
    return result && JSON.parse(`"${result[1]}"`);
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


  /**
   * RestoredBirthday have basic information extracted from parsed html, such as
   * href, user name, and birthdate in 2020
   */
  function generateBirthdaysFromRaw(data: Array<{ href: string; user: string }>, languageSet: LanguageSet) {
    return data.map(item => {
      const card = extractCardWithDate(item.user, languageSet.pattern) ||
        extractCardWithWeek(item.user, languageSet.weekdays_pattern, languageSet);

      if (card && item.href.length) {
        return {
          name: card.name,
          birthdate: {day: card.day, month: card.month, year: null},
          id: item.href.substring('https://www.facebook.com/'.length), // Remove `https://www.facebook.com/` from user href
        };
      }
    });
  }

  /**
   * Fetch https://www.facebook.com page and handle related errors
   */
  async function getFacebookPage(): Promise<string> {
    let response: Response;
    try {
      sendScanLog('SCAN_LOG_PAGE_REQUEST');
      /**
       * Make request to facebook.com in order to receive html with vital information such as
       * token
       */
      response = await fetch('https://www.facebook.com', {headers: {accept: 'text/html'}});
    } catch (error) {
      sendScanLog('SCAN_LOG_PAGE_REQUEST_ERROR', [error as string]);
      return Promise.reject({messageName: 'SCAN_ERROR_FACEBOOK_PAGE_REQUEST', error});
    }

    try {
      sendScanLog('SCAN_LOG_PAGE_CONTENT');
      return await response.text();
    } catch (error) {
      sendScanLog('SCAN_LOG_PAGE_CONTENT_ERROR', [error as string]);
      return Promise.reject({messageName: 'SCAN_ERROR_FACEBOOK_PAGE_CONTENT', error});
    }
  }

  async function fetchFriendsInfo(token: string): Promise<Array<{ name: string; id: string }>> {
    let response: Response;
    try {
      /**
       * Make request to facebook.com in order to receive html with vital information such as
       * token
       */
      sendScanLog('SCAN_LOG_FRIENDS_LIST_REQUEST');
      response = await fetch('https://www.facebook.com/api/graphql/', {
        'headers': {
          'content-type': 'application/x-www-form-urlencoded',
        },
        'body':
          '__a=1'
          + '&fb_dtsg=' + encodeURIComponent(token)
          + '&fb_api_caller_class=RelayModern'
          + '&fb_api_req_friendly_name=useFeedComposerCometMentionsBootloadDataSourceQuery'
          + '&variables=' + encodeURIComponent(JSON.stringify({
            'include_viewer': true,
            'options': ['FRIENDS_ONLY'],
            'scale': 1,
            'typeahead_context': 'mentions',
            'types': ['USER'],
          }))
          + '&server_timestamps=true'
          + '&doc_id=3694797050619666',
        'method': 'POST',
      });
    } catch (error) {
      sendScanLog('SCAN_LOG_FRIENDS_LIST_REQUEST_ERROR', [error as string]);
      return Promise.reject({messageName: 'SCAN_ERROR_FRIENDS_LIST_REQUEST', error});
    }

    let json;
    try {
      sendScanLog('SCAN_LOG_FRIENDS_LIST_CONTENT');
      json = await response.json();
      return (json.data.comet_composer_typeahead_bootload as Array<{ node: { name: string; id: string } }>)
        .map(({node: {id, name}}) => ({name, id}));
    } catch (error) {
      sendScanLog('SCAN_LOG_FRIENDS_LIST_CONTENT_ERROR', [error as string]);
      return Promise.reject({messageName: 'SCAN_ERROR_FRIENDS_LIST_CONTENT', error: {error, response: json}});
    }
  }

  async function fetchFriendsBirthdayInfo(token: string, date: number): Promise<string> {
    let response: Response;
    try {
      /**
       * Make request to facebook.com in order to receive html with vital information such as
       * token
       */
      sendScanLog('SCAN_LOG_BIRTHDAYS_REQUEST');
      response = await fetch(
        'https://www.facebook.com/async/birthdays/?date=' + date + '&__a=1&fb_dtsg_ag=' + token,
      );
    } catch (error) {
      sendScanLog('SCAN_LOG_BIRTHDAYS_REQUEST_ERROR', [error as string]);
      return Promise.reject({messageName: 'SCAN_ERROR_FACEBOOK_BIRTHDAYS_REQUEST', error});
    }

    let text;
    try {
      sendScanLog('SCAN_LOG_BIRTHDAYS_CONTENT');
      text = await response.text();
      return JSON.parse(text.substring(9)).domops[0][3].__html;
    } catch (error) {
      sendScanLog('SCAN_LOG_BIRTHDAYS_CONTENT_ERROR', [error as string]);
      return Promise.reject({messageName: 'SCAN_ERROR_FACEBOOK_BIRTHDAYS_CONTENT', error: {error, response: text}});
    }
  }

  /**
   * Extract facebook token from fetched facebook page, handle errors
   *
   * @param page - page content
   */
  async function extractFacebookTokens(page: string): Promise<{ token: string; language: string; asyncToken: string }> {
    const token = extractTokenFromPage(page);
    const asyncToken = extractAsyncTokenFromPage(page);
    const language = extractLanguageFromPage(page);

    // No token found, report an error, quit
    if ('string' !== typeof token) {
      sendScanLog('SCAN_LOG_EXTRACT_TOKEN_ERROR');
      return Promise.reject({messageName: 'SCAN_ERROR_NO_TOKEN_DETECTED'});
    }

    // No async token found, report an error, quit
    if ('string' !== typeof asyncToken) {
      sendScanLog('SCAN_LOG_EXTRACT_ASYNC_TOKEN_ERROR');
      return Promise.reject({messageName: 'SCAN_ERROR_NO_ASYNC_TOKEN_DETECTED'});
    }

    if (!findLanguageSetByLanguage(language)) {
      sendScanLog('SCAN_LOG_CHECK_LOGIN_ERROR_LANGUAGE');
      return Promise.reject({messageName: 'SCAN_ERROR_NOT_SUPPORTED_LANGUAGE'});
    }
    return {token, language, asyncToken};
  }

  /**
   * Extract user birthdays info from previously fetched data
   *
   * @param response - previously fetched json with user birthday data
   * @param languageSet - language set according to the page locale
   */
  async function extractBirthdays(response: any, languageSet: LanguageSet) {
    sendScanLog('SCAN_LOG_EXTRACT_BIRTHDAYS');
    try {
      const items = extractBirthdayDataFromHtml(response);
      return generateBirthdaysFromRaw(items, languageSet);
    } catch (error) {
      sendScanLog('SCAN_LOG_EXTRACT_BIRTHDAYS_ERROR', [error as string]);
      return Promise.reject({messageName: 'SCAN_ERROR_BIRTHDAYS_EXTRACT', error});
    }
  }


  function concatPromise<T = any>(...promises: Array<() => Promise<any>>): Promise<Array<T>> {
    if (!promises.length) {
      return Promise.resolve([]);
    }
    return promises.reduce((ac, promise) => {
      return ac.then(r => promise().then(r2 => r.concat(r2)));
    }, Promise.resolve([]));
  }

  return responseId;
};
