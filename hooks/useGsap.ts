'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';

/**
 * useGsap — runs a GSAP setup inside a gsap.context() so every tween / ScrollTrigger
 * created inside it is cleaned up automatically when the component unmounts or
 * the dependencies change. Uses useLayoutEffect so animations run before paint.
 *
 * The callback receives the live `gsap.Context` so you can `self.add(...)` labeled
 * setups and reference them in cleanup logic.
 */
export function useGsap(
  setup: (ctx: gsap.Context) => void | (() => void),
  deps: React.DependencyList = [],
  scope?: React.RefObject<Element>,
) {
  useLayoutEffect(() => {
    let cleanup: void | (() => void);

    const ctx = gsap.context((self) => {
      cleanup = setup(self);
    }, scope?.current ?? undefined);

    return () => {
      if (typeof cleanup === 'function') cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}