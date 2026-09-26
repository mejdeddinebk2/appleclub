/**
 * STATIC_EXPORT=true  -> static HTML export in ./out (GitLab Pages, any static host)
 * default             -> regular Next.js build (Vercel, `next start`)
 *
 * NEXT_PUBLIC_BASE_PATH is only needed when the site is served from a sub-path,
 * e.g. https://mejd1.gitlab.io/appleclub -> "/appleclub". The GitLab CI job sets it automatically.
 */
const isStaticExport = process.env.STATIC_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  basePath,
  assetPrefix: basePath || undefined,
  ...(isStaticExport && {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
