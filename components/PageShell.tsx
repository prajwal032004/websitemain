'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import HeroVideos from '@/components/HeroVideos';
import SectionFade from '@/components/SectionFade';

// Heavy interactive components are split into their own chunks.
const FrameScrollCanvas = dynamic(
  () => import('@/components/FrameScrollCanvas'),
  { ssr: false, loading: () => null },
);
const IntroSection = dynamic(() => import('@/components/IntroSection'), {
  ssr: false,
});
const StatsSection = dynamic(() => import('@/components/StatsSection'), {
  ssr: false,
});
const FeaturesSection = dynamic(() => import('@/components/FeaturesSection'), {
  ssr: false,
});
const DestinationsMarquee = dynamic(
  () => import('@/components/DestinationsMarquee'),
  { ssr: false },
);
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function PageShell() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [loaderExited, setLoaderExited] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProgress = useCallback((p: number) => setProgress(p), []);
  const handleReady = useCallback(() => setReady(true), []);
  const handleError = useCallback((e: Error) => {
    // We keep the site functional even when the preloader degrades.
    setError(e.message);
    setReady(true); // let the loader exit — the canvas will still draw what it has.
  }, []);

  return (
    <>
      <Loader
        progress={progress}
        done={ready}
        onExited={() => setLoaderExited(true)}
        error={error}
      />

      <Navbar />

      <main className="relative bg-ink-950">
        <HeroVideos />
        <FrameScrollCanvas
          onProgress={handleProgress}
          onReady={handleReady}
          onError={handleError}
        />
        <IntroSection />
        <StatsSection />
        <FeaturesSection />
        <DestinationsMarquee />
        <SectionFade />
        <Footer />
      </main>
    </>
  );
}
