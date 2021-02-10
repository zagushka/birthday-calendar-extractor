import {
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { updateBadge } from './libs/badge';
import {
  sendError,
  SendScanLog,
  updateBadgeAction,
} from './libs/events/actions';
import { setupAlarms } from './libs/events/alarms';
import {
  listenTo,
  sendMessage,
} from './libs/events/events';
import {
  ALARM_NEW_DAY,
  BADGE_CLICKED,
  BIRTHDAYS_START_SCAN,
  CREATE_CALENDAR_CSV,
  CREATE_CALENDAR_DELETE_ICS,
  CREATE_CALENDAR_ICS,
  CREATE_CALENDAR_JSON,
  DISABLE_BADGE_NOTIFICATION,
  UPDATE_BADGE,
} from './libs/events/types';
import { CalendarCSV } from './libs/formats/csv';
import { CalendarDeleteICS } from './libs/formats/delete-ics';
import { CalendarICS } from './libs/formats/ics';
import { CalendarJSON } from './libs/formats/json';
import {
  forceBirthdaysScan,
  getBirthdaysList,
  sendScanLog,
} from './libs/lib';
import {
  storeLastBadgeClicked,
  storeUserSettings,
} from './libs/storage/chrome.storage';
//
// chrome.webRequest.onBeforeSendHeaders.addListener(
//   (details) => {
//     const newRef = 'https://www.facebook.com/events/birthdays';
//     const newOrigin = 'https://www.facebook.com';
//
//     const refId = details.requestHeaders.findIndex(header => header.name.toLowerCase() === 'referrer');
//     const originId = details.requestHeaders.findIndex(header => header.name.toLowerCase() === 'origin');
//
//     if (~refId) {
//       details.requestHeaders[refId].value = newRef;
//     } else {
//       details.requestHeaders.push({name: 'referer', value: newRef});
//     }
//
//     if (~originId) {
//       details.requestHeaders[originId].value = newOrigin;
//     } else {
//       details.requestHeaders.push({name: 'origin', value: newOrigin});
//     }
//     console.log(details.requestHeaders);
//     return {requestHeaders: details.requestHeaders};
//   },
//   {urls: ['<all_urls>']},
//   [
//     'requestHeaders',
//     'extraHeaders',
//     'blocking',
//   ],
// );

// On Badge Click update last time badge clicked
listenTo(BADGE_CLICKED)
  .subscribe(() => {

    const fun = () => {
      const id = 100;
      fetch('https://www.facebook.com/api/graphql/', {
        'headers': {
          'accept': '*/*',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded',
          'pragma': 'no-cache',
          'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
        },
        'referrer': 'https://www.facebook.com/events/birthdays',
        'referrerPolicy': 'strict-origin-when-cross-origin',
        'body': '__a=1&__dyn=7AzHxqU5a5Q2m3mbG2KnFw9uu2i5U4e2O1szEdEc88EW3K1uwJxS1Az8bo6u3y4o0B-q7oc81t8gxOfw9q2210x-8wgolzUO0-E4a3aUS2G2Cawso8Uy1PwBgK7qxS18wc61axe3e9xy48aU8od8-UqwsUkxe2GewGwkUtxGm2SUnxq5olwUwHxm4-5pUfEe87248mwHwLwOw&__csr=gsiMP6Nsd8Yt5PiiOjOhhcnl8xa2DbsRWXnPmmLH5InsWiRpQCBHRvLQO27-ABp9B8liIxaJrhb-GApqhqhkmAiiXKhrASlfHty5J6mKp7VrGBZpqLhrVkhqy9ozAG_l4h9FFFEGAnAAgJoPCHXKQi-9y8GqQE_y2bFoZAzEF2E8rmi7VLQ-dmQaG9Ki8DUKEFrghUWnz8F2Jyry8ggDxCGgaoyV9qxCfAB_XKu8iyuu7axjwIGaK5p9FutfJWyk25e7UpgGECqfGEmLDAFwEx6umXh4VHxfBGu58g-18mbG5FojDh8ixC9zK5UNe2KFEW3q5Ed42Kdxi2i3Scye6pXz808X80Ty01azQoCjDEqmh0g84C0GEeocE8PG747YEjAwlC0Vo0gawd11C1mwjp8aUG7EO4aoGQAGzpk7V82dxWbw990aswuw4KxO31331mcw2cU0Ju04242u7U3RU1oFo&__req=2f&__beoa=0&__pc=EXP2%3Acomet_pkg&dpr=1&__ccg=GOOD&__rev=1003278299&__s=ryyfbu%3Acuhhla%3Atkpym0&__hsi=6926955939733881946-0&__comet_req=1&fb_dtsg=AQE8GUejsNZ4%3AAQHp9WU-UtD6&jazoest=21954&__spin_r=1003278299&__spin_b=trunk&__spin_t=1612807610&__jssesw=1&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BirthdayCometMonthlyBirthdaysRefetchQuery&variables=%7B%22count%22%3A2%2C%22cursor%22%3A%222%22%2C%22offset_month%22%3A2%7D&server_timestamps=true&doc_id=3681233908586032',
        'method': 'POST',
        'mode': 'no-cors',
        'credentials': 'include',
      })
        .then((r) => r.text())
        .then(r => {
          console.log(r);
          chrome.runtime.sendMessage({responseId: id, payload: r});
        });
      return {type: 'web-reply', id};
    };

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currTab = tabs[0];
      if (currTab) { // Sanity check
        // @ts-ignore
        chrome.scripting.executeScript({
            // @ts-ignore
            target: {tabId: currTab.id},
            function: fun,
          },
          (injectionResults: Array<any>) => {
            for (const {result} of injectionResults){
              if(result.type === 'web-reply'){
                chrome.runtime.onMessage.addListener((action) => {
                  console.log(result, action);
                });
              }
              console.log('Frame Title: ', result);
            }
          });
      }
    });


    // storeLastBadgeClicked()
    //   .subscribe(() => {
    //     sendMessage(updateBadgeAction(), true);
    //   });
  });

