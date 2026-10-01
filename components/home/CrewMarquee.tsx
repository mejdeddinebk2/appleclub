import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { members } from '@/data/members';
import type { Member } from '@/lib/types';
import { asset, cn, getInitials, hashString } from '@/lib/utils';

const gradients = [
  'from-sky-400 to-blue-600',
  'from-indigo-400 to-violet-600',
  'from-cyan-400 to-sky-600',
  'from-violet-400 to-fuchsia-600',
  'from-teal-400 to-cyan-600',
];

function Face({ member }: { member: Member }) {
  const first = member.name.split(' ')[0];
  return (
    <Link
      href="/members"
      data-cursor="Meet"
      aria-label={`${member.name}, ${member.role}`}
      className="group flex w-24 shrink-0 flex-col items-center gap-2 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:w-28"
    >
      <span className="relative block h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full ring-2 ring-white shadow-lg transition-transform duration-500 group-hover:scale-110 sm:h-24 sm:w-24 dark:ring-neutral-800">
        {member.photo ? (
          <Image src={asset(member.photo)} alt="" fill sizes="96px" className="object-cover" />
        ) : (
          <span
            className={cn(
              'flex h-full w-full items-center justify-center bg-gradient-to-br text-xl font-semibold text-white',
              gradients[hashString(member.name) % gradients.length],
            )}
          >
            {getInitials(member.name)}
          </span>
        )}
      </span>
      <span className="max-w-full truncate text-xs font-medium text-neutral-600 dark:text-neutral-300">{first}</span>
    </Link>
  );
}

/** Two rows of member avatars drifting in opposite directions — the club feels alive. */
export function CrewMarquee() {
  if (members.length === 0) return null;
  const rowA = [...members, ...members];
  const rowB = [...members].reverse();
  const rowBDoubled = [...rowB, ...rowB];

  return (
    <section aria-label="Club members" className="overflow-hidden py-14 sm:py-20">
      <Reveal>
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          The people behind the club
        </p>
      </Reveal>
      <div className="space-y-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-slow flex w-max gap-4 sm:gap-6">
          {rowA.map((m, i) => (
            <Face key={`a-${m.id}-${i}`} member={m} />
          ))}
        </div>
        <div className="marquee-reverse flex w-max gap-4 sm:gap-6">
          {rowBDoubled.map((m, i) => (
            <Face key={`b-${m.id}-${i}`} member={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
