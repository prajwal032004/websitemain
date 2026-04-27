'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroVideos from '@/components/HeroVideos';

// Heavy interactive sections split into their own chunks.
const FrameScrollCanvas = dynamic(
  () => import('@/components/FrameScrollCanvas'),
  { ssr: false, loading: () => null },
);
const IntroSection = dynamic(
  () => import('@/components/IntroSection'),
  { ssr: false },
);
const DesertWindSection = dynamic(
  () => import('@/components/DesertWindSection'),
  { ssr: false },
);
const StatsSection = dynamic(
  () => import('@/components/StatsSection'),
  { ssr: false },
);
const FeaturesSection = dynamic(
  () => import('@/components/FeaturesSection'),
  { ssr: false },
);
const HorizontalShowcase = dynamic(
  () => import('@/components/HorizontalShowcase'),
  { ssr: false },
);
const DestinationsMarquee = dynamic(
  () => import('@/components/DestinationsMarquee'),
  { ssr: false },
);
const Footer = dynamic(
  () => import('@/components/Footer'),
  { ssr: false },
);

export default function HomeShell() {
  // ── Global ScrollTrigger refresh after all dynamic chunks mount ──────────
  //
  // Problem: every dynamic() import resolves asynchronously. By the time
  // HorizontalShowcase (the last pinned section) mounts and measures its
  // track width, earlier ScrollTriggers (FrameScrollCanvas pin, chapter
  // triggers) have already stored stale pixel offsets based on a shorter
  // document. This causes:
  //   • HorizontalShowcase pin starting too early / too late
  //   • FrameScrollCanvas overshooting its scroll budget
  //   • 1-frame "jump" when crossing section boundaries
  //
  // Fix: after the first paint where all sections are in the DOM, call
  // ScrollTrigger.refresh() which forces GSAP to re-walk the document,
  // remeasure every trigger start/end, and repin correctly.
  //
  // We use two refresh calls:
  //   1. After a short rAF delay (catches sections that mounted synchronously
  //      but whose images/fonts haven't loaded yet).
  //   2. After 1.5 s (catches lazy-loaded images that affect document height
  //      — particularly the DesertWindSection Next/Image panels).
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // First pass — after browser has painted the initial layout.
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    // Second pass — after images and web fonts are likely loaded.
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  return (
    <main className="relative">
      <FrameScrollCanvas />
      <HeroVideos />
      <IntroSection />
      <DesertWindSection />
      <StatsSection />
      <FeaturesSection />
      <HorizontalShowcase />
      <DestinationsMarquee />
      <Footer />
    </main>
  );
}