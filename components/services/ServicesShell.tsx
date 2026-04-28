'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { useLoaderComplete } from '@/hooks/useLoaderComplete';
import { framePath } from '@/utils/frames';
import { cn } from '@/utils/cn';

type Service = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  note: string;
  thumb: string;
  flip?: boolean;
};

const SERVICES: Service[] = [
  {
    id: 'charter',
    index: '01',
    title: 'Private Charter',
    tagline: 'Your route. Your schedule.',
    description:
      'One call. A dedicated ops team confirms availability, files the flight plan, and arranges everything before you finish the sentence. Wheels-up in 70 minutes from first contact. Full aircraft — no shared manifests, no standby lists.',
    features: [
      '70-minute response-to-departure commitment',
      'Full aircraft — 12 passengers + 1 attendant',
      'On-demand scheduling, 24/7/365',
      'Global permits, overflights, and customs handled',
      'Pets welcome, full documentation arranged',
    ],
    note: 'Available from Geneva / Dubai primary bases, with delivery positioning worldwide.',
    thumb: framePath(20),
  },
  {
    id: 'expeditions',
    index: '02',
    title: 'Bespoke Expeditions',
    tagline: 'Beyond the known world.',
    description:
      'We plan voyages that do not have brochures. From a 4 AM landing in the Atacama to a week camped on the edge of the Namib, Meridian handles the route, the permissions, the ground logistics, and the unexpected. You handle the experience.',
    features: [
      'Full expedition planning from brief to return',
      'Remote airstrip and off-charter landing clearances',
      'Ground partner network across 174 countries',
      'Medical and emergency contingency planning',
      'Post-expedition documentary support available',
    ],
    note: 'Average planning window: 5 days. Emergency activation: 18 hours.',
    thumb: framePath(70),
    flip: true,
  },
  {
    id: 'cargo',
    index: '03',
    title: 'Cargo & Air Logistics',
    tagline: 'When time is the cargo.',
    description:
      'Critical freight does not wait for commercial schedules. Whether it is a pharmaceutical shipment to a remote facility, a medical evacuation, or a confidential asset transfer, Meridian operates with the speed and discretion the situation requires.',
    features: [
      'Time-critical freight, same-day dispatch',
      'Medical and humanitarian cargo priority',
      'Hazardous goods handling (IATA DGR qualified)',
      'Full cold-chain capability for pharmaceuticals',
      'Diplomatic pouch and confidential freight protocols',
    ],
    note: 'Cargo operations are quoted per-mission. No standard rate card.',
    thumb: framePath(100),
  },
  {
    id: 'concierge',
    index: '04',
    title: 'Air Concierge',
    tagline: 'Everything arranged. Nothing forgotten.',
    description:
      'Most clients stop thinking about logistics the moment they call us. Catering, ground transportation, hotel rooms, visa appointments, pet paperwork, restaurant reservations at the destination — one team, one point of contact, every detail covered.',
    features: [
      'End-to-end ground logistics at origin and destination',
      'Bespoke in-flight catering from nominated restaurants',
      'Visa, permit, and immigration pre-clearance',
      'Hotel and accommodation booking worldwide',
      '24-hour ground transport coordination',
    ],
    note: 'Concierge services are included for Meridian Access members at no additional cost.',
    thumb: framePath(130),
    flip: true,
  },
  {
    id: 'access',
    index: '05',
    title: 'Meridian Access',
    tagline: 'Permanent readiness. Priority always.',
    description:
      'An annual membership that places our aircraft and our team in your permanent reserve. First-position boarding commitment, dedicated account director, accelerated departure protocols, and priority access to our full concierge infrastructure. No availability surprises.',
    features: [
      'First-position reservation guarantee',
      'Dedicated account director, one direct number',
      '50-minute guaranteed response-to-departure',
      'Unlimited concierge and ground coordination',
      'Annual expedition credit: one curated route per year',
    ],
    note: 'Meridian Access is offered by invitation. Enquire via private brief.',
    thumb: framePath(145),
  },
];

