'use client';

import { useEffect, useState } from 'react';
import { isLoaderComplete, subscribeLoader } from '@/utils/loader-state';

/**
 * Returns `true` once the global loader has finished its entrance sequence.
 * Components use this to kick off their own reveal animations.
 */
export function useLoaderComplete(): boolean {
  const [done, setDone] = useState<boolean>(() => isLoaderComplete());

  useEffect(() => {
    if (done) return;
    const unsub = subscribeLoader(() => setDone(true));
    // Guard against the (rare) race where the state flipped between render and subscribe.
    if (isLoaderComplete()) setDone(true);
    return unsub;
  }, [done]);

  return done;
}