/**
 * Runtime theme helpers: light / dark / midnight modes, accent palettes and the
 * circular "reveal" transition (View Transitions API) used when the mode changes.
 * The initial values are applied before paint by the inline script in app/layout.tsx.
 */
export type ThemeMode = 'light' | 'dark' | 'midnight';

export interface AccentOption {
  id: string;
  label: string;
  /** Preview color for the swatch button. */
  swatch: string;
}

export const ACCENTS: AccentOption[] = [
  { id: 'blue', label: 'Blue', swatch: '#0071e3' },
  { id: 'purple', label: 'Purple', swatch: '#7c3aed' },
  { id: 'pink', label: 'Pink', swatch: '#e11d48' },
  { id: 'orange', label: 'Orange', swatch: '#ea580c' },
  { id: 'green', label: 'Green', swatch: '#059669' },
];

export const THEME_EVENT = 'apple-epi:theme';

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable (private mode): the choice still applies for this visit.
  }
}

export function getMode(): ThemeMode {
  const root = document.documentElement;
  if (!root.classList.contains('dark')) return 'light';
  return root.dataset.mode === 'midnight' ? 'midnight' : 'dark';
}

export function getAccent(): string {
  return document.documentElement.dataset.accent || 'blue';
}

function commitMode(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle('dark', mode !== 'light');
  if (mode === 'midnight') root.dataset.mode = 'midnight';
  else delete root.dataset.mode;
  store('theme', mode);
  window.dispatchEvent(new Event(THEME_EVENT));
}

/** Switches mode. With an origin point, the new theme expands from it as a circle. */
export function setMode(mode: ThemeMode, origin?: { x: number; y: number }) {
  if (getMode() === mode) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void> };
  };

  if (reduced || typeof doc.startViewTransition !== 'function') {
    commitMode(mode);
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const transition = doc.startViewTransition(() => commitMode(mode));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => undefined);
}

/** Quick light <-> dark flip (Midnight counts as dark). */
export function toggleMode(origin?: { x: number; y: number }) {
  setMode(getMode() === 'light' ? 'dark' : 'light', origin);
}

export function setAccent(id: string) {
  const root = document.documentElement;
  if (id === 'blue') delete root.dataset.accent;
  else root.dataset.accent = id;
  store('accent', id);
  window.dispatchEvent(new Event(THEME_EVENT));
}

/** Center point of an element, handy as a transition origin. */
export function originOf(el: Element | null): { x: number; y: number } | undefined {
  if (!el) return undefined;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
