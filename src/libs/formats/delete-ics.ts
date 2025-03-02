import { PreparedEvent } from "@/libs/lib";
import { CalendarICS } from "./ics";

export class CalendarDeleteICS extends CalendarICS {
  readonly filename: string = "delete-birthday-calendar.ics";

  readonly fileMimeType: string = "text/calendar; charset=UTF-8";

  generateEvent(event: PreparedEvent) {
    const formattedEvent = this.formatEvent(event);
    return (
      `BEGIN:VEVENT
DTSTART;VALUE=DATE:${formattedEvent.start}
DTEND;VALUE=DATE:${formattedEvent.end}
RRULE:FREQ=YEARLY
DTSTAMP:${formattedEvent.stamp}
UID:${formattedEvent.uid}
X-GOOGLE-CALENDAR-CONTENT-DISPLAY:chip
DESCRIPTION:This is <a href='${formattedEvent.href}'>${formattedEvent.name}</a> birthday!
SEQUENCE:0
METHOD:CANCEL
STATUS:CANCELLED
` +
      // There is unicode cake character before event.name, you may not see it in you editor
      `SUMMARY:🎂 ${formattedEvent.name}
TRANSP:TRANSPARENT
END:VEVENT`
    );
  }
}
