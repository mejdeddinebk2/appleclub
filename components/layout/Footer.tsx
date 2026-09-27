import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { navItems, siteConfig } from '@/data/site';
import { asset } from '@/lib/utils';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-900 dark:bg-neutral-950">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src={asset('/images/logo-apple-club.png')}
                alt={`${siteConfig.name} logo`}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-lg font-semibold tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Image
                src={asset('/images/logo-epi-sup.png')}
                alt="EPI Sup logo"
                width={80}
                height={28}
                className="h-6 w-auto object-contain dark:brightness-0 dark:invert"
              />
              <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {siteConfig.school} · {siteConfig.campus}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Explore</h2>
            <ul className="mt-4 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Connect</h2>
            <SocialLinks
              showLabels
              className="-ml-2 mt-3 flex-col items-start gap-0"
              linkClassName="text-neutral-600 dark:text-neutral-400"
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-neutral-200 pt-8 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-900">
          <p>
            © {year} {siteConfig.name}, {siteConfig.school} ({siteConfig.campus}). All rights reserved.
          </p>
          <p>Student-run club. Not affiliated with Apple Inc.</p>
        </div>
      </Container>
    </footer>
  );
}
