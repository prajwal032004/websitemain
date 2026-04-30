import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import WorksHero from '@/components/works/WorksHero';
import SectionFade from '@/components/SectionFade';

const WorksGrid = dynamic(() => import('@/components/works/WorksGrid'), {
  ssr: false,
  loading: () => null,
});
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export const metadata: Metadata = {
  title: 'Works',
  description:
    'A selection of recent Meridian expeditions — from Atacama to the Arctic. Discretion by default; the full register is available on request.',
};

export default function WorksPage() {
  return (
    <main className="relative bg-ink-950">
      <WorksHero />
      <WorksGrid />
      <SectionFade />
      <Footer />
    </main>
  );
}