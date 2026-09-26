/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Prefixes a /public asset path with the configured basePath.
 * next/link handles basePath automatically, but plain string `src` values
 * passed to next/image do not, so always wrap public assets with this helper.
 */
export function asset(path: string): string {
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}

/** "Yasmine Ben Ali" -> "YA" (first + last word). */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return `${first}${last}`.toUpperCase();
}

/** "Dev Team" -> "dev-team" */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Small deterministic string hash, used to pick stable colors per name. */
export function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
