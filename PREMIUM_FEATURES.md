# Premium upgrade — what was added

Run `npm install` first (new deps: `lenis`, `three`, `@types/three`), then `npm run dev`.

| Feature | Where |
|---|---|
| Photo intro (team mosaic + curtain, once per session, skippable) | `components/effects/Intro.tsx`, CSS in `app/premium.css`, flag script in `app/layout.tsx` |
| Smooth inertia scroll (Lenis) | `components/effects/SmoothScroll.tsx` |
| Appearance panel: Light / Dark / **Midnight (OLED+neon)**, 5 accent colors, UI sounds | `components/ui/ThemePanel.tsx`, `lib/theme.ts`, `lib/sound.ts` |
| Circular theme-change reveal (View Transitions API) | `lib/theme.ts` |
| Mac-style magnifying Dock (desktop) + iOS tab bar (phone) | `components/layout/Dock.tsx` |
| Liquid Glass surfaces + pointer specular highlight | `.glass`, `.glass-spec` in `app/premium.css` |
| Custom cursor with labels (`data-cursor="View"`) | `components/ui/CursorGlow.tsx` |
| 3D floating app-icon (Three.js, lazy, gyroscope on Android) | `components/home/FloatingIcon3D.tsx` |
| Time-of-day sky tint + greeting chip | `HeroBackground.tsx`, `DaypartChip.tsx` |
| Scroll-pinned iPhone story with Dynamic Island | `components/home/PhoneStory.tsx` |
| Live Xcode-style typing window + working preview | `components/home/CodeShowcase.tsx` |
| Bento grid (live event countdown, stats, toolbox marquee) | `components/home/Bento.tsx` |
| Member avatars marquee (2 rows, opposite directions) | `components/home/CrewMarquee.tsx` |
| Word-by-word scroll reveal on the mission statement | `components/ui/ScrollWords.tsx` |
| Holographic flip ID cards for members | `components/members/MemberCard.tsx` |
| Parallax gallery + shared-element lightbox + blur-up | `components/gallery/GalleryGrid.tsx` |
| Spotlight-style command palette (recents, quick actions, accents) | `components/ui/CommandPalette.tsx` |
| Page-transition wipe | `app/template.tsx` |
| Haptics, optional sounds, easter eggs (Konami code / 5 logo taps) | `components/effects/SiteEffects.tsx` |
| 404 "Catch the apples" mini-game | `components/ui/AppleCatch.tsx` |

Also fixed: a hydration mismatch in `ChatWidget` (clock text) that forced full client re-render.
