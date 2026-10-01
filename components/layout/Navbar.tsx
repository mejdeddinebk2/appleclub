'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CloseIcon, MenuIcon } from '@/components/icons';
import { EGG_EVENT } from '@/components/effects/SiteEffects';
import { ThemePanel } from '@/components/ui/ThemePanel';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { navItems, siteConfig } from '@/data/site';
import { asset, cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<{ left: number; width: number } | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const logoTaps = useRef<{ count: number; last: number }>({ count: 0, last: 0 });

  // Close the mobile menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Backdrop appears once scrolled; the bar itself hides on scroll-down past the
  // fold and reappears on scroll-up, so content gets more room without losing nav.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y > lastY + 4 && y > 160) {
        setHidden(true);
      } else if (y < lastY - 4 || y < 160) {
        setHidden(false);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const handleEnter = (href: string) => {
    const el = itemRefs.current[href];
    const list = listRef.current;
    if (!el || !list) return;
    const elRect = el.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    setHovered({ left: elRect.left - listRect.left, width: elRect.width });
  };

  return (
    <header
      className={cn(
        'nav-floating fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled || open
          ? 'border-white/50 bg-white/60 shadow-[inset_0_-1px_0_rgb(255_255_255/0.5)] backdrop-blur-2xl backdrop-saturate-[1.8] dark:border-white/10 dark:bg-black/55 dark:shadow-[inset_0_-1px_0_rgb(255_255_255/0.06)]'
          : 'border-transparent bg-transparent',
        hidden && !open && 'nav-hidden',
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link
          href="/"
          aria-label={`${siteConfig.name} home`}
          onClick={() => {
            // Easter egg: five quick taps on the logo.
            const now = Date.now();
            const t = logoTaps.current;
            t.count = now - t.last < 600 ? t.count + 1 : 1;
            t.last = now;
            if (t.count >= 5) {
              t.count = 0;
              window.dispatchEvent(new Event(EGG_EVENT));
            }
          }}
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Image
            src={asset('/images/logo-apple-club.png')}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
          <span className="text-[15px] font-semibold tracking-tight">{siteConfig.name}</span>
        </Link>

        <ul className="relative hidden items-center gap-1 md:flex" ref={listRef} onMouseLeave={() => setHovered(null)}>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0.5 rounded-full bg-neutral-900/[0.06] transition-all duration-300 ease-out dark:bg-white/10"
            style={{
              left: hovered?.left ?? 0,
              width: hovered?.width ?? 0,
              opacity: hovered ? 1 : 0,
            }}
          />
          {navItems.map((item) => (
            <li
              key={item.href}
              ref={(el) => {
                itemRefs.current[item.href] = el;
              }}
              onMouseEnter={() => handleEnter(item.href)}
            >
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'relative rounded-full px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  isActive(item.href)
                    ? 'font-medium text-neutral-900 dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white',
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3 -bottom-px h-[2px] animate-fade-in rounded-full bg-accent" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('apple-epi:open-palette'))}
            className="hidden items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:inline-flex dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
            aria-label="Open command palette"
          >
            Search
            <kbd className="rounded border border-neutral-300 px-1 font-mono text-[10px] dark:border-neutral-700">
              ⌘K
            </kbd>
          </button>
          <ThemePanel />
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 md:inline-flex dark:focus-visible:ring-offset-black"
          >
            Join Us
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden dark:hover:bg-neutral-800"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" data-lenis-prevent className="h-[calc(100svh-3.5rem)] animate-fade-in overflow-y-auto px-6 pb-10 pt-4 md:hidden">
          <ul className="space-y-1">
            {navItems.map((item, i) => (
              <li key={item.href} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'block border-b border-neutral-200/70 py-4 text-2xl font-semibold tracking-tight dark:border-neutral-800',
                    isActive(item.href) ? 'text-accent dark:text-accent-light' : 'text-neutral-900 dark:text-white',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-8 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 font-medium text-white"
          >
            Join Us
          </Link>
        </div>
      )}
    </header>
  );
}
