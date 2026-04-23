export const TOTAL_FRAMES = 151;

export function padFrame(index: number): string {
  return String(index).padStart(4, '0');
}

export function framePath(index: number, variant: 'desktop' | 'mobile' = 'desktop'): string {
  const safe = Math.max(0, Math.min(TOTAL_FRAMES - 1, index | 0));
  return `/frames/${variant}/${padFrame(safe)}.webp`;
}

export function allFramePaths(variant: 'desktop' | 'mobile' = 'desktop'): string[] {
  return Array.from({ length: TOTAL_FRAMES }, (_, i) => framePath(i, variant));
}
