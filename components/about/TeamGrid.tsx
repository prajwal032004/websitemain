'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';

type Member = {
  name: string;
  role: string;
  quote: string;
  /** Portrait image — drop in /public/team/ and reference here. */
  image: string;
  /** Full Instagram URL. */
  instagram: string;
  /** Handle shown in the caption line. */
  handle: string;
};

const TEAM: Member[] = [
  {
    name: 'Dhiraj Kishore',
    role: 'Founder & Captain',
    quote: 'We do not sell itineraries. We sell arrival.',
    image: '/team/dhiraj.jpg',
    instagram: 'https://instagram.com/dhirajkishore',
    handle: '@dhirajkishore',
  },
  {
    name: 'Deepan',
    role: 'Director of Operations',
    quote: 'A good plan is one you can tear up on the tarmac.',
    image: '/team/deepan.jpg',
    instagram: 'https://instagram.com/deepan',
    handle: '@deepan',
  },
  {
    name: 'Pruthvij Prabhu',
    role: 'Chief Concierge',
    quote: 'No request is unusual by the second time it is made.',
    image: '/team/pruthvij.jpg',
    instagram: 'https://instagram.com/pruthvijprabhu',
    handle: '@pruthvijprabhu',
  },
];

export default function TeamGrid() {
  const ref = useRef<HTMLElement | null>(null);

  useGsap(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray<HTMLElement>('[data-team-card]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: i * 0.08,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });
    },
    [],
    ref,
  );

  return (
    <section ref={ref} className="relative bg-ink-950 py-28 md:py-40">
      <div className="container-fluid">
        <div className="mb-16 flex items-end justify-between md:mb-24">
          <div>
            <p className="eyebrow mb-4">§ Crew</p>
            <h2 className="max-w-[18ch] font-display text-5xl italic leading-[0.95] text-balance md:text-6xl">
              Three people. <span className="text-ember-400">One phone number.</span>
            </h2>
          </div>
          <p className="hidden max-w-[26ch] text-right text-sm leading-relaxed text-bone-200/70 md:block">
            Every brief goes through one of these three. No pool, no queue,
            no ticketing system.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-px bg-[var(--line)] md:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m, i) => (
            <TeamCard key={m.name} member={m} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TeamCard
// ---------------------------------------------------------------------------

function TeamCard({ member, index }: { member: Member; index: number }) {
  const initials = member.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

  return (
    <li
      data-team-card
      className="group relative flex flex-col overflow-hidden bg-ink-950 transition-colors duration-500"
    >
      {/* ─── Portrait — duotone ember treatment ─────────────────────── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover grayscale contrast-[1.05] brightness-[0.92] transition-[filter,transform] duration-[1100ms] ease-soft group-hover:scale-[1.05] group-hover:grayscale-0"
          priority={index === 0}
        />

        {/* Ember duotone — warmth layered over the grayscale base */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-700 ease-soft group-hover:opacity-40"
          style={{
            background:
              'linear-gradient(135deg, rgba(230,207,68,0.55) 0%, rgba(138,123,22,0.35) 45%, rgba(10,8,7,0.6) 100%)',
          }}
        />
        {/* Shadow lift — deepens the corners without muddy flatness */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 55% at 50% 35%, transparent 0%, rgba(10,8,7,0.55) 100%)',
          }}
        />
        {/* Bottom darkening — gives the initials & chrome contrast */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent"
        />

        {/* Top chrome — index + Instagram pill */}
        <div className="absolute inset-x-4 top-4 z-10 flex items-start justify-between">
          <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-100/85">
            0{index + 1} / 03
          </span>

          <a
            href={member.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on Instagram`}
            className="glass grid h-9 w-9 place-items-center rounded-full border-white/15 bg-white/[0.08] text-bone-100 transition-[transform,background,border-color] duration-300 hover:-rotate-6 hover:border-ember-400/60 hover:bg-ember-500/15"
          >
            <InstagramIcon />
          </a>
        </div>

        {/* Giant initials — overlap the image, blend into the duotone */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 left-4 z-[5] font-display text-[7rem] italic leading-[0.8] text-ember-400/90 mix-blend-overlay md:text-[9rem]"
        >
          {initials}
        </span>

        {/* Hair-thin corner ticks — editorial flourish */}
        <CornerTick className="left-3 top-3 z-10" />
        <CornerTick className="right-3 top-3 z-10" rotate={90} />
        <CornerTick className="left-3 bottom-3 z-10" rotate={-90} />
        <CornerTick className="right-3 bottom-3 z-10" rotate={180} />
      </div>

      {/* ─── Info block ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-between gap-8 p-6 md:p-8">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-2xl italic text-bone-100 md:text-3xl">
              {member.name}
            </h3>
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 font-mono text-[10px] uppercase tracking-superwide text-bone-400 transition-colors duration-300 hover:text-ember-400"
              aria-label={`${member.name} on Instagram`}
            >
              {member.handle}
            </a>
          </div>

          <p className="mt-1 font-mono text-[10px] uppercase tracking-superwide text-bone-400">
            {member.role}
          </p>
        </div>

        <p className="max-w-[28ch] text-sm leading-relaxed text-bone-200/80">
          &ldquo;{member.quote}&rdquo;
        </p>
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Icons / small bits
// ---------------------------------------------------------------------------

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.25" cy="6.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CornerTick({
  className,
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-3 w-3 ${className ?? ''}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span className="absolute left-0 top-0 h-px w-full bg-bone-100/50" />
      <span className="absolute left-0 top-0 h-full w-px bg-bone-100/50" />
    </span>
  );
}