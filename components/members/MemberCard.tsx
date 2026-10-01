'use client';

import Image from 'next/image';
import { useRef, useState, type PointerEvent } from 'react';
import { RotateIcon } from '@/components/icons';
import { SocialLinks } from '@/components/ui/SocialLinks';
import type { Member, SocialLink, SocialPlatform } from '@/lib/types';
import { asset, cn, getInitials, hashString } from '@/lib/utils';

const platformOrder: SocialPlatform[] = ['linkedin', 'github', 'instagram', 'tiktok', 'facebook', 'discord'];

const platformLabels: Record<SocialPlatform, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  discord: 'Discord',
};

function memberSocialLinks(member: Member): SocialLink[] {
  return platformOrder.flatMap((platform) => {
    const href = member.socials[platform];
    return href ? [{ platform, href, label: `${member.name} on ${platformLabels[platform]}` }] : [];
  });
}

const gradients = [
  'from-sky-400 to-blue-600',
  'from-indigo-400 to-violet-600',
  'from-cyan-400 to-sky-600',
  'from-blue-400 to-indigo-600',
  'from-violet-400 to-fuchsia-600',
  'from-teal-400 to-cyan-600',
];

/** Deterministic, wallet-pass style ID like "AC-0427". */
function memberId(member: Member) {
  return `AC-${String(hashString(member.id) % 10000).padStart(4, '0')}`;
}

/**
 * A member "ID card": a holographic wallet-pass on the front that flips (click, tap,
 * Enter or Space) to reveal the bio and social links on the back.
 */
export function MemberCard({ member }: { member: Member }) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const links = memberSocialLinks(member);
  const id = memberId(member);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--hp', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--hq', `${(y * 100).toFixed(1)}%`);
  };

  return (
    <div
      ref={cardRef}
      data-flipped={flipped}
      data-cursor={flipped ? undefined : 'Flip'}
      onPointerMove={onMove}
      className="flip-card h-full"
    >
      <div className="flip-inner h-full min-h-[25rem]">
        {/* Front */}
        <div className="flip-face flip-front neon-card squircle relative flex flex-col items-center overflow-hidden rounded-3xl bg-neutral-950 p-7 text-center text-white shadow-xl shadow-black/20 ring-1 ring-white/10">
          <div
            aria-hidden
            className="absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-accent/40 blur-3xl"
          />
          <div aria-hidden className="holo pointer-events-none absolute inset-0" />

          <div className="relative flex w-full items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
            <span>{member.team ?? 'Member'}</span>
            <span aria-hidden>🍎</span>
          </div>

          <div className="relative mt-6 h-28 w-28 shrink-0 overflow-hidden rounded-full ring-2 ring-white/25 ring-offset-4 ring-offset-neutral-950">
            {member.photo ? (
              <Image
                src={asset(member.photo)}
                alt={`Photo of ${member.name}`}
                fill
                sizes="112px"
                unoptimized={member.photo.endsWith('.svg')}
                className="object-cover"
              />
            ) : (
              <div
                aria-hidden
                className={cn(
                  'flex h-full w-full items-center justify-center bg-gradient-to-br text-3xl font-semibold tracking-tight text-white',
                  gradients[hashString(member.name) % gradients.length],
                )}
              >
                {getInitials(member.name)}
              </div>
            )}
          </div>

          <h3 className="relative mt-6 text-xl font-semibold tracking-tight">{member.name}</h3>
          <p className="relative mt-1 text-sm font-medium text-accent-light">{member.role}</p>

          <div className="relative mt-auto w-full pt-8">
            <div
              aria-hidden
              className="h-7 w-full opacity-40"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, #fff 0 2px, transparent 2px 4px, #fff 4px 5px, transparent 5px 9px, #fff 9px 12px, transparent 12px 14px)',
              }}
            />
            <p className="mt-2 font-mono text-[10px] tracking-[0.3em] text-white/50">
              {id} · EPI SUP
            </p>
          </div>

          {/* Whole front is the flip button */}
          <button
            type="button"
            onClick={() => setFlipped(true)}
            aria-label={`Flip ${member.name}'s card to see details`}
            className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
          />
        </div>

        {/* Back */}
        <div className="flip-face flip-back neon-card squircle relative flex flex-col overflow-hidden rounded-3xl bg-neutral-900 p-7 text-white shadow-xl shadow-black/20 ring-1 ring-white/10">
          <div
            aria-hidden
            className="absolute -bottom-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-accent/30 blur-3xl"
          />
          <div className="relative flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.3em] text-white/50">{id}</p>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              aria-label="Flip card back"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
            >
              <RotateIcon className="h-4 w-4" />
            </button>
          </div>

          <h3 className="relative mt-5 text-lg font-semibold tracking-tight">{member.name}</h3>
          <p className="relative mt-0.5 text-sm font-medium text-accent-light">
            {member.role}
            {member.team ? <span className="text-white/50"> · {member.team}</span> : null}
          </p>

          {member.bio ? (
            <p className="relative mt-5 text-pretty text-sm leading-relaxed text-white/75">{member.bio}</p>
          ) : (
            <p className="relative mt-5 text-sm text-white/50">Proud member of Apple Club EPI.</p>
          )}

          {links.length > 0 && (
            <SocialLinks
              links={links}
              className="relative mt-auto justify-start gap-1 pt-6"
              linkClassName="text-white/70 hover:bg-white/10 hover:text-white"
            />
          )}
        </div>
      </div>
    </div>
  );
}
