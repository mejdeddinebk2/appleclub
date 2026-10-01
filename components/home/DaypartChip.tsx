'use client';

import { useEffect, useState } from 'react';

function greeting(hour: number): { emoji: string; text: string } {
  if (hour >= 5 && hour < 12) return { emoji: '🌅', text: 'Good morning, builder' };
  if (hour >= 12 && hour < 18) return { emoji: '☀️', text: 'Good afternoon, builder' };
  if (hour >= 18 && hour < 22) return { emoji: '🌇', text: 'Good evening, builder' };
  return { emoji: '🌙', text: 'Burning the midnight oil?' };
}

/** Small glass chip that greets the visitor by their local time of day. */
export function DaypartChip() {
  const [g, setG] = useState<{ emoji: string; text: string } | null>(null);

  useEffect(() => {
    setG(greeting(new Date().getHours()));
  }, []);

  return (
    <span
      className={`glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-neutral-700 transition-opacity duration-700 sm:text-sm dark:text-neutral-200 ${g ? 'opacity-100' : 'opacity-0'}`}
    >
      <span aria-hidden>{g?.emoji ?? '👋'}</span>
      {g?.text ?? 'Welcome'}
    </span>
  );
}
