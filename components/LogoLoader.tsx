'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Logo from './Logo';
import { markLoaderComplete, isLoaderComplete } from '@/utils/loader-state';
import { cn } from '@/utils/cn';

/** How long the logo sits centered before beginning the FLIP, in ms. */
const HOLD_BEFORE_FLIP_MS = 900;

/**
 * LogoLoader
 * ----------
 * A centered Meridian mark that briefly holds, then FLIPs into the navbar's
 * `[data-logo-target]` element. The target is the *real* navbar logo — always
 * visible, always in the DOM — so when this component unmounts after the FLIP
 * completes, there is no visible gap or fade: the flying logo arrives exactly
 * on top of the navbar logo, the curtain lifts above them, and whatever remains
 * after unmount IS the navbar logo. Zero flicker.
 *
 * Reliability fixes vs prior versions
 * -----------------------------------
 *  - `await document.fonts.ready` before measuring → stable bounding rects.
 *  - Two rAFs after font ready → ensures layout + paint have committed.
 *  - The curtain lift finishes AFTER the logo arrives at target, not before.
 *  - If the target can't be found for any reason, we fall back to a clean fade.
 */
export default function LogoLoader() {
  const [state, setState] = useState<'entering' | 'holding' | 'flying' | 'done'>(
    () => (isLoaderComplete() ? 'done' : 'entering'),
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  // Entrance
  useEffect(() => {
    if (state !== 'entering') return;
    if (!rootRef.current || !logoRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => setState('holding'),
    });

    tl.fromTo(rootRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 })
      .fromTo(
        logoRef.current,
        { opacity: 0, y: 14, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 },
        '-=0.1',
      )
      .fromTo(
        ['[data-loader-top]', '[data-loader-bottom]', '[data-loader-sub]'],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 },
        '-=0.85',
      );

    return () => {
      tl.kill();
    };
  }, [state]);

  // Hold
  useEffect(() => {
    if (state !== 'holding') return;
    const t = window.setTimeout(() => setState('flying'), HOLD_BEFORE_FLIP_MS);
    return () => window.clearTimeout(t);
  }, [state]);

  // FLIP
  useEffect(() => {
    if (state !== 'flying') return;
    if (!rootRef.current || !logoRef.current) {
      markLoaderComplete();
      setState('done');
      return;
    }

    const logoEl = logoRef.current;
    const rootEl = rootRef.current;

    let killed = false;
    let tl: gsap.core.Timeline | null = null;

    const run = async () => {
      // 1. Wait for web fonts so the source logo has its final metrics.
      try {
        if (typeof document !== 'undefined' && document.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch {
        /* never fatal */
      }

      // 2. Two rAFs — the first completes any pending layout, the second
      //    guarantees the browser has painted. `getBoundingClientRect` is then
      //    reading the *final* rendered position, not an intermediate one.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      if (killed) return;

      const target = document.querySelector<HTMLElement>('[data-logo-target]');

      // Graceful fallback if target isn't in the DOM (shouldn't happen,
      // but navigation edge cases could theoretically lose it).
      if (!target) {
        tl = gsap.timeline({
          onComplete: () => {
            markLoaderComplete();
            setState('done');
          },
        });
        tl.to(rootEl, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' });
        return;
      }

      // 3. Measure both rects AT THIS MOMENT — the navbar target is always
      //    visible so its rect is reliable.
      const srcRect = logoEl.getBoundingClientRect();
      const dstRect = target.getBoundingClientRect();

      // Guard against degenerate measurements.
      if (srcRect.width === 0 || dstRect.width === 0) {
        tl = gsap.timeline({
          onComplete: () => {
            markLoaderComplete();
            setState('done');
          },
        });
        tl.to(rootEl, { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' });
        return;
      }

      const dx = dstRect.left - srcRect.left;
      const dy = dstRect.top - srcRect.top;
      const scale = dstRect.width / srcRect.width;

      // 4. Choreograph:
      //    - Meta copy fades out first (clean canvas for the flight).
      //    - The logo tweens to the target position.
      //    - The curtain lifts LAST so the logo has landed on top of the
      //      navbar logo before the background disappears. That overlap is
      //      what makes the handoff invisible.
      tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          markLoaderComplete();
          setState('done');
        },
      });

      tl.to(
        ['[data-loader-top]', '[data-loader-bottom]', '[data-loader-sub]', '[data-loader-glow]'],
        { opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power2.in' },
        0,
      )
        .to(
          logoEl,
          {
            x: dx,
            y: dy,
            scale,
            duration: 1.1,
            ease: 'power3.inOut',
          },
          0.1,
        )
        // Curtain lift starts when the logo has mostly arrived, finishes after.
        .to(
          rootEl,
          {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.75,
            ease: 'power3.inOut',
          },
          '-=0.35',
        );
    };

    void run();

    return () => {
      killed = true;
      tl?.kill();
    };
  }, [state]);

  if (state === 'done') return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-hidden={state === 'flying'}
      className={cn(
        'fixed inset-0 z-[100] grain overflow-hidden bg-ink-950 text-bone-100',
        'grid grid-rows-[auto_1fr_auto]',
      )}
      style={{
        clipPath: 'inset(0 0 0 0)',
        opacity: 0,
      }}
    >
      <div
        data-loader-glow
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 40% at 50% 55%, rgba(226,137,58,0.18) 0%, rgba(226,137,58,0.05) 45%, transparent 75%)',
        }}
      />

      <header
        data-loader-top
        className="relative z-10 flex items-baseline justify-between px-6 pt-6 font-mono text-[11px] uppercase tracking-superwide text-bone-400 md:px-12 md:pt-10"
      >
        <span>Meridian / 46°12′N 6°09′E</span>
        <span className="hidden md:inline">Sequence 07 — Preparing</span>
      </header>

      <div className="relative z-10 grid place-items-center px-6">
        <div
          ref={logoRef}
          className="text-[56px] will-animate md:text-[72px]"
          style={{
            transformOrigin: 'top left',
            display: 'inline-block',
          }}
        >
          <Logo />
        </div>

        <div
          data-loader-sub
          className="mt-10 text-center font-display text-base italic text-bone-300/80 md:text-lg"
        >
          <span className="text-bone-400">—</span>&nbsp;&nbsp;Private Expeditions&nbsp;&nbsp;
          <span className="text-bone-400">—</span>
        </div>
      </div>

      <footer
        data-loader-bottom
        className="relative z-10 flex items-end justify-between px-6 pb-8 font-mono text-[11px] uppercase tracking-superwide text-bone-400 md:px-12 md:pb-12"
      >
        <span>MMXXVI — Vol. 07</span>
        <span className="hidden md:inline">All systems nominal</span>
      </footer>
    </div>
  );
}