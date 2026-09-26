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
