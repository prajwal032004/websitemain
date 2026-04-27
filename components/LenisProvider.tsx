'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect the user's reduced-motion preference — skip Lenis entirely.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out-ish
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      lerp: 0.1,
    });

    lenisRef.current = lenis;

    // Drive Lenis from GSAP's ticker so ScrollTrigger and Lenis stay in perfect sync.
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Each Lenis scroll event refreshes ScrollTrigger's measurements instantly.
    lenis.on('scroll', ScrollTrigger.update);

    // CRITICAL FIX: Next.js dynamic imports cause elements to pop in at different times.
    // This debounced ResizeObserver ensures GSAP recalculates all trigger positions
    // once the DOM settles, preventing pinned sections from overlapping earlier content.
    let timeoutId: NodeJS.Timeout;
    const ro = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    });
    ro.observe(document.body);

    return () => {
      clearTimeout(timeoutId);
      ro.disconnect();
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
