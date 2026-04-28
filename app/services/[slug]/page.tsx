import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { SERVICES_DATA, getService } from '@/lib/services-data';
import ServiceDetailShell from '@/components/services/ServiceDetailShell';

const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export function generateStaticParams() {
  return SERVICES_DATA.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = getService(params.slug);
  if (!service) return { title: 'Service Not Found' };

  return {
    title: service.title,
    description: service.description,
    openGraph: {
      title: `${service.title} — Meridian`,
      description: service.description,
    },
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getService(params.slug);
  if (!service) notFound();

  return (
    <main className="relative">
      <ServiceDetailShell service={service} />
      <Footer />
    </main>
  );
}
