'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGsap } from '@/hooks/useGsap';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/utils/cn';
import { framePath } from '@/utils/frames';

export type ShowcaseCard = {
  id: string;
  index: string;
  service: string;
  tagline: string;
  description: string;
  tag: string;
  thumb: string;
  video: string;
  slug: string;
};

/** Only 4 cards shown on the home page — matches the reference provided */
export const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    id: 'charter',
    index: '01',
    service: 'Private Charter',
    tagline: 'Your route. Your schedule.',
    description:
      'One call. Wheels-up in 70 minutes. Full aircraft. No shared manifest. No questions.',
    tag: 'Core Service',
    thumb: framePath(10),
    video: '/videos/desktop.mp4',
    slug: 'charter',
  },
  {
    id: 'expeditions',
    index: '02',
    service: 'Bespoke Expeditions',
    tagline: 'Beyond the known world.',
    description:
      'From Patagonian glaciers to pre-dawn Saharan landings. We brief. We plan. We fly.',
    tag: 'Signature',
    thumb: framePath(50),
    video: '/videos/desktop.mp4',
    slug: 'expeditions',
  },
  {
    id: 'cargo',
    index: '03',
    service: 'Cargo & Logistics',
    tagline: 'When time is the cargo.',
    description:
      'Critical shipments. Medical evacuations. Sensitive freight. Discretion guaranteed.',
    tag: 'Operational',
    thumb: framePath(90),
    video: '/videos/desktop.mp4',
    slug: 'cargo',
  },
  {
    id: 'concierge',
    index: '04',
    service: 'Air Concierge',
    tagline: 'Everything arranged. Nothing forgotten.',
    description:
      'Ground transfers, customs clearance, catering, permits, hotels. One team. One call.',
    tag: 'Full Service',
    thumb: framePath(120),
    video: '/videos/desktop.mp4',
    slug: 'concierge',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function HorizontalShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Headline reveal — scroll triggered, fires once, no pin
  useGsap(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      '[data-hs-headline]',
      { y: 48, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      },
    );
  }, [], sectionRef);

  return (
    <section
      ref={sectionRef}
      id="services-preview"
      className="relative bg-ink-950 text-bone-100"
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="container-fluid relative z-10 pb-8 pt-24 md:pb-12 md:pt-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-hs-headline className="eyebrow mb-4">
              § Services
            </p>
            <h2
              data-hs-headline
              className="font-display text-[13vw] italic leading-[0.88] tracking-ultratight md:text-[6vw]"
            >
              What we{' '}
              <span className="text-ember-400">offer.</span>
            </h2>
          </div>

          <div data-hs-headline className="flex flex-col items-start gap-4 md:items-end">
            <p className="max-w-[30ch] text-sm leading-relaxed text-bone-200/75 md:text-right">
              Five disciplines. One operating philosophy: we say yes, then figure out the rest.
            </p>
            <Link
              href="/services"
              data-cursor="View all"
              className="group glass inline-flex items-center gap-3 rounded-full border-white/15 bg-white/[0.05] px-5 py-2.5 text-bone-100 transition-[background,border-color] duration-300 hover:border-ember-400 hover:bg-ember-500/10"
            >
              <span className="font-mono text-[10px] uppercase tracking-superwide">
                View all services
              </span>
              <svg
                viewBox="0 0 14 14"
                className="h-3 w-3 transition-transform duration-300 ease-soft group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              >
                <path d="M2 7h9M7 3l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile: horizontal snap scroll ──────────────────────────── */}
      {/*
        Pure CSS — overflow-x scroll with snap. No GSAP pin = no overlap bugs.
        Each card is 78vw wide so the next card peeks at the right edge.
        The "View all" tail card closes the row.
      */}
      <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
        <div className="flex snap-x snap-mandatory flex-row gap-4 px-5 pb-8">
          {SHOWCASE_CARDS.map((card) => (
            <div key={card.id} className="w-[78vw] shrink-0 snap-start">
              <ServiceCard card={card} />
            </div>
          ))}

          {/* Mobile tail card — "View all" */}
          <div className="flex snap-start items-stretch">
            <Link
              href="/services"
              className="glass flex w-[72vw] shrink-0 flex-col items-center justify-center gap-4 rounded-2xl border-white/15 bg-white/[0.03] px-8 py-12 text-center text-bone-100 transition-[background,border-color] duration-300 hover:border-ember-400 hover:bg-ember-500/10"
            >
              <span className="font-display text-3xl italic">
                View all{' '}
                <span className="text-ember-400">services →</span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-400">
                5 disciplines total
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Desktop: 4-column static grid ───────────────────────────── */}
      {/*
        No GSAP pin — a simple responsive grid.
        This eliminates the entire class of pin/spacer overlap bugs on desktop.
        The grid flows naturally in the document; subsequent sections push down
        correctly because there is no pinSpacing spacer to miscalculate.
      */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-5 md:px-12 md:pb-16">
        {SHOWCASE_CARDS.map((card) => (
          <ServiceCard key={card.id} card={card} />
        ))}
      </div>

      {/* Desktop footer row */}
      <div className="container-fluid hidden items-center justify-between pb-8 md:flex">
        <div className="flex items-center gap-3 text-bone-400">
          <svg
            viewBox="0 0 24 12"
            className="h-3 w-6 text-ember-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <path d="M1 6h20M15 1l6 5-6 5" />
          </svg>
          <span className="font-mono text-[10px] uppercase tracking-superwide">
            Our disciplines
          </span>
        </div>
        <Link
          href="/services"
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-superwide text-bone-400 transition-colors duration-300 hover:text-ember-400"
        >
          View all services
          <svg
            viewBox="0 0 14 14"
            className="h-2.5 w-2.5 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <path d="M2 7h9M7 3l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ServiceCard
// ─────────────────────────────────────────────────────────────────────────────

function ServiceCard({ card }: { card: ShowcaseCard }) {
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

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 7;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -7;
    el.style.setProperty('--tilt-x', y + 'deg');
    el.style.setProperty('--tilt-y', x + 'deg');
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    }
    leave();
  }, [leave]);

  return (
    <Link
      ref={cardRef}
      href={`/services/${card.slug}`}
      data-cursor={card.service}
      onMouseEnter={enter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      className={cn(
        'group relative flex flex-col overflow-hidden',
        // Height
        'min-h-[480px] md:h-[520px] lg:h-[560px]',
        // Visual
        'rounded-2xl md:rounded-3xl',
        'bg-ink-900 ring-1 ring-white/10',
        'shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]',
        'transition-[box-shadow,ring-color] duration-500 ease-soft',
        'hover:ring-ember-400/30 hover:shadow-[0_30px_80px_-20px_rgba(230,207,68,0.20)]',
      )}
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg))',
        transition: 'box-shadow 0.5s ease, transform 0.4s ease',
      }}
    >
      {/* ── Image + video ─────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden bg-ink-950">
        <Image
          src={card.thumb}
          alt={card.service}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 25vw, (min-width: 768px) 25vw, 78vw"
          className={cn(
            'object-cover transition-[transform,filter,opacity] duration-700 ease-soft',
            'grayscale-[0.3]',
            hovered ? 'scale-[1.05] opacity-0' : 'scale-100 opacity-100',
          )}
          priority={card.index === '01'}
        />

        {/* Video on hover */}
        <video
          ref={videoRef}
          src={card.video}
          muted
          playsInline
          loop
          preload="none"
          onCanPlay={() => setVideoReady(true)}
          className={cn(
            'pointer-events-none absolute inset-0 h-full w-full object-cover',
            'transition-[opacity,transform] duration-500 ease-soft',
            hovered && videoReady ? 'scale-[1.05] opacity-100' : 'scale-110 opacity-0',
          )}
          aria-hidden
        />

        {/* Gradient veil */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 transition-opacity duration-500',
            hovered ? 'bg-ink-950/40' : 'bg-gradient-to-t from-ink-900 via-ink-900/30 to-ink-900/40'
          )}
        />

        {/* Hover ember shimmer at top */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember-400/80 to-transparent',
            'transition-opacity duration-500',
            hovered ? 'opacity-100' : 'opacity-0',
          )}
        />

        {/* Corner ticks */}
        <CornerTick pos="tl" />
        <CornerTick pos="tr" />

        {/* Top chrome */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-superwide text-bone-100/85">
          <span>{card.index}</span>
          <span className="h-px w-4 bg-bone-100/40" />
          <span className="glass rounded-full border-white/15 bg-white/[0.08] px-2.5 py-1">
            {card.tag}
          </span>
        </div>

        {/* Bottom — service name on image */}
        <div className="absolute inset-x-4 bottom-4 z-10">
          <h3 className="font-display text-2xl italic leading-tight text-bone-100 md:text-3xl">
            {card.service}
          </h3>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-superwide text-ember-400">
            {card.tagline}
          </p>
        </div>
      </div>

      {/* ── Info block ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-t border-[var(--line)] px-5 py-4 md:px-6">
        <p className="line-clamp-2 text-[12px] leading-relaxed text-bone-200/80">
          {card.description}
        </p>
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--line)]',
            'transition-[background,border-color,transform] duration-300 ease-soft',
            'group-hover:border-ember-400 group-hover:bg-ember-500/15 group-hover:translate-x-0.5',
          )}
        >
          <svg
            viewBox="0 0 14 14"
            className="h-3 w-3 text-bone-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <path d="M2 7h9M7 3l4 4-4 4" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CornerTick
// ─────────────────────────────────────────────────────────────────────────────

function CornerTick({ pos }: { pos: 'tl' | 'tr' }) {
  const cls = pos === 'tl' ? 'left-3 top-3' : 'right-3 top-3 rotate-90';
  return (
    <span aria-hidden className={'pointer-events-none absolute z-10 h-3.5 w-3.5 ' + cls}>
      <span className="absolute left-0 top-0 h-px w-full bg-bone-100/50" />
      <span className="absolute left-0 top-0 h-full w-px bg-bone-100/50" />
    </span>
  );
}