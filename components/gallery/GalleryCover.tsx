import Image from 'next/image';
import { asset } from '@/lib/utils';

/**
 * Full-bleed photo banner introducing the gallery, with a caption overlay.
 * Tall enough, and framed low enough, that the whole group (not just the
 * building behind them) stays in view at every screen width.
 */
export function GalleryCover() {
  return (
    <div className="relative left-1/2 mb-8 h-[62vh] min-h-[420px] w-screen -translate-x-1/2 overflow-hidden sm:h-[78vh] sm:min-h-[520px]">
      <Image
        src={asset('/images/gallery/epi-business-school-group.jpg')}
        alt="Apple Club EPI members posing outside the EPI Business School building"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_42%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/80 sm:text-sm">
          Apple Club EPI
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
          Our club, on campus.
        </p>
      </div>
    </div>
  );
}
