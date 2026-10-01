'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ComponentType, type PointerEvent as ReactPointerEvent } from 'react';
import {
  BookIcon,
  CalendarIcon,
  CodeIcon,
  HomeIcon,
  ImageIcon,
  MailIcon,
  PaletteIcon,
  SearchIcon,
  UsersIcon,
  type IconProps,
} from '@/components/icons';
import { OPEN_THEME_EVENT } from '@/components/ui/ThemePanel';
import { cn } from '@/lib/utils';

interface DockItem {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
}

const DESKTOP_ITEMS: DockItem[] = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/about', label: 'About', icon: BookIcon },
  { href: '/members', label: 'Members', icon: UsersIcon },
  { href: '/activities', label: 'Activities', icon: CodeIcon },
  { href: '/events', label: 'Events', icon: CalendarIcon },
  { href: '/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/contact', label: 'Contact', icon: MailIcon },
];

const MOBILE_ITEMS: DockItem[] = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/activities', label: 'Activities', icon: CodeIcon },
  { href: '/events', label: 'Events', icon: CalendarIcon },
  { href: '/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/contact', label: 'Join', icon: MailIcon },
];

const BASE = 44; // px, resting icon size
const MAX_SCALE = 1.55;
const SIGMA = 62; // px, how far the magnification reaches

/**
 * macOS-style floating dock on desktop (appears once you scroll, filling the gap left
 * by the auto-hiding navbar) and an iOS-style tab bar on phones. Both are Liquid Glass.
 */
export function Dock() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [typing, setTyping] = useState(false);
  const refs = useRef<Array<HTMLAnchorElement | null>>([]);
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const iconRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const resting = useRef(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 280);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hide the phone tab bar while a text field is focused (on-screen keyboard).
  useEffect(() => {
    const isField = (t: EventTarget | null) => t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = () => setTyping(false);
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));

  const apply = (scales: number[], animate: boolean) => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      const s = scales[i] ?? 1;
      el.style.transition = animate ? 'width 0.25s cubic-bezier(0.2,0.8,0.2,1), height 0.25s cubic-bezier(0.2,0.8,0.2,1)' : 'none';
      el.style.width = `${BASE * s}px`;
      el.style.height = `${BASE * s}px`;
      const label = labelRefs.current[i];
      if (label) label.style.opacity = s > 1.25 ? '1' : '0';
    });
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    resting.current = false;
    const scales = refs.current.map((el) => {
      if (!el) return 1;
      const r = el.getBoundingClientRect();
      const d = e.clientX - (r.left + r.width / 2);
      return 1 + (MAX_SCALE - 1) * Math.exp(-(d * d) / (2 * SIGMA * SIGMA));
    });
    apply(scales, false);
  };

  const onLeave = () => {
    resting.current = true;
    apply(refs.current.map(() => 1), true);
  };

  const bounce = (el: HTMLElement | null) => {
    const icon = el?.querySelector<HTMLElement>('[data-dock-icon]');
    if (!icon) return;
    icon.classList.remove('dock-bounce');
    void icon.offsetWidth;
    icon.classList.add('dock-bounce');
  };

  return (
    <>
      {/* Desktop dock */}
      {scrolled && (
        <div
          className="dock-root dock-in fixed bottom-5 left-1/2 z-[55] hidden -translate-x-1/2 md:block"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <nav
            aria-label="Quick dock"
            className="glass glass-spec squircle flex items-end gap-2 rounded-[1.75rem] px-3 pb-2.5 pt-2.5"
          >
            {DESKTOP_ITEMS.map((item, i) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  onClick={(e) => bounce(e.currentTarget)}
                  style={{ width: BASE, height: BASE }}
                  className={cn(
                    'dock-item squircle relative z-10 flex items-center justify-center rounded-2xl text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-neutral-200',
                    active ? 'bg-accent text-white shadow-lg shadow-accent/30 dark:text-white' : 'bg-white/60 dark:bg-white/10',
                  )}
                >
                  <span
                    ref={(el) => {
                      labelRefs.current[i] = el;
                    }}
                    aria-hidden
                    className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900/90 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 dark:bg-white/90 dark:text-neutral-900"
                  >
                    {item.label}
                  </span>
                  <span data-dock-icon className="flex h-1/2 w-1/2 items-center justify-center">
                    <Icon className="h-full w-full" />
                  </span>
                  {active && <span aria-hidden className="absolute -bottom-2 h-1 w-1 rounded-full bg-neutral-700 dark:bg-white" />}
                </Link>
              );
            })}

            <span aria-hidden className="mx-0.5 mb-1 h-8 w-px self-end bg-black/10 dark:bg-white/15" />

            <button
              type="button"
              aria-label="Search (Ctrl or Cmd + K)"
              onClick={() => window.dispatchEvent(new Event('apple-epi:open-palette'))}
              className="dock-item squircle flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-neutral-700 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:bg-white/10 dark:text-neutral-200"
            >
              <SearchIcon className="h-[22px] w-[22px]" />
            </button>
            <button
              type="button"
              aria-label="Appearance"
              onClick={() => window.dispatchEvent(new Event(OPEN_THEME_EVENT))}
              className="dock-item squircle flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-neutral-700 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:bg-white/10 dark:text-neutral-200"
            >
              <PaletteIcon className="h-[22px] w-[22px]" />
            </button>
          </nav>
        </div>
      )}

      {/* Phone tab bar */}
      <nav
        aria-label="Tab bar"
        className={cn(
          'dock-root glass squircle fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[48] grid grid-cols-5 gap-1 rounded-[1.75rem] p-1.5 transition-transform duration-300 md:hidden',
          typing && 'translate-y-[150%]',
        )}
      >
        {MOBILE_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative z-10 flex flex-col items-center gap-0.5 rounded-[1.25rem] py-2 text-[10px] font-medium transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                active ? 'bg-accent/15 text-accent dark:text-accent-light' : 'text-neutral-600 dark:text-neutral-300',
              )}
            >
              <Icon className={cn('h-[22px] w-[22px] transition-transform', active && 'scale-110')} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
