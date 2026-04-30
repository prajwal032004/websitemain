import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import AboutHero from '@/components/about/AboutHero';
import SectionFade from '@/components/SectionFade';

const StorySection = dynamic(() => import('@/components/about/StorySection'), { ssr: false });
const TeamGrid = dynamic(() => import('@/components/about/TeamGrid'), { ssr: false });
const VisionSection = dynamic(() => import('@/components/about/VisionSection'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export const metadata: Metadata = {
  title: 'About',
  description: 'Thirteen years. One aircraft. Eleven people who answer their phones.',
};

export default function AboutPage() {
  return (
    <main className="relative bg-ink-950">
      <AboutHero />
      <StorySection />
      <TeamGrid />
      <VisionSection />
      <SectionFade />
      <Footer />
    </main>
  );
}