// Update Badge on badge update request or new date alarm
listenTo(UPDATE_BADGE, ALARM_NEW_DAY)
  .pipe(
    startWith(true), // Initial Badge setup
  )
  .subscribe(() => updateBadge());

// Take care of disable badge event
listenTo(DISABLE_BADGE_NOTIFICATION)
  .subscribe(() => {
    storeUserSettings({
      birthdays: [],
      activated: false,
    })
      .subscribe(() => {
        // Update badge it should be clean
        sendMessage(updateBadgeAction(), true);
      });
  });

// Tell to tha app new data was fetched and request to update the badge
// Should be done via local storage update
// sendMessage(updateBadgeAction(), true);

listenTo(BIRTHDAYS_START_SCAN)
  .subscribe(() => {
    sendScanLog('SCAN_LOG_PROCESS_STARTED');
    // Update local storage, set scanning true
    storeUserSettings({scanning: true})
      .pipe(
        // Force scan
        switchMap(() => forceBirthdaysScan()),
      )
      .subscribe(
        birthdays => {
          sendScanLog('SCAN_LOG_PROCESS_DONE');
          storeUserSettings({scanning: false, scanSuccess: true}, true);
        },
        error => {
          sendMessage(SendScanLog(error), true);
          storeUserSettings({scanning: false, scanSuccess: false}, true);
        },
      );
  });

listenTo(
  CREATE_CALENDAR_CSV,
  CREATE_CALENDAR_ICS,
  CREATE_CALENDAR_DELETE_ICS,
  CREATE_CALENDAR_JSON,
)
  .subscribe(({action, callback}) => {
    // Start
    getBirthdaysList()
      .pipe(
        map(events => {
          const rawEvents = Array.from(events.values());
          switch (action.type) {
            case CREATE_CALENDAR_CSV: {
              const calendar = new CalendarCSV(action.payload);
              return calendar.save(calendar.generateCalendar(rawEvents));
            }
            case CREATE_CALENDAR_JSON: {
              const calendar = new CalendarJSON();
              return calendar.save(calendar.generateCalendar(rawEvents));
            }
            case CREATE_CALENDAR_ICS: {
              const calendar = new CalendarICS(action.payload);
              return calendar.save(calendar.generateCalendar(rawEvents));
            }
            case CREATE_CALENDAR_DELETE_ICS: {
              const calendar = new CalendarDeleteICS(action.payload);
              return calendar.save(calendar.generateCalendar(rawEvents));
            }
          }
        }),
      )
      .subscribe(
        // @TODO REFACTOR
        () => sendMessage(sendError('DONE')),
        (error) => {
          sendMessage(sendError(error));
          callback();
        },
        () => callback(),
      );
  });

chrome.runtime.onStartup.addListener(() => {
  storeUserSettings({scanning: false}, true);
  setupAlarms();
});
