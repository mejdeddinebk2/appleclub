'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  ArrowRightIcon,
  BookIcon,
  CalendarIcon,
  CodeIcon,
  HomeIcon,
  ImageIcon,
  InstagramIcon,
  MailIcon,
  MoonIcon,
  PaletteIcon,
  SearchIcon,
  SparklesIcon,
  SunIcon,
  UsersIcon,
  VolumeIcon,
} from '@/components/icons';
import { OPEN_THEME_EVENT } from '@/components/ui/ThemePanel';
import { navItems, siteConfig, socialLinks } from '@/data/site';
import { isSoundOn, setSoundOn } from '@/lib/sound';
import { ACCENTS, setAccent, setMode, toggleMode } from '@/lib/theme';
import { cn } from '@/lib/utils';

type Router = ReturnType<typeof useRouter>;
type Group = 'Recent' | 'Navigate' | 'Quick actions' | 'Appearance';

interface PaletteItem {
  id: string;
  label: string;
  group: Exclude<Group, 'Recent'>;
  hint?: string;
  icon: (props: { className?: string }) => JSX.Element;
  /** Tailwind classes for the icon tile. */
  tone: string;
  keywords?: string;
  run: (router: Router) => void;
}

const RECENT_KEY = 'palette-recent';

const NAV_ICONS: Record<string, PaletteItem['icon']> = {
  '/about': BookIcon,
  '/members': UsersIcon,
  '/activities': CodeIcon,
  '/events': CalendarIcon,
  '/gallery': ImageIcon,
  '/contact': MailIcon,
};

const NAV_TONES = 'bg-sky-500/15 text-sky-600 dark:text-sky-400';
const ACTION_TONES = 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
const LOOK_TONES = 'bg-violet-500/15 text-violet-600 dark:text-violet-400';

function Dot({ color }: { color: string }) {
  return <span className="block h-3.5 w-3.5 rounded-full ring-2 ring-white/60" style={{ backgroundColor: color }} />;
}

function buildItems(): PaletteItem[] {
  const navigate: PaletteItem[] = [
    { id: 'home', label: 'Home', group: 'Navigate', icon: HomeIcon, tone: NAV_TONES, run: (r) => r.push('/') },
    ...navItems.map((item) => ({
      id: item.href,
      label: item.label,
      group: 'Navigate' as const,
      icon: NAV_ICONS[item.href] ?? BookIcon,
      tone: NAV_TONES,
      run: (r: Router) => r.push(item.href),
    })),
  ];

  const actions: PaletteItem[] = [
    {
      id: 'chat',
      label: 'Ask APPLE-EPI (chatbot)',
      group: 'Quick actions',
      icon: SparklesIcon,
      tone: ACTION_TONES,
      keywords: 'ai assistant help',
      run: () => window.dispatchEvent(new Event('apple-epi:open-chat')),
    },
    {
      id: 'join',
      label: 'Join the club',
      group: 'Quick actions',
      icon: ArrowRightIcon,
      tone: ACTION_TONES,
      keywords: 'register form apply',
      run: () => window.open(siteConfig.joinFormUrlDirect, '_blank', 'noopener,noreferrer'),
    },
    {
      id: 'copy-email',
      label: 'Copy club email',
      group: 'Quick actions',
      hint: siteConfig.contactEmail,
      icon: MailIcon,
      tone: ACTION_TONES,
      keywords: 'contact mail',
      run: () => {
        void navigator.clipboard?.writeText(siteConfig.contactEmail).catch(() => undefined);
      },
    },
    {
      id: 'instagram',
      label: 'Follow on Instagram',
      group: 'Quick actions',
      icon: InstagramIcon,
      tone: ACTION_TONES,
      keywords: 'social',
      run: () => {
        const href = socialLinks.find((s) => s.platform === 'instagram')?.href;
        if (href) window.open(href, '_blank', 'noopener,noreferrer');
      },
    },
  ];

  const look: PaletteItem[] = [
    {
      id: 'theme',
      label: 'Toggle light / dark mode',
      group: 'Appearance',
      icon: (props) =>
        document.documentElement.classList.contains('dark') ? <SunIcon {...props} /> : <MoonIcon {...props} />,
      tone: LOOK_TONES,
      keywords: 'theme dark light',
      run: () => toggleMode(),
    },
    {
      id: 'midnight',
      label: 'Midnight mode (OLED + neon)',
      group: 'Appearance',
      icon: MoonIcon,
      tone: LOOK_TONES,
      keywords: 'theme black neon',
      run: () => setMode('midnight'),
    },
    {
      id: 'appearance',
      label: 'Open appearance panel',
      group: 'Appearance',
      icon: PaletteIcon,
      tone: LOOK_TONES,
      keywords: 'theme colors accent',
      run: () => window.dispatchEvent(new Event(OPEN_THEME_EVENT)),
    },
    ...ACCENTS.map((a) => ({
      id: `accent-${a.id}`,
      label: `Accent: ${a.label}`,
      group: 'Appearance' as const,
      icon: () => <Dot color={a.swatch} />,
      tone: 'bg-black/5 dark:bg-white/10',
      keywords: `color theme ${a.id}`,
      run: () => setAccent(a.id),
    })),
    {
      id: 'sound',
      label: 'Toggle UI sounds',
      group: 'Appearance',
      icon: VolumeIcon,
      tone: LOOK_TONES,
      keywords: 'audio mute',
      run: () => setSoundOn(!isSoundOn()),
    },
  ];

  return [...navigate, ...actions, ...look];
}

