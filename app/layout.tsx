import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { Intro } from '@/components/effects/Intro';
import { SiteEffects } from '@/components/effects/SiteEffects';
import { SmoothScroll } from '@/components/effects/SmoothScroll';
import { Dock } from '@/components/layout/Dock';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { CursorGlow } from '@/components/ui/CursorGlow';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { siteConfig } from '@/data/site';
import './globals.css';
import './premium.css';

const defaultTitle = `${siteConfig.name} · ${siteConfig.school}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: siteConfig.name,
    title: defaultTitle,
    description: siteConfig.description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// Applies the saved theme (or the system preference) before first paint to avoid a flash.
// Also restores the accent palette + Midnight mode, tags the time of day for the hero sky,
// and flags the first-visit intro (home page only, once per session, never for reduced motion).
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const themeScript = `(function(){var r=document.documentElement;try{var t=localStorage.getItem('theme');var d=t?(t==='dark'||t==='midnight'):window.matchMedia('(prefers-color-scheme: dark)').matches;r.classList.toggle('dark',d);if(t==='midnight')r.setAttribute('data-mode','midnight');var a=localStorage.getItem('accent');if(a&&a!=='blue')r.setAttribute('data-accent',a);}catch(e){}try{var h=new Date().getHours();r.setAttribute('data-daypart',h>=5&&h<8?'dawn':h>=8&&h<17?'day':h>=17&&h<20?'dusk':'night');}catch(e){}try{var p=location.pathname;while(p.length&&p.charAt(p.length-1)==='/')p=p.slice(0,-1);if(p===${JSON.stringify(BASE_PATH)}&&!sessionStorage.getItem('intro-seen')&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){r.setAttribute('data-intro','1');sessionStorage.setItem('intro-seen','1');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body className="min-h-screen font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Intro />
        <SmoothScroll />
        <SiteEffects />
        <Navbar />
        <Dock />
        <ScrollProgress />
        <CursorGlow />
        <CommandPalette />
        <main id="main" className="pt-14">
          {children}
        </main>
        <div className="pb-24 md:pb-0">
          <Footer />
        </div>
        <ChatWidget />
      </body>
    </html>
  );
}
