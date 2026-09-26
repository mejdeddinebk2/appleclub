'use client';

import { useMemo, useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import type { Activity, ActivityCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ActivityCard } from './ActivityCard';

type Filter = 'All' | ActivityCategory;

interface ActivitiesExplorerProps {
  activities: Activity[];
  categories: ActivityCategory[];
}

const filterLabel = (filter: Filter) => (filter === 'All' ? 'All' : `${filter}s`);

/** Category filter pills + responsive grid of activity cards. */
export function ActivitiesExplorer({ activities, categories }: ActivitiesExplorerProps) {
  const [filter, setFilter] = useState<Filter>('All');

  const counts = useMemo(() => {
    const result: Partial<Record<Filter, number>> = { All: activities.length };
    for (const activity of activities) {
      result[activity.category] = (result[activity.category] ?? 0) + 1;
    }
    return result;
  }, [activities]);

  const filters: Filter[] = ['All', ...categories.filter((category) => counts[category])];
  const visible = filter === 'All' ? activities : activities.filter((activity) => activity.category === filter);

  return (
    <>
      {filters.length > 2 && (
        <div role="group" aria-label="Filter activities by category" className="flex flex-wrap justify-center gap-2">
          {filters.map((item) => {
            const active = item === filter;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black',
                  active
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white',
                )}
              >
                {filterLabel(item)}
                <span className={cn('ml-1.5', active ? 'opacity-60' : 'text-neutral-400 dark:text-neutral-500')}>
                  {counts[item]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {`Showing ${visible.length} ${visible.length === 1 ? 'activity' : 'activities'}`}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((activity, i) => (
            <li key={activity.id}>
              <Reveal delay={Math.min(i, 5) * 80} className="h-full">
                <ActivityCard activity={activity} />
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-center text-neutral-500">No activities to show yet. Check back soon.</p>
      )}
    </>
  );
}
