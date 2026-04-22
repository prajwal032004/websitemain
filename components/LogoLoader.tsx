'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Logo from './Logo';
import { markLoaderComplete, isLoaderComplete } from '@/utils/loader-state';
import { cn } from '@/utils/cn';

/** How long the logo sits centered before it begins its transit, in ms. */
const HOLD_BEFORE_TRANSIT_MS = 1100;

/**
 * LogoLoader
 * ----------
 * Shows a centered Meridian mark, holds for a beat, then animates the logo
 * into the navbar's reserved slot (`[data-logo-target]`) using a FLIP-style
 * position+scale tween. No progress bar — the loader is purely a moment of
 * brand presentation, decoupled from any asset preloading.
 */
export default function LogoLoader() {
  // If this hook system has already marked the loader complete (e.g. a
  // client-side route change re-mounted this somehow), render nothing.
  const [state, setState] = useState<'pending' | 'entering' | 'transiting' | 'done'>(() =>
    isLoaderComplete() ? 'done' : 'pending',
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const subCopyRef = useRef<HTMLDivElement | null>(null);

  // Entrance — fade the loader + logo in
  useEffect(() => {
    if (state !== 'pending') return;
    if (!rootRef.current || !logoRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => setState('entering'),
    });

    tl.fromTo(
      rootRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.4 },
    )
      .fromTo(
        logoRef.current,
        { opacity: 0, y: 14, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 },
        '-=0.15',
      )
      .fromTo(
        [
          '[data-loader-top]',
          '[data-loader-bottom]',
          '[data-loader-sub]',
        ],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
        '-=0.85',
      );

    return () => {
      tl.kill();
    };
  }, [state]);

  // After entrance has finished, hold for a beat, then perform the FLIP.
  useEffect(() => {
    if (state !== 'entering') return;

    const timer = window.setTimeout(() => {
      setState('transiting');
    }, HOLD_BEFORE_TRANSIT_MS);

    return () => window.clearTimeout(timer);
  }, [state]);

  // The FLIP: measure both boxes, tween the source to the target.
  useEffect(() => {
    if (state !== 'transiting') return;
    if (!rootRef.current || !logoRef.current) {
      markLoaderComplete();
      setState('done');
      return;
    }

    const logoEl = logoRef.current;
    const target = document.querySelector<HTMLElement>('[data-logo-target]');

    // If the navbar target isn't mounted for any reason, fall back to a clean fade-out.
    if (!target) {
      const tl = gsap.timeline({
        onComplete: () => {
          markLoaderComplete();
          setState('done');
        },
      });
      tl.to(rootRef.current, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' });
      return () => {
        tl.kill();
      };
    }

    // Measure source and target bounding rects *right now* for accuracy.
    const srcRect = logoEl.getBoundingClientRect();
    const dstRect = target.getBoundingClientRect();

    const dx = dstRect.left - srcRect.left;
    const dy = dstRect.top - srcRect.top;
    const scale = dstRect.width / srcRect.width;

    // Tell the navbar slot to prepare to take over (it listens for the event).
    const prepare = new CustomEvent('meridian:logo-incoming');
    window.dispatchEvent(prepare);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        markLoaderComplete();
        setState('done');
      },
    });

    // 1) Background + ambient chrome fades out early so the logo is the focus.
    tl.to(
      [
        '[data-loader-top]',
        '[data-loader-bottom]',
        '[data-loader-sub]',
        '[data-loader-glow]',
      ],
      { opacity: 0, y: -6, duration: 0.55, stagger: 0.05, ease: 'power2.in' },
      0,
    );

    // 2) Logo transits to the navbar slot.
    tl.to(
      logoEl,
      {
        x: dx,
        y: dy,
        scale,
        duration: 1.15,
        ease: 'power3.inOut',
      },
      0.15,
    );

    // 3) Curtain lifts (clip-path sweep up) simultaneously.
    tl.to(
      rootRef.current,
      {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.95,
        ease: 'power4.inOut',
      },
      '-=0.55',
    );

    return () => {
      tl.kill();
    };
  }, [state]);

  if (state === 'done') return null;

  return (
    <div
      ref={rootRef}
      aria-hidden={state === 'transiting'}
      role="status"
      className={cn(
        'fixed inset-0 z-[100] grain overflow-hidden bg-ink-950 text-bone-100',
        'grid grid-rows-[auto_1fr_auto]',
      )}
      style={{
        clipPath: 'inset(0 0 0 0)',
        opacity: 0,
      }}
    >
      {/* Ambient warm glow */}
      <div
        data-loader-glow
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 40% at 50% 55%, rgba(226,137,58,0.18) 0%, rgba(226,137,58,0.05) 45%, transparent 75%)',
        }}
      />

      {/* Top meta */}
      <header
        data-loader-top
        className="relative z-10 flex items-baseline justify-between px-6 pt-6 font-mono text-[11px] uppercase tracking-superwide text-bone-400 md:px-12 md:pt-10"
      >
        <span>Meridian / 46°12′N 6°09′E</span>
        <span className="hidden md:inline">Sequence 07 — Preparing</span>
      </header>

      {/* Center stage — the logo sits here, transforms from here. */}
      <div className="relative z-10 grid place-items-center px-6">
        <div
          ref={logoRef}
          className="text-[56px] will-animate md:text-[72px]"
          style={{
            transformOrigin: 'top left',
            // Needed so getBoundingClientRect returns a stable initial value.
            display: 'inline-block',
          }}
        >
          <Logo />
        </div>

        <div
          ref={subCopyRef}
          data-loader-sub
          className="mt-10 text-center font-display text-base italic text-bone-300/80 md:text-lg"
        >
          <span className="text-bone-400">—</span>&nbsp;&nbsp;Private Expeditions&nbsp;&nbsp;
          <span className="text-bone-400">—</span>
        </div>
      </div>

      {/* Bottom meta */}
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