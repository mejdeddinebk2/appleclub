'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRightIcon, CalendarIcon, MapPinIcon } from '@/components/icons';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { events } from '@/data/events';
import { members } from '@/data/members';
import { stats, techStack } from '@/data/site';
import { eventStartIso, splitEvents } from '@/lib/events';
import { asset, cn } from '@/lib/utils';

const label = 'text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** Live countdown to the next event (or a "last event" recap when none is scheduled). */
function CountdownTile() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { upcoming, past } = splitEvents(events, now ?? 0);
  const next = now ? upcoming[0] : undefined;
  const last = past[0];

  if (now && next) {
    const diff = Math.max(0, Date.parse(eventStartIso(next)) - now);
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    const units: Array<[string, string]> = [
      [String(d), 'days'],
      [pad(h), 'hrs'],
      [pad(m), 'min'],
      [pad(s), 'sec'],
    ];
    return (
      <>
        <p className={label}>
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500 align-middle" />
          Next event
        </p>
        <p className="mt-3 line-clamp-2 text-lg font-semibold leading-tight tracking-tight">{next.title}</p>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center" role="timer" aria-label="Time until the next event">
          {units.map(([v, u]) => (
            <div key={u} className="rounded-xl bg-black/[0.04] py-2 dark:bg-white/[0.07]">
              <p className="text-xl font-semibold tabular-nums tracking-tight">{v}</p>
              <p className="text-[9px] uppercase tracking-wider text-neutral-500">{u}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <MapPinIcon className="h-3.5 w-3.5" /> {next.location}
        </p>
      </>
    );
  }

  const days = last && now ? Math.max(0, Math.floor((now - Date.parse(eventStartIso(last))) / 86_400_000)) : null;
  return (
    <>
      <p className={label}>
        <CalendarIcon className="mr-2 inline h-3.5 w-3.5 align-[-2px]" />
        {last ? 'Last event' : 'Events'}
      </p>
      <p className="mt-3 line-clamp-3 text-lg font-semibold leading-tight tracking-tight">
        {last ? last.title : 'New events are on the way.'}
      </p>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {days !== null ? `${days} days ago — the next one is being planned.` : 'Follow us to be the first to know.'}
      </p>
      <p className="mt-auto pt-4 text-sm font-medium text-accent dark:text-accent-light">Stay tuned ✨</p>
    </>
  );
}

const BARS = [38, 52, 44, 70, 62, 88];
const ICON_GRADIENTS = [
  'from-sky-400 to-blue-600',
  'from-fuchsia-400 to-purple-600',
  'from-amber-300 to-orange-500',
  'from-emerald-300 to-teal-600',
];

export function Bento() {
  const [membersStat, workshopsStat, hackathonsStat, projectsStat] = stats;
  const faces = members.filter((m) => m.photo).slice(0, 7);
  const chips = [...techStack, ...techStack];

  return (
    <Section id="club-at-a-glance">
      <Reveal>
        <SectionHeading
          eyebrow="The club"
          title="Small club. Big energy."
          description="A quick look at what we have built together so far."
        />
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:[grid-auto-rows:minmax(11rem,auto)]">
        {/* 1 — photo + members */}
        <Reveal className="h-full sm:col-span-2 lg:row-span-2">
          <Card fill padded={false} className="h-full min-h-[20rem] sm:min-h-[22rem]">
            <Image
              src={asset('/images/gallery/epi-sup-lineup.jpg')}
              alt="Apple Club EPI members lined up at their booth"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[50%_35%] transition-transform duration-700 group-hover/card:scale-105"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="glass glass-spec squircle absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-2xl px-5 py-4 sm:inset-x-6 sm:bottom-6">
              <div className="relative z-10">
                <p className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  <AnimatedNumber value={membersStat.value} />
                </p>
                <p className="mt-0.5 text-sm font-medium text-neutral-600 dark:text-neutral-300">{membersStat.label}</p>
              </div>
              <span className="relative z-10 hidden -space-x-3 sm:flex" aria-hidden>
                {faces.slice(0, 5).map((m) => (
                  <span key={m.id} className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/70 dark:ring-black/60">
                    <Image src={asset(m.photo!)} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                ))}
              </span>
            </div>
          </Card>
        </Reveal>

        {/* 2 — workshops */}
        <Reveal className="h-full">
          <Card fill padded={false} className="h-full p-6">
            <p className={label}>{workshopsStat.label}</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight">
              <AnimatedNumber value={workshopsStat.value} />
            </p>
            <div className="mt-auto flex h-20 items-end gap-1.5 pt-4" aria-hidden>
              {BARS.map((h, i) => (
                <span
                  key={i}
                  className="bar-rise flex-1 rounded-t-md bg-gradient-to-t from-accent to-accent-light"
                  style={{ ['--h' as string]: `${h}%`, ['--d' as string]: `${i * 90}ms` }}
                />
              ))}
            </div>
          </Card>
        </Reveal>

        {/* 3 — countdown */}
        <Reveal className="h-full" delay={80}>
          <Card fill padded={false} className="h-full p-6">
            <CountdownTile />
          </Card>
        </Reveal>

        {/* 4 — hackathons */}
        <Reveal className="h-full" delay={120}>
          <Card fill padded={false} className="h-full p-6">
            <p className={label}>{hackathonsStat.label}</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-5xl font-semibold tracking-tight">
                <AnimatedNumber value={hackathonsStat.value} />
              </p>
              <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0 -rotate-90" aria-hidden>
                <circle cx="50" cy="50" r="42" fill="none" strokeWidth="9" className="stroke-black/[0.07] dark:stroke-white/10" />
                <circle
                  className="ring-draw stroke-accent"
                  style={{ ['--ring' as string]: 60 }}
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="mt-auto pt-4 text-sm text-neutral-500 dark:text-neutral-400">Overnight sprints where ideas become prototypes.</p>
          </Card>
        </Reveal>

        {/* 5 — projects */}
        <Reveal className="h-full" delay={160}>
          <Card fill padded={false} className="h-full p-6">
            <p className={label}>{projectsStat.label}</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight">
              <AnimatedNumber value={projectsStat.value} />
            </p>
            <div className="mt-auto flex items-center pt-5" aria-hidden>
              {ICON_GRADIENTS.map((g, i) => (
                <span
                  key={g}
                  className={cn('icon-fan h-12 w-12 shrink-0 rounded-[0.85rem] bg-gradient-to-br shadow-lg ring-2 ring-white dark:ring-neutral-900', g)}
                  style={{
                    marginLeft: i === 0 ? 0 : -14,
                    ['--x' as string]: `${i * 6}px`,
                    ['--r' as string]: `${(i - 1.5) * 7}deg`,
                    ['--d' as string]: `${i * 90}ms`,
                  }}
                />
              ))}
            </div>
          </Card>
        </Reveal>

        {/* 6 — join the crew */}
        <Reveal className="h-full sm:col-span-1 lg:col-span-2" delay={80}>
          <Card fill padded={false} className="h-full p-6 sm:p-8" innerClassName="justify-between gap-6">
            <div>
              <p className={label}>The crew</p>
              <p className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                Builders, designers, organizers — and room for you.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="flex -space-x-3" aria-hidden>
                {faces.map((m) => (
                  <span key={m.id} className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-neutral-50 dark:ring-neutral-900">
                    <Image src={asset(m.photo!)} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                ))}
              </span>
              <ButtonLink href="/members" variant="outline" size="sm" className="group">
                Meet the team
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
            </div>
          </Card>
        </Reveal>

        {/* 7 — tech chips */}
        <Reveal className="h-full sm:col-span-1 lg:col-span-2" delay={120}>
          <Card fill padded={false} className="h-full min-h-[11rem] min-w-0 py-6" innerClassName="min-w-0 justify-center gap-3">
            <p className={cn(label, 'px-6 sm:px-8')}>Our toolbox</p>
            <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
              <div className="marquee-slow flex w-max gap-2.5 py-1">
                {chips.map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
              <div className="marquee-reverse flex w-max gap-2.5 py-1">
                {[...chips].reverse().map((t, i) => (
                  <span
                    key={`${t}-r-${i}`}
                    className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
