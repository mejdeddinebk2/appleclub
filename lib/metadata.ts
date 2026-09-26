import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
}

/** Builds consistent per-page SEO metadata (title, description, canonical, OG, Twitter). */
export function createMetadata({ title, description, path }: PageMetadataOptions): Metadata {
  const fullTitle = `${title} · ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}
