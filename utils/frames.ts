/**
 * Single source of truth for the pre-rendered frame sequence.
 * If you regenerate the frames with a different count, change TOTAL_FRAMES here.
 */
export const TOTAL_FRAMES = 151;

/** Pad a frame index to a 4-digit zero-prefixed string. */
export function padFrame(index: number): string {
  return String(index).padStart(4, '0');
}

/**
 * Returns the public URL for a single frame.
 * We keep two sizes — `desktop` (1600w) and `mobile` (900w) — so the client
 * can decide at runtime which to load based on viewport / network.
 */
export function framePath(index: number, variant: 'desktop' | 'mobile' = 'desktop'): string {
  const safe = Math.max(0, Math.min(TOTAL_FRAMES - 1, index | 0));
  return `/frames/${variant}/${padFrame(safe)}.webp`;
}

/** Build the full ordered list of frame URLs for a given variant. */
export function allFramePaths(variant: 'desktop' | 'mobile' = 'desktop'): string[] {
  return Array.from({ length: TOTAL_FRAMES }, (_, i) => framePath(i, variant));
}
