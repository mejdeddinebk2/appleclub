'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { EVENT_TIME_ZONE_LABEL, splitEvents } from '@/lib/events';
import type { ClubEvent } from '@/lib/types';
import { EventCard } from './EventCard';

interface EventsTimelineProps {
  events: ClubEvent[];
  /** Time the page was rendered. Used for the first render so server and client HTML match. */
  renderedAt: number;
}

function GroupHeading({ id, title, count, note }: { id: string; title: string; count: number; note?: string }) {
  return (
    <div className="flex flex-col gap-2 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-neutral-800">
      <div>
        <h2 id={id} className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {note && <p className="mt-2 text-neutral-600 dark:text-neutral-400">{note}</p>}
      </div>
      <p className="text-sm text-neutral-500">
        {count} {count === 1 ? 'event' : 'events'}
      </p>
    </div>
  );
}

/**
 * Splits events into upcoming and past. The split is recomputed in the browser after mount,
 * so a statically exported page stays correct long after it was built.
 */
export function EventsTimeline({ events, renderedAt }: EventsTimelineProps) {
  const [now, setNow] = useState(renderedAt);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  const { upcoming, past } = useMemo(() => splitEvents(events, now), [events, now]);

  return (
    <>
      <Section id="upcoming" className="scroll-mt-20 pt-0 sm:pt-0">
        <Reveal>
          <GroupHeading
            id="upcoming-heading"
            title="Upcoming"
            count={upcoming.length}
            note={`All times are in ${EVENT_TIME_ZONE_LABEL}.`}
          />
        </Reveal>

        {upcoming.length > 0 ? (
          <ul aria-labelledby="upcoming-heading" className="mt-10 grid gap-6 lg:grid-cols-2">
            {upcoming.map((event, i) => (
              <li key={event.id}>
                <Reveal delay={Math.min(i, 5) * 80} className="h-full">
                  <EventCard event={event} />
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <Reveal>
            <Card interactive={false} className="mt-10 flex flex-col items-center text-center">
              <p className="text-lg font-semibold tracking-tight">No upcoming events right now.</p>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Follow us to be the first to hear about the next one.
              </p>
              <SocialLinks showLabels className="mt-4 justify-center gap-2" linkClassName="px-3" />
            </Card>
          </Reveal>
        )}
      </Section>

      {past.length > 0 && (
        <Section id="past" className="scroll-mt-20 pt-0 sm:pt-0">
          <Reveal>
            <GroupHeading id="past-heading" title="Past events" count={past.length} />
          </Reveal>
          <ul aria-labelledby="past-heading" className="mt-10 grid gap-6 lg:grid-cols-2">
            {past.map((event, i) => (
              <li key={event.id}>
                <Reveal delay={Math.min(i, 5) * 80} className="h-full">
                  <EventCard event={event} past />
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
