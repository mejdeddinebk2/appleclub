import Image from 'next/image';
import type { Member } from '@/lib/types';
import { asset, cn, getInitials, hashString } from '@/lib/utils';

// Full class strings so Tailwind can detect them.
const gradients = [
  'from-sky-400 to-blue-600',
  'from-indigo-400 to-violet-600',
  'from-cyan-400 to-sky-600',
  'from-blue-400 to-indigo-600',
  'from-violet-400 to-fuchsia-600',
  'from-teal-400 to-cyan-600',
];

interface MemberAvatarProps {
  member: Pick<Member, 'name' | 'photo'>;
  className?: string;
}

/** Round member photo, or a colored initials avatar when no photo is set. */
export function MemberAvatar({ member, className }: MemberAvatarProps) {
  const { name, photo } = member;

  return (
    <div
      className={cn(
        'relative h-28 w-28 shrink-0 overflow-hidden rounded-full ring-1 ring-neutral-200 ring-offset-4 ring-offset-neutral-50 transition-shadow duration-500 group-hover:ring-accent/40 dark:ring-neutral-800 dark:ring-offset-neutral-900',
        className,
      )}
    >
      {photo ? (
        <Image
          src={asset(photo)}
          alt={`Photo of ${name}`}
          fill
          sizes="112px"
          unoptimized={photo.endsWith('.svg')}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div
          aria-hidden
          className={cn(
            'flex h-full w-full items-center justify-center bg-gradient-to-br text-3xl font-semibold tracking-tight text-white transition-transform duration-500 ease-out group-hover:scale-105',
            gradients[hashString(name) % gradients.length],
          )}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}
