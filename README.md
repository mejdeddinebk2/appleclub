# Apple Club

The website of **Apple Club**, the official tech club of **EPI Digital School (IMSET Sousse)**.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. It has an Apple-inspired minimalist design with dark/light mode and subtle scroll animations.

## Getting started

Requirements: Node.js 18.17+ (Node 20 recommended).

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start the dev server                         |
| `npm run build`        | Production build (Vercel / `next start`)     |
| `npm run build:static` | Static export to `./out` (GitLab Pages)      |
| `npm run start`        | Serve the production build                   |
| `npm run lint`         | Lint with ESLint                             |

## Project structure

```
app/                 Routes (App Router), root layout, SEO files (sitemap, robots, icon)
  page.tsx           Home
  about/ members/ activities/ events/ gallery/ contact/
components/
  layout/            Navbar, Footer
  home/              Home page sections (Hero, Features, Stats, Mission, JoinCta)
  sections/          Shared page sections (ComingSoon)
  ui/                Reusable primitives (Button, Card, Container, Section, SectionHeading, Reveal, ThemeToggle, SocialLinks)
  icons.tsx          Inline SVG icons
data/
  site.ts            Site name, tagline, mission, nav, socials, features, stats
  members.json       Club members (edit this file to update the Members page)
lib/                 Types, helpers (cn, asset), SEO metadata builder
public/              Logo and images
```

## Editing content

- **Text, nav, socials, stats:** `data/site.ts`
- **Members:** `data/members.json`. Each entry has `id`, `name`, `role`, `team` (e.g. `Board`, `Dev Team`, `Design Team`), optional `photo` (put files in `public/images/members/`; omit it for an initials avatar), optional `bio`, and `socials` (`linkedin`, `github`, `instagram`). Team order and blurbs live in `data/members.ts`.
- **Activities:** `data/activities.ts`. Each entry has `id`, `title`, `date` (`YYYY-MM-DD`), `category` (`Workshop`, `Hackathon`, or `Project`), `description`, and optional `image` (in `public/images/activities/`), `imageAlt`, `link`, and `tags`.
- **Logo:** replace `public/logo.svg` and `app/icon.svg` (favicon).
- **Social preview image:** add a 1200x630 `app/opengraph-image.png`. Next.js picks it up automatically.

Always reference files from `public/` through the `asset()` helper (`asset('/logo.svg')`) so paths still work when the site is served from a sub-path.

## Deployment

### Vercel

1. Import the repository on [vercel.com](https://vercel.com/new).
2. Keep the defaults (framework: Next.js). Optionally set `NEXT_PUBLIC_SITE_URL` to your production domain.

### GitLab Pages

The `pages` job in `.gitlab-ci.yml` runs on the default branch. It builds a static export with `STATIC_EXPORT=true`, sets `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BASE_PATH` from `CI_PAGES_URL`, and publishes `out/`. Merge requests run lint and build only.

To build the static version locally:

```bash
npm run build:static
npx serve out
```

| Variable                | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `STATIC_EXPORT`         | `true` for a static export (`out/`)                            |
| `NEXT_PUBLIC_BASE_PATH` | Sub-path the site is served from, e.g. `/appleclub`            |
| `NEXT_PUBLIC_SITE_URL`  | Absolute site URL used for SEO metadata, sitemap, and robots   |

---

Student-run club. Not affiliated with Apple Inc.
