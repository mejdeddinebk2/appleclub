import Image from 'next/image';
import Link from 'next/link';
import { MailIcon } from '@/components/icons';
import { Container } from '@/components/ui/Container';
import { socialIcons } from '@/components/ui/SocialLinks';
import { navItems, siteConfig, socialLinks } from '@/data/site';
import { asset } from '@/lib/utils';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-neutral-200 bg-neutral-50 dark:border-neutral-900 dark:bg-neutral-950">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />
      <p
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 hidden -translate-x-1/2 select-none whitespace-nowrap text-[8rem] font-bold leading-none tracking-tighter text-neutral-900/[0.025] dark:text-white/[0.03] sm:block sm:text-[10rem]"
      >
        Apple Club
      </p>

      <Container className="relative py-14 sm:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-12">
          <div className="col-span-2 sm:col-span-12 lg:col-span-6">
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
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <Image
                src={asset('/images/logo-epi-sup.png')}
                alt="EPI Sup logo"
                width={64}
                height={22}
                className="h-4 w-auto object-contain dark:brightness-0 dark:invert"
              />
              <span className="h-3 w-px bg-neutral-300 dark:bg-neutral-700" aria-hidden />
              {siteConfig.school} · {siteConfig.campus}
            </div>
          </div>

          <div className="col-span-1 sm:col-span-4 lg:col-span-3 lg:col-start-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
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

          <div className="col-span-1 sm:col-span-4 lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
              Connect
            </h2>
            <div className="mt-4 flex items-center gap-2">
              {socialLinks.map(({ platform, label, href }) => {
                const Icon = socialIcons[platform];
                return (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent hover:shadow-md hover:shadow-accent/10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-accent-light"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-neutral-600 transition-colors hover:text-accent dark:text-neutral-400 dark:hover:text-accent-light"
            >
              <MailIcon className="h-3.5 w-3.5 shrink-0" />
              {siteConfig.contactEmail}
            </a>
          </div>
        </div>

        <div className="relative mt-12 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500 dark:border-neutral-900 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}, {siteConfig.school} ({siteConfig.campus}). All rights reserved.
          </p>
          <p>Student-run club. Not affiliated with Apple Inc.</p>
        </div>
      </Container>
    </footer>
  );
}
