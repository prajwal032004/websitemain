import { notFound } from 'next/navigation';
import { SERVICES } from '@/utils/servicesData';
import Link from 'next/link';

export function generateStaticParams() {
  return SERVICES.map((svc) => ({
    slug: svc.slug,
  }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = SERVICES.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="bg-ink-950">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden bg-ink-950">
        {/* Grain overlay */}
        <div aria-hidden className="grain pointer-events-none absolute inset-0 z-0" />
        
        {/* Dynamic Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `radial-gradient(circle at 50% 30%, rgba(${hexToRgb(service.accentHex)}, 0.15) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(${hexToRgb(service.accentHex)}, 0.05) 0%, transparent 50%)`,
          }}
        />

        <div className="container-fluid relative z-10 w-full">
          <div className="max-w-4xl mx-auto">
            {/* Top breadcrumb/category */}
            <div className="flex items-center gap-4 mb-8">
              <Link 
                href="/services"
                className="font-mono text-[10px] uppercase tracking-superwide text-bone-400 hover:text-ember-400 transition-colors"
              >
                Services
              </Link>
              <span className="w-4 h-px bg-bone-400/30" />
              <span 
                className="font-mono text-[10px] uppercase tracking-superwide"
                style={{ color: service.accentHex }}
              >
                {service.category}
              </span>
              <span className="w-4 h-px bg-bone-400/30" />
              <span className="font-mono text-[10px] tracking-superwide text-bone-400/40">
                {service.index}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-[clamp(3.5rem,7vw,7rem)] italic leading-[1.05] tracking-tight text-bone-50 mb-6">
              {service.title}
            </h1>

            {/* Tagline */}
            <p 
              className="font-mono text-[14px] uppercase tracking-superwide mb-12"
              style={{ color: `rgba(${hexToRgb(service.accentHex)}, 0.9)` }}
            >
              {service.tagline}
            </p>

            {/* Description */}
            <p className="text-xl md:text-2xl leading-relaxed text-bone-200/80 max-w-2xl font-light">
              {service.description}
            </p>

            {/* CTA */}
            <div className="mt-16 flex items-center gap-6">
              <Link
                href="/#contact"
                className="group relative inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 overflow-hidden transition-all duration-500"
                style={{
                  backgroundColor: `rgba(${hexToRgb(service.accentHex)}, 0.1)`,
                  border: `1px solid rgba(${hexToRgb(service.accentHex)}, 0.3)`,
                  color: service.accentHex,
                  boxShadow: `0 0 20px rgba(${hexToRgb(service.accentHex)}, 0.1)`,
                }}
              >
                <span className="absolute inset-0 w-full h-full -z-10 bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-medium">Inquire Now</span>
                <svg
                  viewBox="0 0 14 14"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M2 7h9M7 3l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Details Section ── */}
      <section className="relative py-24 bg-ink-950 border-t border-white/[0.05]">
        <div className="container-fluid">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            {/* Stat Box */}
            <div 
              className="p-10 rounded-3xl border backdrop-blur-sm relative overflow-hidden group"
              style={{
                borderColor: `rgba(${hexToRgb(service.accentHex)}, 0.2)`,
                backgroundColor: `rgba(${hexToRgb(service.accentHex)}, 0.03)`,
              }}
            >
              <div 
                className="absolute top-0 right-0 w-40 h-40 opacity-20 blur-3xl rounded-full transition-opacity duration-500 group-hover:opacity-40"
                style={{ backgroundColor: service.accentHex }}
              />
              <div className="relative z-10">
                <p 
                  className="font-display text-5xl italic mb-3"
                  style={{ color: service.accentHex }}
                >
                  {service.stat}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-superwide text-bone-300/60">
                  {service.statLabel}
                </p>
              </div>
            </div>

            {/* Additional Info Box */}
            <div className="flex flex-col justify-center">
              <h3 className="font-display text-3xl italic text-bone-100 mb-6">
                Redefining the standard.
              </h3>
              <p className="text-bone-300/60 leading-relaxed text-sm">
                Our approach to {service.title.toLowerCase()} is fundamentally different. We prioritize depth over breadth, curating experiences that are impossible to replicate. Every aspect of this service is handled by a dedicated team of specialists who possess an intimate understanding of the nuances involved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
