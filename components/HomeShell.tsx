'use client';

import dynamic from 'next/dynamic';
import HeroVideos from '@/components/HeroVideos';

// Heavy interactive sections split into their own chunks.
const FrameScrollCanvas = dynamic(
  () => import('@/components/FrameScrollCanvas'),
  { ssr: false, loading: () => null },
);
const IntroSection = dynamic(() => import('@/components/IntroSection'), { ssr: false });
const DesertWindSection = dynamic(() => import('@/components/DesertWindSection'), { ssr: false });
const StatsSection = dynamic(() => import('@/components/StatsSection'), { ssr: false });
const FeaturesSection = dynamic(() => import('@/components/FeaturesSection'), { ssr: false });
const HorizontalShowcase = dynamic(() => import('@/components/HorizontalShowcase'), { ssr: false });
const DestinationsMarquee = dynamic(
  () => import('@/components/DestinationsMarquee'),
  { ssr: false },
);
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function HomeShell() {
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