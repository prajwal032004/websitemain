import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ServicesShell from '@/components/services/ServicesShell';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Five disciplines, one operating philosophy. Private charter, bespoke expeditions, cargo, concierge, and membership — handled by eleven people who answer their phones.',
};

const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function ServicesPage() {
  return (
    <main className="relative">
      <ServicesShell />
      <Footer />
    </main>
  );
}
