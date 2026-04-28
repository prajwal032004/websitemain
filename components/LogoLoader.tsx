'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { markLoaderComplete, isLoaderComplete } from '@/utils/loader-state';

/**
 * LogoLoader — Synkyn Studios edition
 * ────────────────────────────────────
 * Timeline (~4.0s total):
 *
 *   0.00s  — Black screen appears (instant)
 *   0.10s  — Eyebrow line fades in
 *   0.25s  — Logo image scales+fades in with a slight blur clear
 *   0.40s  — Counter 000→100 (ease-out-cubic, 2.1s)
 *   2.50s  — Counter reaches 100, brief hold
 *   2.52s  — Logo glitch flicker
 *   2.72s  — Eyebrow + counter fade out (logo stays visible!)
 *   2.85s  — Vertical curtain split: top half → ↑, bottom half → ↓  (1.0s)
 *   3.00s  — Logo PNG rockets from center → navbar logo position (0.85s)
 *   3.85s  — Logo arrives; navbar logo fades in (via CSS class toggle)
 *   4.00s  — markLoaderComplete() fires, component removes from DOM
 *
 * The logo element is NOT faded out with the brand — it stays visible and
 * travels to the navbar using a FLIP-style GSAP transform. The navbar watches
 * for the [data-nav-logo-ready] attribute on <html> to trigger its own reveal.
 */
