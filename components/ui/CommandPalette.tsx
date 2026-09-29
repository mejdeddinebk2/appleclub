'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  ArrowRightIcon,
  BookIcon,
  CalendarIcon,
  CodeIcon,
  InstagramIcon,
  MapPinIcon,
  MoonIcon,
  SparklesIcon,
  SunIcon,
  UsersIcon,
} from '@/components/icons';
import { navItems, siteConfig, socialLinks } from '@/data/site';
import { cn } from '@/lib/utils';

interface PaletteItem {
  id: string;
  label: string;
  group: 'Navigate' | 'Quick actions';
  hint?: string;
  icon: (props: { className?: string }) => JSX.Element;
  keywords?: string;
  run: (router: ReturnType<typeof useRouter>) => void;
}

const NAV_ICONS: Record<string, PaletteItem['icon']> = {
  '/about': BookIcon,
  '/members': UsersIcon,
  '/activities': CodeIcon,
  '/events': CalendarIcon,
  '/gallery': SparklesIcon,
  '/contact': MapPinIcon,
};

function buildItems(): PaletteItem[] {
  const navigate: PaletteItem[] = [
    { id: 'home', label: 'Home', group: 'Navigate', icon: SparklesIcon, run: (r) => r.push('/') },
    ...navItems.map((item) => ({
      id: item.href,
      label: item.label,
      group: 'Navigate' as const,
      icon: NAV_ICONS[item.href] ?? BookIcon,
      run: (r: ReturnType<typeof useRouter>) => r.push(item.href),
    })),
  ];

  const actions: PaletteItem[] = [
    {
      id: 'theme',
      label: 'Toggle light / dark mode',
      group: 'Quick actions',
      icon: (props) =>
        document.documentElement.classList.contains('dark') ? <SunIcon {...props} /> : <MoonIcon {...props} />,
      run: () => {
        const root = document.documentElement;
        const next = !root.classList.contains('dark');
        root.classList.toggle('dark', next);
        try {
          localStorage.setItem('theme', next ? 'dark' : 'light');
        } catch {
          // ignore
        }
      },
    },
    {
      id: 'chat',
      label: 'Ask APPLE-EPI (chatbot)',
      group: 'Quick actions',
      icon: SparklesIcon,
      run: () => window.dispatchEvent(new Event('apple-epi:open-chat')),
    },
    {
      id: 'join',
      label: 'Join the club',
      group: 'Quick actions',
      hint: siteConfig.contactEmail,
      icon: ArrowRightIcon,
      run: () => window.open(siteConfig.joinFormUrlDirect, '_blank', 'noopener,noreferrer'),
    },
    {
      id: 'instagram',
      label: 'Follow on Instagram',
      group: 'Quick actions',
      icon: InstagramIcon,
      keywords: 'social',
      run: () => {
        const href = socialLinks.find((s) => s.platform === 'instagram')?.href;
        if (href) window.open(href, '_blank', 'noopener,noreferrer');
      },
    },
  ];

  return [...navigate, ...actions];
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const items = useMemo(buildItems, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.label} ${i.keywords ?? ''}`.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const combo = (isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k');
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

  const select = (item: PaletteItem) => {
    item.run(router);
    setOpen(false);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && filtered[active]) {
      e.preventDefault();
      select(filtered[active]);
    }
  };

  if (!open) return null;

  let lastGroup: string | null = null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]">
      <div
        aria-hidden
        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm dark:bg-black/60"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="palette-in relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/90 shadow-2xl shadow-black/20 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/90"
      >
        <div className="flex items-center gap-3 border-b border-neutral-200/70 px-4 py-3.5 dark:border-neutral-800">
          <SparklesIcon className="h-4 w-4 shrink-0 text-accent" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Where to? Search pages and actions…"
            className="w-full bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-white dark:placeholder:text-neutral-500"
          />
          <kbd className="hidden shrink-0 rounded border border-neutral-300 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400 sm:block dark:border-neutral-700 dark:text-neutral-500">
            esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Nothing matches “{query}”.
            </p>
          )}
          {filtered.map((item, i) => {
            const showGroup = item.group !== lastGroup;
            lastGroup = item.group;
            const Icon = item.icon;
            return (
              <div key={item.id}>
                {showGroup && (
                  <p className="mt-2 px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 first:mt-0 dark:text-neutral-600">
                    {item.group}
                  </p>
                )}
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => select(item)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                    i === active
                      ? 'bg-accent/10 text-neutral-900 dark:text-white'
                      : 'text-neutral-700 dark:text-neutral-300',
                  )}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', i === active ? 'text-accent' : 'text-neutral-400')} />
                  <span className="flex-1">{item.label}</span>
                  {item.hint && <span className="text-xs text-neutral-400 dark:text-neutral-500">{item.hint}</span>}
                  {i === active && <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-accent" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
