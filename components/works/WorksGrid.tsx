'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { cn } from '@/utils/cn';
import { framePath } from '@/utils/frames';

type WorkItem = {
  index: string;
  title: string;
  subtitle: string;
  location: string;
  year: string;
  tags: string[];
  thumb: string;
  video?: string;
  span: 'wide' | 'regular' | 'tall';
};

// Thumbnails pull from the existing frame sequence so the grid has real imagery
// even without a separate photo library. Different indices → different compositions.
const WORKS: WorkItem[] = [
  {
    index: '01',
    title: 'Atacama Nocturne',
    subtitle: 'Desert astronomy. No moon, no moon-rise.',
    location: 'Chile',
    year: '2025',
    tags: ['Expedition', 'Astronomy', 'Private charter'],
    thumb: framePath(10),
    video: '/videos/hero-1.mp4',
    span: 'wide',
  },
  {
    index: '02',
    title: 'The Svalbard Line',
    subtitle: 'Re-tracing the 79th parallel by jet and skis.',
    location: 'Norway',
    year: '2024',
    tags: ['Arctic', 'Family brief', 'Re-plan in flight'],
    thumb: framePath(40),
    span: 'regular',
  },
  {
    index: '03',
    title: 'Patagonian Thresh',
    subtitle: 'A landing that was not supposed to be possible.',
    location: 'Argentina',
    year: '2024',
    tags: ['Remote field', 'Medical team', 'Photography'],
    thumb: framePath(70),
    span: 'regular',
  },
  {
    index: '04',
    title: 'Khosh Yailov Descent',
    subtitle: 'Steppe at dawn, on a two-sentence request.',
    location: 'Kazakhstan',
    year: '2023',
    tags: ['Cultural', 'Silent crew', 'Single passenger'],
    thumb: framePath(100),
    span: 'regular',
  },
  {
    index: '05',
    title: 'Meridian Zero',
    subtitle: 'Greenwich, Observatory, 04:42 — only to watch.',
    location: 'United Kingdom',
    year: '2023',
    tags: ['Anniversary', 'Discretion'],
    thumb: framePath(130),
    span: 'regular',
  },
  {
    index: '06',
    title: 'The Empty Quarter',
    subtitle: 'Rub al Khali — fifteen hours over the same dune.',
    location: 'Saudi Arabia',
    year: '2022',
    tags: ['Cinematography', 'Geology brief'],
    thumb: framePath(55),
    video: '/videos/hero-2.mp4',
    span: 'wide',
  },
];

export default function WorksGrid() {
  const ref = useRef<HTMLElement | null>(null);

  useGsap(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray<HTMLElement>('[data-work-card]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });
    },
    [],
    ref,
  );

  return (
    <section ref={ref} className="relative bg-ink-950 pb-32 pt-10 md:pb-40">
      <div className="container-fluid">
        <div className="mb-12 flex items-end justify-between border-t border-[var(--line)] pt-6 md:mb-20">
          <p className="eyebrow">§ Archive</p>
          <p className="eyebrow hidden md:block">Hover — reveal the brief</p>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-10">
          {WORKS.map((w) => (
            <WorkCard key={w.index} work={w} />
          ))}
        </ul>

        <div className="mt-24 flex items-end justify-between border-t border-[var(--line)] pt-8 text-sm text-bone-400">
          <p className="max-w-md">
            The remaining dossiers are available on request, under a
            standard non-disclosure agreement.
          </p>
          <a
            href="/#contact"
            className="group inline-flex items-center gap-3 text-bone-100 transition-colors hover:text-ember-400"
          >
            <span className="font-mono text-[11px] uppercase tracking-superwide">
              Request full register
            </span>
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="h-3 w-3 transition-transform duration-500 ease-soft group-hover:translate-x-1"
            >
              <path d="M2 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.25" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// WorkCard
// ---------------------------------------------------------------------------

function WorkCard({ work }: { work: WorkItem }) {
  const cardRef = useRef<HTMLLIElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const onEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {
      /* autoplay restrictions — ignore, poster remains */
    });
  };
  const onLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    // Subtle tilt using clientX/Y — capped to a few degrees so it stays elegant.
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--tilt-x', `${y * -3}deg`);
    card.style.setProperty('--tilt-y', `${x * 3}deg`);
  };
  const onMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--tilt-x', `0deg`);
    card.style.setProperty('--tilt-y', `0deg`);
    onLeave();
  };

  return (
    <li
      ref={cardRef}
      data-work-card
      onMouseEnter={onEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      className={cn(
        'group relative flex flex-col overflow-hidden bg-ink-900 ring-1 ring-[var(--line)]',
        'transition-[transform,box-shadow] duration-500 ease-soft will-change-transform',
        'hover:shadow-[0_40px_80px_-30px_rgba(226,137,58,0.25)] hover:ring-ember-500/40',
        work.span === 'wide' && 'md:col-span-2',
      )}
      style={{
        transform: 'perspective(1200px) rotateX(var(--tilt-x,0)) rotateY(var(--tilt-y,0))',
      }}
    >
      {/* Visual */}
      <div
        className={cn(
          'relative w-full overflow-hidden',
          work.span === 'wide' ? 'aspect-[16/9]' : 'aspect-[4/5]',
        )}
      >
        <Image
          src={work.thumb}
          alt={work.title}
          fill
          sizes={work.span === 'wide' ? '100vw' : '(min-width: 768px) 33vw, 100vw'}
          className="object-cover transition-transform duration-[1400ms] ease-soft group-hover:scale-[1.06]"
        />

        {work.video ? (
          <video
            ref={videoRef}
            src={work.video}
            muted
            playsInline
            loop
            preload="none"
            className="pointer-events-none absolute inset-0 h-full w-full scale-[1.03] object-cover opacity-0 transition-opacity duration-700 ease-soft group-hover:opacity-100"
            aria-hidden
          />
        ) : null}

        {/* Readability gradient */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-ink-950/30"
        />

        {/* Index ticker */}
        <div className="absolute left-4 top-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-superwide text-bone-100/85 md:left-6 md:top-6">
          <span>{work.index}</span>
          <span className="h-px w-6 bg-bone-100/40" />
          <span>{work.year}</span>
        </div>

        {/* Title overlay that lives on the image */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
          <h3 className="font-display text-3xl italic leading-[0.95] text-bone-100 md:text-5xl">
            {work.title}
          </h3>
          <p className="mt-2 max-w-md text-sm text-bone-200/90 md:text-base">
            {work.subtitle}
          </p>
        </div>
      </div>

      {/* Reveal panel — slides up on hover */}
      <div className="relative grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-soft group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <div className="flex items-center justify-between gap-6 border-t border-[var(--line)] px-5 py-5 md:px-7">
            <ul className="flex flex-wrap gap-2">
              {work.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-[var(--line-strong)] px-3 py-1 font-mono text-[10px] uppercase tracking-superwide text-bone-200"
                >
                  {t}
                </li>
              ))}
            </ul>
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-superwide text-bone-400">
              {work.location}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}