export default function LogoLoader() {
  const [done, setDone] = useState(() => isLoaderComplete());

  const topCurtainRef = useRef<HTMLDivElement | null>(null);
  const botCurtainRef = useRef<HTMLDivElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const counterWrapRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const logoImgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (done) return;

    const top = topCurtainRef.current;
    const bot = botCurtainRef.current;
    const brand = brandRef.current;
    const counter = counterRef.current;
    const counterWrap = counterWrapRef.current;
    const eyebrow = eyebrowRef.current;
    const logoImg = logoImgRef.current;

    if (!top || !bot || !brand || !counter || !counterWrap || !eyebrow || !logoImg) return;

    // Prevent background scroll while loader is active
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    gsap.killTweensOf([top, bot, brand, counter, counterWrap, eyebrow, logoImg]);

    // ── 1. Initial states ─────────────────────────────────────────────────
    gsap.set(brand, { opacity: 0 });
    gsap.set(eyebrow, { opacity: 0, y: 12 });
    gsap.set(logoImg, { opacity: 0, scale: 0.88, filter: 'blur(8px)' });
    gsap.set(top, { yPercent: 0 });
    gsap.set(bot, { yPercent: 0 });
    gsap.set(counterWrap, { opacity: 1 });

    // ── 2. Master timeline ────────────────────────────────────────────────
    const masterTl = gsap.timeline({
      onComplete: () => {
        // Small grace period so the logo travel tween fully finishes
        // and the navbar CSS transition has time to play before DOM teardown
        gsap.delayedCall(0.15, () => {
          markLoaderComplete();
          setDone(true);
          document.body.style.overflow = prevOverflow;
        });
      },
    });

    // Brand enters (whole wrapper fades in)
    masterTl
      .to(brand, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 0.10)
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.10)
      .to(logoImg, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.0,
        ease: 'expo.out',
      }, 0.25);

    // Counter: animate plain object → write to DOM without React re-renders
    const countObj = { value: 0 };
    masterTl.to(countObj, {
      value: 100,
      duration: 2.1,
      ease: 'power3.out',
      onUpdate: () => {
        if (counter) {
          counter.textContent = String(Math.round(countObj.value)).padStart(3, '0');
        }
      },
    }, 0.4);

    // Glitch flicker when counter hits 100
    masterTl.to(logoImg, {
      opacity: 0.7,
      duration: 0.06,
      ease: 'none',
      yoyo: true,
      repeat: 2,
    }, 2.52);

    // ── Exit: fade eyebrow + counter ONLY — logo stays alive for travel ──
    masterTl
      .to(eyebrow, { opacity: 0, y: -8, duration: 0.30, ease: 'power2.in' }, 2.72)
      .to(counterWrap, { opacity: 0, duration: 0.30, ease: 'power2.in' }, 2.72);

    // ── Curtain split ─────────────────────────────────────────────────────
    const EASE = 'power4.inOut';
    masterTl
      .to(top, { yPercent: -100, duration: 1.0, ease: EASE }, 2.85)
      .to(bot, { yPercent: 100, duration: 1.0, ease: EASE }, 2.85);

    // ── Logo travel: fires 0.15s after curtain starts opening ─────────────
    // We launch a standalone gsap.to (not part of masterTl) because we need
    // the live bounding rects at the moment of execution, not at build time.
    masterTl.add(() => {
      // The navbar attaches [data-nav-logo] to its logo container
      const navTarget = document.querySelector<HTMLElement>('[data-nav-logo]');
      if (!navTarget) return;

      const fromRect = logoImg.getBoundingClientRect();
      const toRect = navTarget.getBoundingClientRect();

      // FLIP: compute the translate + scale needed to move logo center → nav logo center
      const fromCX = fromRect.left + fromRect.width / 2;
      const fromCY = fromRect.top + fromRect.height / 2;
      const toCX = toRect.left + toRect.width / 2;
      const toCY = toRect.top + toRect.height / 2;

      const dx = toCX - fromCX;
      const dy = toCY - fromCY;
      const scale = toRect.width / fromRect.width;

      gsap.to(logoImg, {
        x: dx,
        y: dy,
        scale,
        duration: 0.85,
        ease: 'power4.inOut',
        onComplete: () => {
          // Signal the navbar to reveal its own logo
          document.documentElement.setAttribute('data-nav-logo-ready', 'true');
        },
      });
    }, 3.00); // ← starts 0.15 s after curtain begins (3.00 - 2.85 = 0.15)

    // Extend masterTl so its onComplete fires at ~3.85s
    // (matches logo travel end: 3.00 + 0.85 = 3.85)
    masterTl.to(brand, { duration: 0 }, 3.85);

    return () => {
      masterTl.kill();
      document.body.style.overflow = prevOverflow;
      // Clean up attribute if component unmounts mid-animation
      document.documentElement.removeAttribute('data-nav-logo-ready');
    };
  }, [done]);

  if (done) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[200] pointer-events-none"
    >
      {/* ── Top curtain half ──────────────────────────────────────────── */}
      <div
        ref={topCurtainRef}
        className="absolute left-0 right-0 top-0 h-1/2 overflow-hidden"
        style={{ backgroundColor: '#0A0807' }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(ellipse at 30% 90%, rgba(230,207,68,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(184,170,40,0.20) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* ── Bottom curtain half ───────────────────────────────────────── */}
      <div
        ref={botCurtainRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden"
        style={{ backgroundColor: '#0A0807' }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(ellipse at 70% 10%, rgba(230,207,68,0.25) 0%, transparent 55%)',
          }}
        />
      </div>

      {/* ── Center brand ──────────────────────────────────────────────── */}
      {/* Sits above both curtains — visible while they're closed */}
      <div
        ref={brandRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ opacity: 0 }}
      >
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="mb-8 font-mono text-[11px] uppercase tracking-[0.4em] text-bone-300/60"
          style={{ opacity: 0 }}
        >
          A studio of visual expeditions
        </p>

        {/* Logo image — this is the element that will travel to the navbar */}
        <div
          ref={logoImgRef}
          className="relative flex items-center justify-center"
          style={{ opacity: 0 }}
        >
          {/* Ambient glow ring behind the logo */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(ellipse, rgba(230,207,68,0.20) 0%, transparent 70%)',
              transform: 'scale(1.6)',
            }}
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/synkyn-logo.png"
            alt="Synkyn Studios"
            className="h-auto w-[clamp(240px,40vw,520px)] select-none"
            draggable={false}
          />
        </div>

        {/* Counter */}
        <div ref={counterWrapRef} className="mt-10 flex items-baseline gap-3">
          <span
            ref={counterRef}
            className="font-mono text-[13px] tabular-nums tracking-[0.5em] text-bone-300/50"
          >
            000
          </span>
          <span className="font-mono text-[11px] tracking-[0.3em] text-bone-300/30">%</span>
        </div>
      </div>
    </div>
  );
}