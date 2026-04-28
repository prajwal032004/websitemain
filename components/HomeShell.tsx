'use client';

import dynamic from 'next/dynamic';
import HeroVideos from '@/components/HeroVideos';

/**
 * HomeShell
 * ─────────
 * Sections are rendered in normal document flow — no wrapper divs with
 * explicit z-index or position values around individual sections.
 *
 * WHY: When FrameScrollCanvas is pinned via position:fixed by GSAP, it
 * escapes any CSS stacking context. If the surrounding wrapper has
 * z-index:1 it creates a new stacking context that conflicts with GSAP's
 * pin mechanism. We let GSAP manage stacking entirely via its pinSpacer.
 *
 * All sections are dynamically imported (ssr:false) so they don't compete
 * with FrameScrollCanvas's preloader on the initial server render.
 */

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
const HorizontalShowcase = dynamic(
  () => import('@/components/HorizontalShowcase'),
  { ssr: false },
);
const FeaturesSection = dynamic(
  () => import('@/components/FeaturesSection'),
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
  return (
    // `relative` only — no z-index, no overflow-hidden, no isolation.
    // Sections flow in document order. GSAP pinSpacers push sections down
    // correctly because nothing interrupts the natural stacking context.
    <main className="relative">
      <FrameScrollCanvas />
      <HeroVideos />
      <IntroSection />
      <DesertWindSection />
      <StatsSection />
      <HorizontalShowcase />
      <FeaturesSection />
      <DestinationsMarquee />
      <Footer />
    </main>
  );
}
