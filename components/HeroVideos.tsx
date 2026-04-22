'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { useLoaderComplete } from '@/hooks/useLoaderComplete';

/* ─────────────────────────────────────────────
   HeroVideos — responsive full-bleed video hero

   Desktop (≥768px) → plays /videos/hero-desktop.mp4
   Mobile  (<768px) → plays /videos/hero-mobile.mp4

   Required assets:
     /videos/hero-desktop.mp4   — landscape reel
     /videos/hero-mobile.mp4    — portrait / square reel
───────────────────────────────────────────── */

const DESKTOP_BP = 768;

/** SSR-safe hook — returns true once window confirms ≥768 px */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BP}px)`);
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

export default function HeroVideos() {
  const active     = useLoaderComplete();
  const sectionRef = useRef<HTMLElement | null>(null);
  const desktopRef = useRef<HTMLVideoElement | null>(null);
  const mobileRef  = useRef<HTMLVideoElement | null>(null);

  const isDesktop = useIsDesktop();

  // Play the active video, pause + reset the inactive one
  useEffect(() => {
    const activeVid  = isDesktop ? desktopRef.current : mobileRef.current;
    const passiveVid = isDesktop ? mobileRef.current  : desktopRef.current;

    if (passiveVid) { passiveVid.pause(); passiveVid.currentTime = 0; }
    if (activeVid)  { activeVid.play().catch(() => {}); }
  }, [isDesktop]);

  useGsap(
    () => {
      if (!active || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      // ── Intro timeline ──────────────────────────────────────────────
      const intro = gsap.timeline({
        defaults: { ease: 'expo.out', duration: 1.5 },
        delay: 0.1,
      });

      intro
        .from('[data-hv-video]',        { scale: 1.08, opacity: 0, duration: 1.8 }, 0)
        .from('[data-hv-overlay]',      { opacity: 0,  duration: 1.2 }, 0.2)
        .from('[data-hv-eyebrow]',      { y: 16, opacity: 0, stagger: 0.1, duration: 1 }, 0.5)
        .from('[data-hv-line]',         { yPercent: 115, opacity: 0, stagger: 0.1, duration: 1.1 }, 0.65)
        .from('[data-hv-sub]',          { y: 18, opacity: 0, duration: 0.9, ease: 'power3.out' }, 1.0)
        .from('[data-hv-cta]',          { y: 18, opacity: 0, duration: 0.9, ease: 'power3.out' }, 1.1)
        .from('[data-hv-badge]',        { scale: 0.85, opacity: 0, duration: 1, ease: 'back.out(1.6)' }, 1.1)
        .from('[data-hv-corners] span', { opacity: 0, stagger: 0.07, duration: 0.5 }, 0.4);

      // ── Scroll parallax ─────────────────────────────────────────────
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end:   'bottom top',
          scrub: 0.7,
        },
      })
        .to('[data-hv-video]',    { scale: 1.06, ease: 'none' }, 0)
        .to('[data-hv-headline]', { y: -90, opacity: 0.6, ease: 'none' }, 0);
    },
    [active],
    sectionRef,
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Reset & design tokens ──────────────────── */
        #hv-section *,
        #hv-section *::before,
        #hv-section *::after { box-sizing: border-box; }

        #hv-section {
          --hv-bg:          #080706;
          --hv-fg:          #f2e9d4;
          --hv-fg-muted:    rgba(242,233,212,0.55);
          --hv-accent:      #e08c3c;
          --hv-accent-2:    #c96d20;
          --hv-line:        rgba(242,233,212,0.18);
          --hv-line-strong: rgba(242,233,212,0.28);
          --hv-radius:      6px;
          --hv-ease-out:    cubic-bezier(0.22, 1, 0.36, 1);

          position: relative;
          isolation: isolate;
          width: 100%;
          min-height: 100svh;
          min-height: 100dvh;
          overflow: hidden;
          background: var(--hv-bg);
          display: flex;
          flex-direction: column;
        }

        /* ── Video wrapper ──────────────────────────── */
        #hv-video-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /*
         * Both videos are stacked in the same slot via position:absolute.
         * CSS media queries show one and hide the other — no JS flash.
         * The JS useEffect also plays/pauses to save bandwidth.
         */
        #hv-video-wrap video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          will-change: transform;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        /* Desktop video — visible at ≥768px */
        @media (min-width: 768px) {
          #hv-video-desktop { opacity: 1; }
          #hv-video-mobile  { opacity: 0; }
        }

        /* Mobile video — visible below 768px */
        @media (max-width: 767px) {
          #hv-video-mobile  { opacity: 1; object-position: center top; }
          #hv-video-desktop { opacity: 0; }
        }

        /* ── Overlay gradients ──────────────────────── */
        #hv-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(to bottom,
              rgba(8,7,6,0.68) 0%,
              rgba(8,7,6,0.10) 28%,
              transparent 48%
            ),
            linear-gradient(to top,
              rgba(8,7,6,0.92) 0%,
              rgba(8,7,6,0.55) 26%,
              transparent 52%
            ),
            radial-gradient(ellipse 90% 60% at 50% 110%,
              rgba(180,80,10,0.22) 0%,
              transparent 70%
            );
        }

        /* ── Decorative corner ticks ────────────────── */
        #hv-corners {
          position: absolute;
          inset: 20px;
          pointer-events: none;
          z-index: 4;
        }
        @media (min-width: 768px) { #hv-corners { inset: 28px; } }

        #hv-corners span { position: absolute; display: block; }

        #hv-corners span:nth-child(1) { top: 0; left: 0; width: 22px; height: 1px; background: var(--hv-line-strong); }
        #hv-corners span:nth-child(2) { top: 0; left: 0; width: 1px; height: 22px; background: var(--hv-line-strong); }
        #hv-corners span:nth-child(3) { top: 0; right: 0; width: 22px; height: 1px; background: var(--hv-line-strong); }
        #hv-corners span:nth-child(4) { top: 0; right: 0; width: 1px; height: 22px; background: var(--hv-line-strong); }
        #hv-corners span:nth-child(5) { bottom: 0; left: 0; width: 22px; height: 1px; background: var(--hv-line-strong); }
        #hv-corners span:nth-child(6) { bottom: 0; left: 0; width: 1px; height: 22px; background: var(--hv-line-strong); }
        #hv-corners span:nth-child(7) { bottom: 0; right: 0; width: 22px; height: 1px; background: var(--hv-line-strong); }
        #hv-corners span:nth-child(8) { bottom: 0; right: 0; width: 1px; height: 22px; background: var(--hv-line-strong); }

        /* ── Content layer ──────────────────────────── */
        #hv-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100svh;
          min-height: 100dvh;
          padding: 0 20px;
        }
        @media (min-width: 640px)  { #hv-content { padding: 0 32px; } }
        @media (min-width: 768px)  { #hv-content { padding: 0 48px; } }
        @media (min-width: 1024px) { #hv-content { padding: 0 64px; } }
        @media (min-width: 1440px) { #hv-content { padding: 0 80px; } }

        /* ── Top bar ────────────────────────────────── */
        #hv-topbar {
          padding-top: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        @media (min-width: 768px) { #hv-topbar { padding-top: 36px; } }

        .hv-eyebrow {
          font-family: ui-monospace, 'SF Mono', 'Fira Code', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--hv-fg-muted);
          white-space: nowrap;
        }
        @media (min-width: 768px) { .hv-eyebrow { font-size: 11px; } }

        #hv-wordmark {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 15px;
          font-style: italic;
          letter-spacing: 0.06em;
          color: var(--hv-fg);
        }
        @media (min-width: 768px) { #hv-wordmark { font-size: 17px; } }

        /* ── Headline ───────────────────────────────── */
        #hv-headline { padding: 0; }

        #hv-headline h1 {
          margin: 0;
          font-family: Georgia, 'Times New Roman', serif;
          font-weight: 400;
          color: var(--hv-fg);
          font-size: clamp(52px, 11vw, 96px);
          line-height: 0.90;
          letter-spacing: -0.025em;
        }
        @media (min-width: 768px) {
          #hv-headline h1 { font-size: clamp(64px, 9.5vw, 112px); }
        }

        .hv-line-wrap { overflow: hidden; display: block; }
        .hv-line-wrap + .hv-line-wrap { margin-top: 0.04em; }

        .hv-line-indent { padding-left: 12vw; }
        @media (min-width: 768px) { .hv-line-indent { padding-left: 18vw; } }

        .hv-accent-word { color: var(--hv-accent); font-style: italic; }

        /* ── Sub-copy ────────────────────────────────── */
        #hv-sub {
          margin-top: 28px;
          max-width: 480px;
          font-size: 14px;
          line-height: 1.65;
          color: rgba(242,233,212,0.70);
          font-family: ui-sans-serif, system-ui, sans-serif;
        }
        @media (min-width: 768px) { #hv-sub { font-size: 15px; margin-top: 32px; } }

        /* ── Bottom bar ─────────────────────────────── */
        #hv-bottom {
          padding-bottom: 32px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }
        @media (min-width: 768px) { #hv-bottom { padding-bottom: 44px; } }

        #hv-cta {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: var(--hv-fg);
          font-family: ui-monospace, 'SF Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        @media (min-width: 768px) { #hv-cta { font-size: 11px; } }

        #hv-cta:hover { color: var(--hv-accent); }
        #hv-cta:hover #hv-cta-arrow { transform: translateX(4px); }

        #hv-cta-line {
          width: 40px; height: 1px;
          background: var(--hv-line-strong);
          position: relative; overflow: hidden;
        }
        @media (min-width: 768px) { #hv-cta-line { width: 56px; } }

        #hv-cta-line::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: var(--hv-accent);
          animation: hv-shimmer 2.4s linear infinite;
        }

        #hv-cta-arrow {
          display: inline-block;
          transition: transform 0.3s var(--hv-ease-out);
          font-style: normal;
        }

        /* badge — desktop only */
        #hv-badge {
          display: none;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        @media (min-width: 768px) { #hv-badge { display: flex; } }

        #hv-badge-ring {
          width: 64px; height: 64px;
          border-radius: 50%;
          border: 1px solid var(--hv-line-strong);
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        #hv-badge-ring::before {
          content: '';
          position: absolute; inset: 6px;
          border-radius: 50%;
          border: 1px solid var(--hv-line);
        }
        #hv-badge-year {
          font-family: Georgia, serif;
          font-size: 13px;
          color: var(--hv-fg-muted);
          font-style: italic;
        }

        /* progress bar */
        #hv-progress {
          position: absolute;
          bottom: 0; left: 0;
          width: 30%; height: 2px;
          background: linear-gradient(to right, var(--hv-accent-2), var(--hv-accent));
          animation: hv-progress 12s linear infinite;
          transform-origin: left;
        }

        /* ── Keyframes ──────────────────────────────── */
        @keyframes hv-shimmer {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes hv-progress {
          0%   { width: 0%; }
          100% { width: 100%; }
        }

        /* ── Reduced motion ─────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          #hv-cta-line::after,
          #hv-progress { animation: none !important; }
        }
       `}} />

      <section ref={sectionRef} id="hv-section" data-section="hero">

        {/* ── Two videos stacked — CSS shows one, JS plays one ── */}
        <div id="hv-video-wrap" data-hv-video>
          <video
            id="hv-video-desktop"
            ref={desktopRef}
            src="/videos/desktop.mp4"
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
            aria-hidden
          />
          <video
            id="hv-video-mobile"
            ref={mobileRef}
            src="/videos/mobile.mp4"
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
            aria-hidden
          />
        </div>

        <div id="hv-overlay" aria-hidden data-hv-overlay />

        <div id="hv-corners" aria-hidden data-hv-corners>
          {Array.from({ length: 8 }).map((_, i) => <span key={i} />)}
        </div>

        <div id="hv-progress" aria-hidden />

        <div id="hv-content" data-hv-headline>

          <div id="hv-topbar" />

          <div id="hv-headline">
            <h1>
              <span className="hv-line-wrap">
                <span data-hv-line className="block">
                  Private{' '}
                  <em className="hv-accent-word">Journeys</em>
                </span>
              </span>
              <span className="hv-line-wrap">
                <span data-hv-line className="hv-line-indent block">
                  beyond{' '}
                  <em className="hv-accent-word">Limits</em>
                </span>
              </span>
            </h1>

            <p id="hv-sub" data-hv-sub>
              Meridian crafts bespoke voyages for twelve passengers at a time —
              from frozen Patagonian fjords to the last light over the
              Rub&rsquo; al Khali. No brochure. No itinerary. Only the horizon
              you choose.
            </p>
          </div>

          <div id="hv-bottom">
            <a href="#manifesto" id="hv-cta" data-hv-cta aria-label="Scroll to manifesto">
              <span id="hv-cta-line" />
              <span>Continue</span>
              <i id="hv-cta-arrow" aria-hidden>→</i>
            </a>

            <div id="hv-badge" data-hv-badge aria-hidden>
              <div id="hv-badge-ring">
                <span id="hv-badge-year">&#x2715;</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}