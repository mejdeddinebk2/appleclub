'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckIcon, CloseIcon, MoonIcon, PaletteIcon, SunIcon, VolumeIcon, VolumeOffIcon } from '@/components/icons';
import { isSoundOn, setSoundOn, SOUND_EVENT, sound } from '@/lib/sound';
import { ACCENTS, getAccent, getMode, originOf, setAccent, setMode, THEME_EVENT, type ThemeMode } from '@/lib/theme';
import { cn } from '@/lib/utils';

export const OPEN_THEME_EVENT = 'apple-epi:open-theme';

const MODES: Array<{ id: ThemeMode; label: string; hint: string }> = [
  { id: 'light', label: 'Light', hint: 'Bright & clean' },
  { id: 'dark', label: 'Dark', hint: 'Easy on the eyes' },
  { id: 'midnight', label: 'Midnight', hint: 'OLED black + neon' },
];

function ModeSwatch({ id }: { id: ThemeMode }) {
  if (id === 'light') return <SunIcon className="h-4 w-4" />;
  if (id === 'dark') return <MoonIcon className="h-4 w-4" />;
  return (
    <span className="relative flex h-4 w-4 items-center justify-center">
      <span className="absolute inset-0 rounded-full bg-black ring-1 ring-accent-light" />
      <span className="h-1.5 w-1.5 rounded-full bg-accent-light shadow-[0_0_8px_2px_rgb(var(--accent-light-rgb)/0.9)]" />
    </span>
  );
}

/**
 * Appearance panel: light / dark / Midnight mode, five accent palettes and an
 * opt-in UI sound toggle. A fixed liquid-glass popover (bottom sheet on phones),
 * also openable from the dock and command palette via the OPEN_THEME_EVENT.
 */
export function ThemePanel() {
  const [open, setOpen] = useState(false);
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [accent, setAccentState] = useState('blue');
  const [soundOn, setSoundState] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const sync = useCallback(() => {
    setModeState(getMode());
    setAccentState(getAccent());
    setSoundState(isSoundOn());
  }, []);

  useEffect(() => {
    sync();
    const onOpen = () => setOpen(true);
    window.addEventListener(THEME_EVENT, sync);
    window.addEventListener(SOUND_EVENT, sync);
    window.addEventListener(OPEN_THEME_EVENT, onOpen);
    return () => {
      window.removeEventListener(THEME_EVENT, sync);
      window.removeEventListener(SOUND_EVENT, sync);
      window.removeEventListener(OPEN_THEME_EVENT, onOpen);
    };
  }, [sync]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Appearance: theme and accent color"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
      >
        <PaletteIcon className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Appearance"
          className="glass glass-spec squircle fixed inset-x-3 bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+5rem))] z-[85] animate-fade-up rounded-3xl p-5 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-16 sm:w-80 md:bottom-auto"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">Appearance</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close appearance panel"
                className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">Mode</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={(e) => {
                    sound('pop');
                    setMode(m.id, originOf(e.currentTarget));
                  }}
                  aria-pressed={mode === m.id}
                  title={m.hint}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    mode === m.id
                      ? 'border-accent bg-accent/10 text-accent dark:text-accent-light'
                      : 'border-black/10 text-neutral-600 hover:border-black/20 dark:border-white/10 dark:text-neutral-300 dark:hover:border-white/25',
                  )}
                >
                  <ModeSwatch id={m.id} />
                  {m.label}
                </button>
              ))}
            </div>

            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">Accent</p>
            <div className="mt-2 flex items-center gap-2.5">
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    sound('pop');
                    setAccent(a.id);
                  }}
                  aria-label={`${a.label} accent`}
                  aria-pressed={accent === a.id}
                  className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-95',
                    accent === a.id && 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900',
                  )}
                  style={{ backgroundColor: a.swatch, ['--tw-ring-color' as string]: a.swatch }}
                >
                  {accent === a.id && <CheckIcon className="h-4 w-4" />}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSoundOn(!soundOn)}
              aria-pressed={soundOn}
              className="mt-5 flex w-full items-center justify-between rounded-2xl border border-black/10 px-4 py-3 text-sm transition-colors hover:border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-white/10 dark:hover:border-white/25"
            >
              <span className="flex items-center gap-2.5">
                {soundOn ? <VolumeIcon className="h-4 w-4 text-accent" /> : <VolumeOffIcon className="h-4 w-4 text-neutral-400" />}
                UI sounds
              </span>
              <span
                aria-hidden
                className={cn('relative h-5 w-9 rounded-full transition-colors', soundOn ? 'bg-accent' : 'bg-neutral-300 dark:bg-neutral-700')}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
                    soundOn ? 'left-[1.1rem]' : 'left-0.5',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
