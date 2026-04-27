import ServicesSection from '@/components/ServicesSection';

export const metadata = {
  title: 'Services | Meridian Journeys',
  description: 'The full spectrum of luxury travel and expedition services provided by Meridian.',
};

export default function ServicesPage() {
  return (
    <main className="bg-ink-950">
      <ServicesSection />
    </main>
  );
}
