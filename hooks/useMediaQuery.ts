'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe media query hook.
 * Returns `null` on the server and on the first client render, then the real value
 * after hydration — so consumers can decide how to handle the indeterminate state.
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mql = window.matchMedia(query);

    const apply = () => setMatches(mql.matches);
    apply();

    // Modern Safari / everything else
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', apply);
      return () => mql.removeEventListener('change', apply);
    }
    // Legacy fallback (older Safari)
    mql.addListener(apply);
    return () => mql.removeListener(apply);
  }, [query]);

  return matches;
}
