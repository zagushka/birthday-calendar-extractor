## ![Birthday Calendar Extractor for Facebook](public/icons/icon.48.png) [Birthday Calendar Extractor for Facebook](https://chrome.google.com/webstore/detail/birthday-calendar-extract/imielmggcccenhgncmpjlehemlinhjjo)

Generate a calendar with all your facebook friends birthdays.
The generated calendar file is saved in `ICS` or `CSV` formats.

## Builds
| Command  | Result |
|---|---|
| npm run build | Build extension and pack it to `birthday-calendar-exporter.zip` |  
| npm start | Build extension in dev mode |  
| npm run watch | Build extension in dev mode with `watch` |  
| npm run watch:hmr | Build extension in dev mode with `watch` and hot module replacement |  

## Extractor

### How to use
Click on extension icon and select one of the required formats:
- Generate Google Calendar - ICS is a universal calendar format used by Microsoft Outlook, Google Calendar, and Apple Calendar.
- Generate Excel file - CSV
- Remove from Google Calendar - ICS file used to remove previously imported birthday events.

At the end of the process a file named `birthday-calendar.ics` will be downloaded automatically to your Downloads folder.
Use the generated file to import your friends birthdays to your calendar program.

I suggest creating a new Birthday themed sub-calendar and use it for imports.

### FAQ

| Question | Answer |
|---|---|
| I accidentally saved birthdays to my main calendar, how to reverse it? | Click on extension icon and select "Remove from Google Calendar". A file named `delete-birthday-calendar.ics` will be downloaded. Import the file to your calendar |
| Is it possible to remove some of the contacts before importing to calendar? | There is command line tool you can use: [guenter-r/calendar_file_splitter](https://github.com/guenter-r/calendar_file_splitter) |


### Big Thanks 
@marciozomb13 for adding Portuguese translations.

### P.S
It is open source, feel free to check it and contribute here: https://github.com/zagushka/birthday-calendar-extractor
