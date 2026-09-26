import Link from 'next/link';
import { ArrowRightIcon, CalendarIcon, ClockIcon, MapPinIcon } from '@/components/icons';
import { Card } from '@/components/ui/Card';
import { eventStartIso, formatEventDate, formatEventTime } from '@/lib/events';
import type { ClubEvent } from '@/lib/types';
import { cn } from '@/lib/utils';

const linkClasses =
  'mt-6 inline-flex w-fit items-center gap-1 rounded-full text-sm font-medium text-accent hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-accent-light';

interface EventCardProps {
  event: ClubEvent;
  past?: boolean;
}

export function EventCard({ event, past = false }: EventCardProps) {
  const date = formatEventDate(event.date);
  const { link } = event;
  const isExternal = link ? /^https?:\/\//.test(link.href) : false;
  const linkContent = link && (
    <>
      {link.label ?? 'Learn more'}
      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  return (
    <Card interactive={!past} className="group flex h-full flex-col gap-6 sm:flex-row sm:gap-8">
      {/* Calendar tile */}
      <div
        aria-hidden
        className={cn(
          'flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border text-center transition-colors duration-500',
          past
            ? 'border-neutral-200 bg-white text-neutral-400 dark:border-neutral-800 dark:bg-black dark:text-neutral-500'
            : 'border-accent/20 bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white dark:text-accent-light dark:group-hover:text-white',
        )}
      >
        <span className="text-xs font-semibold uppercase tracking-wider">{date.month}</span>
        <span className="text-3xl font-semibold leading-none tracking-tight">{date.day}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-neutral-200/60 px-2.5 py-0.5 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            {event.type}
          </span>
          {past && (
            <span className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-medium text-neutral-500 dark:border-neutral-800">
              Past
            </span>
          )}
        </div>

        <h3 className="mt-3 text-xl font-semibold tracking-tight">{event.title}</h3>

        <dl className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-start gap-2">
            <dt className="mt-0.5 shrink-0">
              <CalendarIcon className="h-4 w-4" />
              <span className="sr-only">Date</span>
            </dt>
            <dd>
              <time dateTime={eventStartIso(event)}>{date.full}</time>
            </dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="mt-0.5 shrink-0">
              <ClockIcon className="h-4 w-4" />
              <span className="sr-only">Time</span>
            </dt>
            <dd className="tabular-nums">{formatEventTime(event)}</dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="mt-0.5 shrink-0">
              <MapPinIcon className="h-4 w-4" />
              <span className="sr-only">Location</span>
            </dt>
            <dd>{event.location}</dd>
          </div>
        </dl>

        <p className="mt-4 flex-1 text-pretty leading-relaxed text-neutral-600 dark:text-neutral-400">
          {event.description}
        </p>

        {link &&
          (isExternal ? (
            <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClasses}>
              {linkContent}
            </a>
          ) : (
            <Link href={link.href} className={linkClasses}>
              {linkContent}
            </Link>
          ))}
      </div>
    </Card>
  );
}