export default function ServicesShell() {
  const ref = useRef<HTMLDivElement | null>(null);
  const active = useLoaderComplete();

  useGsap(() => {
    if (!active) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero words
    gsap.from('[data-sv-word]', {
      yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.06, ease: 'expo.out', delay: 0.1,
    });
    gsap.from('[data-sv-meta]', {
      y: 16, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: 0.35,
    });

    // Service cards
    gsap.utils.toArray<HTMLElement>('[data-sv-card]').forEach((el) => {
      gsap.fromTo(el, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
    });

    // Image parallax
    gsap.utils.toArray<HTMLElement>('[data-sv-img]').forEach((el) => {
      gsap.to(el, {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });
    });

    // Line sweeps
    gsap.utils.toArray<HTMLElement>('[data-sv-line]').forEach((el) => {
      gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left center' }, {
        scaleX: 1, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });
  }, [active], ref);

  return (
    <div ref={ref} className="bg-ink-950 text-bone-100">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative flex min-h-[80svh] flex-col justify-between overflow-hidden pt-32 pb-16 md:pt-44 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 50% at 50% 0%, rgba(226,137,58,0.14) 0%, transparent 60%)' }}
        />
        <div className="container-fluid relative">
          <p data-sv-meta className="eyebrow mb-8">§ Services — What we offer</p>
          <h1 className="font-display text-[14vw] leading-[0.86] tracking-ultratight md:text-[9vw]">
            {['Five', 'disciplines.'].map((w, i) => (
              <span key={i} className="block overflow-hidden">
                <span data-sv-word className="block">{w}</span>
              </span>
            ))}
            <span className="block overflow-hidden pl-[8vw]">
              <span data-sv-word className="block italic text-ember-400">One answer.</span>
            </span>
          </h1>
        </div>
        <div className="container-fluid relative grid gap-8 md:grid-cols-12 md:items-end">
          <p data-sv-meta className="max-w-lg text-base leading-relaxed text-bone-200/80 md:col-span-5 md:text-lg">
            We do not offer a rate card. We offer a team of eleven people who have handled every version of &ldquo;impossible&rdquo; since 2013. Pick a discipline below, or tell us what you need and we will build the solution.
          </p>
          <div data-sv-meta className="flex gap-3 md:col-span-4 md:col-start-9 md:flex-col md:items-end">
            {['Charter', 'Expeditions', 'Cargo', 'Concierge', 'Access'].map((s, i) => (
              <a key={s} href={'#' + s.toLowerCase()} className="font-mono text-[10px] uppercase tracking-superwide text-bone-400 transition-colors hover:text-ember-400">
                {String(i + 1).padStart(2, '0')} {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Service sections ─────────────────────────────────────── */}
      <div className="space-y-0">
        {SERVICES.map((sv) => (
          <ServiceSection key={sv.id} service={sv} />
        ))}
      </div>

      {/* ── Brief CTA ────────────────────────────────────────────── */}
      <div className="container-fluid py-32 md:py-44">
        <div data-sv-line className="mb-16 h-px w-full bg-[var(--line)]" />
        <div className="grid gap-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <p className="eyebrow mb-6">Start the conversation</p>
            <h2 className="font-display text-6xl italic leading-[0.92] md:text-7xl">
              Tell us <span className="text-ember-400">where.</span> <br />
              We&apos;ll handle <span className="text-bone-300">everything else.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-8 md:col-span-5 md:col-start-8">
            <p className="text-base leading-relaxed text-bone-200/80">
              Every brief is read by a human inside one working hour. Use as few words as you like — the less detail we receive, the more interesting the conversation tends to become.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="/#contact" className="inline-flex items-center justify-center gap-3 rounded-full bg-ember-500 px-7 py-4 text-[11px] uppercase tracking-[0.28em] text-ink-950 transition-[background] duration-300 hover:bg-ember-400">
                Open a brief
              </a>
              <a href="mailto:desk@meridian.aero" className="glass inline-flex items-center justify-center gap-3 rounded-full border-white/15 bg-white/[0.04] px-7 py-4 text-[11px] uppercase tracking-[0.28em] text-bone-100 transition-[background,border-color] duration-300 hover:border-ember-400 hover:bg-ember-500/10">
                desk@meridian.aero
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceSection({ service }: { service: Service }) {
  return (
    <section
      id={service.id}
      data-sv-card
      className="border-t border-[var(--line)] py-24 md:py-36"
    >
      <div className="container-fluid">
        <div className={cn('grid gap-12 md:grid-cols-12 md:gap-16 md:items-center', service.flip && 'md:[&>*:first-child]:order-2')}>
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl md:col-span-5 md:rounded-3xl">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                data-sv-img
                src={service.thumb}
                alt={service.title}
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="scale-[1.1] object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/30 mix-blend-multiply"
              />
              {/* Index watermark */}
              <span aria-hidden className="pointer-events-none absolute bottom-4 right-4 font-display text-8xl italic leading-none text-ember-400/20 md:text-9xl">
                {service.index}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className={cn('flex flex-col gap-8 md:col-span-6', service.flip ? 'md:col-start-1' : 'md:col-start-7')}>
            <div>
              <p className="eyebrow mb-4">{service.index} / {service.title}</p>
              <h2 className="font-display text-5xl italic leading-[0.92] md:text-6xl">
                {service.tagline.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-ember-400">{service.tagline.split(' ').slice(-1)}</span>
              </h2>
            </div>

            <div data-sv-line className="h-px w-full bg-[var(--line)]" />

            <p className="text-base leading-relaxed text-bone-200/85 md:text-lg">
              {service.description}
            </p>

            <ul className="space-y-3">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-bone-200/80">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-400" />
                  {f}
                </li>
              ))}
            </ul>

            <p className="font-mono text-[10px] uppercase tracking-superwide text-bone-400">
              {service.note}
            </p>

            <a
              href="/#contact"
              className="group inline-flex w-fit items-center gap-3 rounded-full border border-[var(--line)] px-6 py-3 text-sm text-bone-100 transition-[background,border-color] duration-300 hover:border-ember-400 hover:bg-ember-500/10"
            >
              <span className="font-mono text-[10px] uppercase tracking-superwide">Enquire about {service.title}</span>
              <svg viewBox="0 0 14 14" className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 7h9M7 3l4 4-4 4" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