function readRecent(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as unknown;
    return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string').slice(0, 3) : [];
  } catch {
    return [];
  }
}

function pushRecent(id: string) {
  try {
    const next = [id, ...readRecent().filter((x) => x !== id)].slice(0, 3);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

interface Row {
  item: PaletteItem;
  group: Group;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const items = useMemo(buildItems, []);

  const rows: Row[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return items
        .filter((i) => `${i.label} ${i.keywords ?? ''}`.toLowerCase().includes(q))
        .map((item) => ({ item, group: item.group }));
    }
    const recents = recent
      .map((id) => items.find((i) => i.id === id))
      .filter((i): i is PaletteItem => Boolean(i))
      .map((item) => ({ item, group: 'Recent' as Group }));
    return [...recents, ...items.map((item) => ({ item, group: item.group as Group }))];
  }, [items, query, recent]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const combo =
        (isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k');
      if (combo) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpenRequest = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('apple-epi:open-palette', onOpenRequest);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('apple-epi:open-palette', onOpenRequest);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setRecent(readRecent());
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Keep the highlighted row in view when navigating with the keyboard.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-row="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const select = (item: PaletteItem) => {
    pushRecent(item.id);
    item.run(router);
    setOpen(false);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, rows.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && rows[active]) {
      e.preventDefault();
      select(rows[active].item);
    }
  };

  if (!open) return null;

  let lastGroup: Group | null = null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[10vh] sm:pt-[15vh]">
      <div
        aria-hidden
        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md dark:bg-black/60"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="palette-in glass glass-spec squircle relative w-full max-w-xl overflow-hidden rounded-[1.75rem]"
      >
        <div className="relative z-10 flex items-center gap-3 border-b border-black/5 px-5 py-4 dark:border-white/10">
          <SearchIcon className="h-5 w-5 shrink-0 text-neutral-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Spotlight — search pages & actions…"
            aria-label="Search pages and actions"
            className="w-full bg-transparent text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-white dark:placeholder:text-neutral-500"
          />
          <kbd className="hidden shrink-0 rounded-md border border-black/10 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400 sm:block dark:border-white/15 dark:text-neutral-500">
            esc
          </kbd>
        </div>

        <div ref={listRef} data-lenis-prevent className="relative z-10 max-h-[56vh] overflow-y-auto p-2.5">
          {rows.length === 0 && (
            <p className="px-3 py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Nothing matches “{query}”.
            </p>
          )}
          {rows.map(({ item, group }, i) => {
            const showGroup = group !== lastGroup;
            lastGroup = group;
            const Icon = item.icon;
            return (
              <div key={`${group}-${item.id}`}>
                {showGroup && (
                  <p className="mt-2 px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 first:mt-0 dark:text-neutral-500">
                    {group}
                  </p>
                )}
                <button
                  type="button"
                  data-row={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => select(item)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors',
                    i === active ? 'bg-accent/12 text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300',
                  )}
                >
                  <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', item.tone)}>
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.hint && (
                    <span className="hidden truncate text-xs text-neutral-400 sm:block dark:text-neutral-500">{item.hint}</span>
                  )}
                  {i === active && <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-accent" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 hidden items-center justify-between gap-4 border-t border-black/5 px-5 py-2.5 text-[11px] text-neutral-400 sm:flex dark:border-white/10 dark:text-neutral-500">
          <span>↑ ↓ to navigate · ↵ to select</span>
          <span>Apple Club Spotlight</span>
        </div>
      </div>
    </div>
  );
}
