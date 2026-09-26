import type { ClubEvent } from '@/lib/types';

/** Event dates and times are entered in Tunisia local time (UTC+1, no daylight saving). */
export const EVENT_UTC_OFFSET = '+01:00';
export const EVENT_TIME_ZONE_LABEL = 'Tunisia time (GMT+1)';

export function eventStartIso(event: ClubEvent): string {
  return `${event.date}T${event.startTime}:00${EVENT_UTC_OFFSET}`;
}

/** End of the event, or end of its day when no end time is set. */
export function eventEndTimestamp(event: ClubEvent): number {
  return Date.parse(`${event.date}T${event.endTime ?? '23:59'}:00${EVENT_UTC_OFFSET}`);
}

/** Upcoming events (soonest first) and past events (most recent first). */
export function splitEvents(events: ClubEvent[], now: number): { upcoming: ClubEvent[]; past: ClubEvent[] } {
  const upcoming: ClubEvent[] = [];
  const past: ClubEvent[] = [];

  for (const event of events) {
    (eventEndTimestamp(event) < now ? past : upcoming).push(event);
  }

  const byStart = (a: ClubEvent, b: ClubEvent) => eventStartIso(a).localeCompare(eventStartIso(b));
  upcoming.sort(byStart);
  past.sort((a, b) => byStart(b, a));

  return { upcoming, past };
}

// Dates are anchored at noon UTC and formatted in UTC so server and browser always render the same text.
const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });
const dayFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'UTC' });

export function formatEventDate(date: string) {
  const parsed = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return { full: date, month: '', day: '' };
  return {
    full: fullDateFormatter.format(parsed),
    month: monthFormatter.format(parsed),
    day: dayFormatter.format(parsed),
  };
}

export function formatEventTime(event: ClubEvent): string {
  return event.endTime ? `${event.startTime} – ${event.endTime}` : event.startTime;
}
