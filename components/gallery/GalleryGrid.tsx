'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
} from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExpandIcon } from '@/components/icons';
import { Reveal } from '@/components/ui/Reveal';
import type { GalleryImage } from '@/lib/types';
import { asset } from '@/lib/utils';

// Fixed locale + UTC so server and browser render the same text.
const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

function formatDate(date?: string): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(`${date}T12:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
}

/** "Campus Hack 2025 · April 2025" */
function imageMeta(image: GalleryImage): string {
  return [image.event, formatDate(image.date)].filter(Boolean).join(' · ');
}

const SWIPE_THRESHOLD = 50;

const navButtonClasses =
  'absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white';

/**
 * Masonry photo grid + lightbox built on the native <dialog> element
 * (focus trapping, Escape to close, and top-layer rendering come for free).
 * Lightbox controls: close button, previous/next buttons, arrow keys, swipe, and backdrop click.
 */
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastIndexRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;

  const close = useCallback(() => setIndex(null), []);
  const showPrev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + count) % count)), [count]);
  const showNext = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % count)), [count]);

  // Sync React state with the native dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null) {
      lastIndexRef.current = index;
      if (!dialog.open) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [index]);

  useEffect(
    () => () => {
      document.body.style.overflow = '';
    },
    [],
  );

  // Fires for every close path: button, Escape, backdrop, or state change
  const handleDialogClose = () => {
    document.body.style.overflow = '';
    setIndex(null);
    const last = lastIndexRef.current;
    if (last !== null) triggerRefs.current[last]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (count < 2) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) close();
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null || count < 2) return;
    const delta = (event.changedTouches[0]?.clientX ?? start) - start;
    if (delta > SWIPE_THRESHOLD) showPrev();
    else if (delta < -SWIPE_THRESHOLD) showNext();
  };

  if (count === 0) {
    return <p className="text-center text-neutral-500">Photos are coming soon.</p>;
  }

  const current = index !== null ? images[index] : null;
  const currentMeta = current ? imageMeta(current) : '';

  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((image, i) => {
          const meta = imageMeta(image);
          return (
            <li key={image.id} className="mb-4 break-inside-avoid">
              <Reveal delay={Math.min(i, 5) * 80}>
                <button
                  ref={(el) => {
                    triggerRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-haspopup="dialog"
                  aria-label={`Open photo: ${image.caption}`}
                  className="group relative block w-full overflow-hidden rounded-3xl bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:bg-neutral-900 dark:focus-visible:ring-offset-black"
                >
                  <Image
                    src={asset(image.src)}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    unoptimized={image.src.endsWith('.svg')}
                    className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Caption overlay: always visible on touch-size screens, on hover/focus from sm up */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-black/0 to-transparent p-5 text-left text-white opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100"
                  >
                    <span>
                      <span className="block font-medium">{image.caption}</span>
                      {meta && <span className="mt-0.5 block text-sm text-white/75">{meta}</span>}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <ExpandIcon className="h-4 w-4" />
                  </span>
                </button>
              </Reveal>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={handleDialogClose}
        onKeyDown={handleKeyDown}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-white backdrop:bg-black/90 backdrop:backdrop-blur-md"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close photo viewer"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous photo"
              className={`${navButtonClasses} left-2 sm:left-6`}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next photo"
              className={`${navButtonClasses} right-2 sm:right-6`}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </>
        )}

        {current && index !== null && (
          <div
            onClick={handleBackdropClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex h-full w-full flex-col items-center justify-center px-4 py-16 sm:px-24"
          >
            <figure className="flex max-h-full w-full max-w-6xl flex-col items-center">
              <Image
                key={current.id}
                src={asset(current.src)}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="100vw"
                loading="eager"
                unoptimized={current.src.endsWith('.svg')}
                className="h-auto max-h-[calc(100dvh-12rem)] w-auto max-w-full animate-fade-in rounded-2xl object-contain shadow-2xl"
              />
              <figcaption className="mt-5 max-w-2xl text-center">
                <p className="font-medium">{current.caption}</p>
                {currentMeta && <p className="mt-1 text-sm text-white/60">{currentMeta}</p>}
                <p className="mt-2 text-xs tabular-nums text-white/50" aria-live="polite">
                  {index + 1} / {count}
                </p>
              </figcaption>
            </figure>
          </div>
        )}
      </dialog>
    </>
  );
}
