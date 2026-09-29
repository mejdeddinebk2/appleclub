import Image from 'next/image';
import { InstagramIcon } from '@/components/icons';
import { Reveal } from '@/components/ui/Reveal';
import { siteConfig } from '@/data/site';
import { asset } from '@/lib/utils';

/**
 * Centered, photo-led spotlight for the club's faculty advisor — a standalone
 * feature rather than a small side note, so it reads as a real credit.
 */
export function AdvisorSpotlight() {
  return (
    <Reveal>
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-[2rem] border border-neutral-200/70 bg-neutral-50 px-8 py-14 text-center dark:border-neutral-800 dark:bg-neutral-900/60 sm:px-14">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent dark:text-accent-light">
          Encadrement
        </p>

        <div className="relative mt-8">
          <div
            aria-hidden
            className="animate-pulse-slow absolute inset-0 -z-10 scale-110 rounded-full bg-accent/25 blur-xl"
          />
          <div className="tilt-card group relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-white shadow-xl dark:ring-neutral-900">
            <Image
              src={asset('/images/advisor/nahla-baccar.jpg')}
              alt={siteConfig.teacherAdvisor.name}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
        </div>

        <p className="mt-6 text-2xl font-semibold tracking-tight">{siteConfig.teacherAdvisor.name}</p>
        <p className="mt-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {siteConfig.teacherAdvisor.role}
        </p>
        <p className="mx-auto mt-5 max-w-sm text-pretty leading-relaxed text-neutral-600 dark:text-neutral-400">
          The teacher who backs every workshop, every hackathon night, and every idea we take a chance on.
        </p>

        {siteConfig.teacherAdvisor.instagram && (
          <a
            href={siteConfig.teacherAdvisor.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-neutral-200/70 px-4 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-accent/40 hover:text-accent dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-accent-light"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
            Instagram
          </a>
        )}
      </div>
    </Reveal>
  );
}
