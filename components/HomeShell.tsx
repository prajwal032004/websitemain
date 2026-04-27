'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroVideos from '@/components/HeroVideos';

const FrameScrollCanvas = dynamic(
  () => import('@/components/FrameScrollCanvas'),
  { ssr: false, loading: () => null },
);
const IntroSection = dynamic(
  () => import('@/components/IntroSection'),
  { ssr: false, loading: () => null },
);
const DesertWindSection = dynamic(
  () => import('@/components/DesertWindSection'),
  { ssr: false, loading: () => null },
);
const StatsSection = dynamic(
  () => import('@/components/StatsSection'),
  { ssr: false, loading: () => null },
);
const FeaturesSection = dynamic(
  () => import('@/components/FeaturesSection'),
  { ssr: false, loading: () => null },
);
const HorizontalShowcase = dynamic(
  () => import('@/components/HorizontalShowcase'),
  { ssr: false, loading: () => null },
);
const DestinationsMarquee = dynamic(
  () => import('@/components/DestinationsMarquee'),
  { ssr: false, loading: () => null },
);
const Footer = dynamic(
  () => import('@/components/Footer'),
  { ssr: false, loading: () => null },
);

export default function HomeShell() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let debounceTimer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => ScrollTrigger.refresh(true), 120);
    };

    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);
    window.addEventListener('load', refresh);
    document.fonts.ready.then(refresh);

    return () => {
      clearTimeout(debounceTimer);
      ro.disconnect();
      window.removeEventListener('load', refresh);
    };
  }, []);

  // ─── Z-INDEX STRATEGY FOR GSAP PIN ───────────────────────────────────────
  //
  // When GSAP pins HorizontalShowcase it switches the <section> to
  // `position: fixed`. A fixed element escapes normal flow and competes
  // with every OTHER stacking context on the page for paint order.
  //
  // Every section with `position: relative` on its root IS a stacking
  // context. Without deliberate z-index values the browser paints them
  // in DOM order — sections that appear LATER in the DOM paint ON TOP of
  // earlier ones, including the fixed showcase. That's why DesertWind,
  // Stats and Features were appearing in front of (or behind) the pin.
  //
  // Three-layer z-index contract:
  //
  //   z 1  — sections ABOVE the showcase in the DOM.
  //           (FrameScrollCanvas → FeaturesSection)
  //           These scroll upward and out of view. They must NOT paint
  //           over the pinned showcase that appears below them in the DOM.
  //
  //   z 2  — the HorizontalShowcase itself (set inside that component).
  //           Sits above layer 1 while pinned. No wrapper here because
  //           any positioned ancestor would intercept `position:fixed`
  //           and re-anchor it to that ancestor instead of the viewport.
  //
  //   z 3  — sections BELOW the showcase in the DOM.
  //           (DestinationsMarquee, Footer)
  //           These scroll UP over the pinned showcase once the pin
  //           releases. They must paint on TOP of the pinned layer.
  //
  // `isolation: isolate` on each group creates a self-contained stacking
  // context so children's internal z-indexes don't leak out and interfere
  // with the showcase's z-index.
  //
  // CRITICAL: <main> must have NO `position` set. A positioned <main>
  // becomes the containing block for `position:fixed` children, so the
  // pinned section would be fixed relative to <main> (scrolls with page)
  // instead of the true viewport.

  return (
    <main className="bg-ink-950">

      {/* ── Layer 1: sections that scroll away ABOVE the pin ── */}
      <div style={{ position: 'relative', zIndex: 1, isolation: 'isolate' }}>
        <FrameScrollCanvas />
        <HeroVideos />
        <IntroSection />
        <DesertWindSection />
        <StatsSection />
        <FeaturesSection />
      </div>

      <HorizontalShowcase />

      <div style={{ position: 'relative', zIndex: 3, isolation: 'isolate' }}>
        <DestinationsMarquee />
        <Footer />
      </div>

    </main>
  );
}