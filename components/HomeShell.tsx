'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroVideos from '@/components/HeroVideos';

const FrameScrollCanvas = dynamic(() => import('@/components/FrameScrollCanvas'), { ssr: false });
const IntroSection = dynamic(() => import('@/components/IntroSection'), { ssr: false });
const DesertWindSection = dynamic(() => import('@/components/DesertWindSection'), { ssr: false });
const StatsSection = dynamic(() => import('@/components/StatsSection'), { ssr: false });
const FeaturesSection = dynamic(() => import('@/components/FeaturesSection'), { ssr: false });
const HorizontalShowcase = dynamic(() => import('@/components/HorizontalShowcase'), { ssr: false });
const DestinationsMarquee = dynamic(() => import('@/components/DestinationsMarquee'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function HomeShell() {
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const timers: ReturnType<typeof setTimeout>[] = [];
    const r = (ms: number) => timers.push(setTimeout(() => ScrollTrigger.refresh(), ms));

    // Staggered refresh cascade covers all dynamic import timing windows
    r(100); r(300); r(600); r(1200); r(2500);

    const onLoad = () => r(50);
    window.addEventListener('load', onLoad);
    document.fonts?.ready.then(() => r(50));

    // MutationObserver fires whenever a dynamic chunk mounts a new child
    // into <main> — guarantees a refresh after every section appears.
    let moTimer: ReturnType<typeof setTimeout>;
    const mo = new MutationObserver(() => {
      clearTimeout(moTimer);
      moTimer = setTimeout(() => ScrollTrigger.refresh(), 80);
    });
    if (mainRef.current) {
      mo.observe(mainRef.current, { childList: true, subtree: false });
    }

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(moTimer);
      mo.disconnect();
      window.removeEventListener('load', onLoad);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // ─── LAYOUT RULES — DO NOT VIOLATE ────────────────────────────────────────
  //
  // <main> and every direct section child MUST have:
  //   • NO `position` other than the default (static)  — or if needed, only
  //     `position: relative` WITHOUT any z-index
  //   • NO `transform` / `will-change: transform` at this level
  //   • NO `filter`, `isolation`, `contain` properties
  //
  // Any of these creates a CSS "containing block" that captures
  // `position: fixed` children. GSAP pins work by setting `position: fixed`
  // on the pinned element — if a containing block intercepts it, the element
  // is pinned relative to that block (wrong) instead of the viewport (correct).
  //
  // Safe z-index layering: use it only on elements INSIDE a section
  // (overlays, chips, progress bars) — never on the section root itself.
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <main ref={mainRef} className="bg-ink-950">
      <FrameScrollCanvas />
      <HeroVideos />
      <IntroSection />
      <DesertWindSection />
      <StatsSection />
      <FeaturesSection />
      <DestinationsMarquee />
      <Footer />
    </main>
  );
}