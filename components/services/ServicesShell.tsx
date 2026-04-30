'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { useLoaderComplete } from '@/hooks/useLoaderComplete';
import { framePath } from '@/utils/frames';
import { cn } from '@/utils/cn';
import { handleEmailClick } from '@/utils/email';

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

import { SERVICES_DATA } from '@/lib/services-data';

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

    // Bento Cards Entrance
    gsap.utils.toArray<HTMLElement>('[data-sv-bento]').forEach((el, i) => {
      gsap.fromTo(el, { y: 100, opacity: 0, scale: 0.95 }, {
        y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
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
    <div ref={ref} className="bg-ink-950 text-bone-100 pb-20">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative flex min-h-[75svh] flex-col justify-between overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 50% at 50% 0%, rgba(230,207,68,0.14) 0%, transparent 60%)' }}
        />
        <div className="container-fluid relative">
          <p data-sv-meta className="eyebrow mb-6">§ Services — What we offer</p>
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
        <div className="container-fluid relative mt-12 grid gap-8 md:grid-cols-12 md:items-end">
          <p data-sv-meta className="max-w-lg text-base leading-relaxed text-bone-200/80 md:col-span-5 md:text-lg">
            We do not offer a rate card. We offer a team of eleven people who have handled every version of &ldquo;impossible&rdquo; since 2013. Pick a discipline below, or tell us what you need and we will build the solution.
          </p>
          <div data-sv-meta className="flex gap-3 md:col-span-4 md:col-start-9 md:flex-col md:items-end">
            {SERVICES_DATA.map((s, i) => (
              <a key={s.slug} href={'#' + s.slug} className="font-mono text-[10px] uppercase tracking-superwide text-bone-400 transition-colors hover:text-ember-400">
                {s.index} {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bento Grid ────────────────────────────────────────────── */}
      <div className="container-fluid py-12 md:py-20">
        <div className="grid gap-4 md:grid-cols-12 md:gap-6">
          {SERVICES_DATA.map((service, idx) => {
            // Masonry layout assignment
            let colSpan = 'md:col-span-12 lg:col-span-6'; // Default
            if (idx === 0) colSpan = 'md:col-span-12 lg:col-span-7';
            if (idx === 1) colSpan = 'md:col-span-12 lg:col-span-5';
            if (idx === 2) colSpan = 'md:col-span-12 lg:col-span-5';
            if (idx === 3) colSpan = 'md:col-span-12 lg:col-span-7';
            if (idx === 4) colSpan = 'md:col-span-12 lg:col-span-12'; // Full width for Access

            return (
              <div key={service.slug} data-sv-bento className={cn(colSpan, "h-[500px] md:h-[600px] lg:h-[700px]")}>
                <BentoCard service={service} fullWidth={idx === 4} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Brief CTA ────────────────────────────────────────────── */}
      <div className="container-fluid py-24 md:py-32">
        <div data-sv-line className="mb-16 h-px w-full bg-[var(--line)]" />
        <div className="grid gap-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <p className="eyebrow mb-6">Start the conversation</p>
            <h2 className="font-display text-5xl italic leading-[0.92] md:text-7xl">
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
              <button onClick={(e) => handleEmailClick(e, 'desk@meridian.aero')} className="glass inline-flex items-center justify-center gap-3 rounded-full border-white/15 bg-white/[0.04] px-7 py-4 text-[11px] uppercase tracking-[0.28em] text-bone-100 transition-[background,border-color] duration-300 hover:border-ember-400 hover:bg-ember-500/10 cursor-pointer">
                desk@meridian.aero
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BentoCard
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback } from 'react';
import Link from 'next/link';

function BentoCard({ service, fullWidth }: { service: any, fullWidth: boolean }) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const enter = useCallback(() => {
    setHovered(true);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => undefined);
  }, []);

  const leave = useCallback(() => {
    setHovered(false);
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }, []);

  return (
    <Link
      ref={cardRef}
      id={service.slug}
      href={`/services/${service.slug}`}
      data-cursor={service.title}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className={cn(
        'group relative flex h-full w-full flex-col overflow-hidden',
        'rounded-2xl md:rounded-3xl',
        'bg-ink-900 ring-1 ring-white/10',
        'transition-[box-shadow,ring-color] duration-500 ease-soft',
        'hover:ring-ember-400/40 hover:shadow-[0_0_80px_-20px_rgba(230,207,68,0.25)]',
      )}
    >
      {/* ── Image & Video Background ── */}
      <div className="absolute inset-0 z-0 bg-ink-950">
        <Image
          src={service.thumb}
          alt={service.title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={cn(
            'object-cover transition-[transform,filter,opacity] duration-[1200ms] ease-out',
            'grayscale-[0.4]',
            hovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          )}
        />
        
        {/* Cinematic Video Hover Reveal */}
        <video
          ref={videoRef}
          src="/videos/desktop.mp4"
          muted
          playsInline
          loop
          preload="none"
          onCanPlay={() => setVideoReady(true)}
          className={cn(
            'pointer-events-none absolute inset-0 h-full w-full object-cover',
            'transition-[opacity,transform] duration-700 ease-out',
            hovered && videoReady ? 'scale-105 opacity-100' : 'scale-110 opacity-0'
          )}
          aria-hidden
        />

        {/* Dynamic Dark Gradient */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            hovered ? 'bg-ink-950/40' : 'bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent'
          )}
        />
      </div>

      {/* ── Content Foreground ── */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-10">
        
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-superwide text-bone-100/90">
            <span className={cn('transition-colors duration-300', hovered && 'text-ember-400')}>{service.index}</span>
            <span className="h-px w-6 bg-bone-100/30" />
            <span className="glass rounded-full border-white/15 bg-white/[0.08] px-3 py-1.5 backdrop-blur-md">
              {service.title}
            </span>
          </div>
          
          {/* Arrow Icon */}
          <span className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full glass border border-white/15 bg-white/[0.05]",
            "transition-all duration-500 ease-out",
            hovered && "bg-ember-500/20 border-ember-400 -rotate-45 scale-110"
          )}>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-bone-100" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M2 7h9M7 3l4 4-4 4" />
            </svg>
          </span>
        </div>

        {/* Bottom Text */}
        <div className="mt-auto max-w-2xl">
          <h3 className={cn(
            "font-display italic leading-[0.95] text-bone-100 transition-transform duration-500",
            fullWidth ? "text-5xl md:text-7xl" : "text-4xl md:text-6xl",
            hovered && "translate-x-2"
          )}>
            {service.tagline.split('. ').map((part: string, i: number, arr: string[]) => (
              <span key={i} className={i === arr.length - 1 && arr.length > 1 ? "text-ember-400" : ""}>
                {part}{i !== arr.length - 1 ? '. ' : ''}
              </span>
            ))}
          </h3>
          
          <div className={cn(
            "mt-6 grid transition-all duration-500 ease-out",
            hovered ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}>
            <div className="overflow-hidden">
              <p className="text-sm leading-relaxed text-bone-200/90 md:text-base md:w-3/4">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
