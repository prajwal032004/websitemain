'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      lerp: 0.1,
    });

    lenisRef.current = lenis;

    // ── CRITICAL: tell ScrollTrigger to use Lenis for scroll measurements ──
    //
    // Without scrollerProxy, ScrollTrigger reads window.scrollY (native),
    // but Lenis intercepts wheel events and updates its own virtual scroll
    // position — the two values diverge during smooth scrolling. This causes
    // ScrollTrigger to fire pin/unpin at the wrong scroll positions, which
    // looks like sections overlapping.
    //
    // scrollerProxy makes ScrollTrigger ask Lenis for the scroll position
    // and the element's bounding rect, so both systems always agree.
    // ──────────────────────────────────────────────────────────────────────
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      // Required: tells GSAP this scroller uses CSS transforms (Lenis does)
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    });

    // Drive Lenis from GSAP ticker so they stay frame-locked
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Each Lenis scroll tick → refresh ScrollTrigger's internal scroll state
    lenis.on('scroll', ScrollTrigger.update);

    // ResizeObserver: debounced refresh when body height changes (dynamic imports)
    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.body);

    return () => {
      clearTimeout(resizeTimer);
      ro.disconnect();
      gsap.ticker.remove(update);
      ScrollTrigger.scrollerProxy(document.body, undefined as never); // remove proxy
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}