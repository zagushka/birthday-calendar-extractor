## ![Birthday Calendar Extractor for Facebook](public/icons/icon.48.png) Birthday Calendar Extractor for Facebook

This extension helps to create calendar with all your facebook friends birthdays for a next two years.

Generated calendar file saved in `ICS` - a universal calendar format used by several email and calendar programs, including Microsoft Outlook, Google Calendar, and Apple Calendar.

##Important!
**There is no easy way to remove birthday events from the calendar later!**

At your calendar I suggest to create a new Birthday themed sub-calendar and use it for imports. 

##How to use
1. Navigate to https://www.facebook.com/events/birthday
2. Click on **Save Birthday Calendar** link under **Find Events** on the left column of the page. 
Reload the page if you unable to locate the link.
3. Wait for extension to scroll down and generate the calendar.
4. File named `birthday-calendar.ics` will be downloaded automatically to your Downloads folder.
5. Use generated file to export your friends' birthdays to your calendar program.

##Things to improve
It is open source, feel free to check it here: https://github.com/zagushka/birthday-calendar-extractor
* Currently extension is not loaded automatically when navigated to the birthdays events page form other Facebook page.
* Option to edit birthdays before generating the calendar file.
* Leap years February 29 birthdays.
* Get rid of [luxon](https://moment.github.io/luxon/) to reduce bundle size.
* Direct export to Google Calendar.

