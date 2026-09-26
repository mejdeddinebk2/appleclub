import Image from 'next/image';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { ArrowRightIcon, BulbIcon, CodeIcon, TrophyIcon, type IconProps } from '@/components/icons';
import { Card } from '@/components/ui/Card';
import type { Activity, ActivityCategory } from '@/lib/types';
import { asset, cn } from '@/lib/utils';

// Full class strings so Tailwind can detect them.
const categoryStyles: Record<ActivityCategory, { icon: ComponentType<IconProps>; gradient: string }> = {
  Workshop: { icon: CodeIcon, gradient: 'from-sky-400 to-blue-600' },
  Hackathon: { icon: TrophyIcon, gradient: 'from-indigo-400 to-violet-600' },
  Project: { icon: BulbIcon, gradient: 'from-cyan-400 to-teal-600' },
};

// Fixed locale + UTC so server and client render the same string.
const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
}

const linkClasses =
  'mt-6 inline-flex w-fit items-center gap-1 rounded-full text-sm font-medium text-accent hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-accent-light';

export function ActivityCard({ activity }: { activity: Activity }) {
  const { icon: Icon, gradient } = categoryStyles[activity.category];
  const { link } = activity;
  const isExternal = link ? /^https?:\/\//.test(link.href) : false;
  const linkContent = link && (
    <>
      {link.label ?? 'Learn more'}
      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  return (
    <Card padded={false} className="group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden">
        {activity.image ? (
          <Image
            src={asset(activity.image)}
            alt={activity.imageAlt ?? activity.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized={activity.image.endsWith('.svg')}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div aria-hidden className={cn('flex h-full w-full items-center justify-center bg-gradient-to-br', gradient)}>
            <Icon className="h-14 w-14 text-white/90 transition-transform duration-700 ease-out group-hover:scale-110" />
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-neutral-900 backdrop-blur dark:bg-black/60 dark:text-white">
          {activity.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-8">
        <time dateTime={activity.date} className="text-sm text-neutral-500 dark:text-neutral-400">
          {formatDate(activity.date)}
        </time>
        <h3 className="mt-2 text-xl font-semibold tracking-tight">{activity.title}</h3>
        <p className="mt-3 flex-1 text-pretty leading-relaxed text-neutral-600 dark:text-neutral-400">
          {activity.description}
        </p>

        {activity.tags && activity.tags.length > 0 && (
          <ul aria-label="Tags" className="mt-5 flex flex-wrap gap-2">
            {activity.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

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
