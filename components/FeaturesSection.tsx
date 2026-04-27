'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { cn } from '@/utils/cn';

const SPECS = [
  ['Aircraft', 'Gulfstream G650ER'],
  ['Max range', '11,263 km'],
  ['Cruise speed', 'Mach 0.925 (480 kts)'],
  ['Passenger capacity', '12 + 1 attendant'],
  ['Cabin length', '14.05 m'],
  ['Cabin altitude', '4,060 ft at FL 510'],
] as const;

const FEATURES = [
  {
    title: 'Pets at altitude',
    body: 'Full manifest rights for up to four animals, vet-cleared, on dedicated upholstered seating. A member of the crew carries their papers for you.',
  },
  {
    title: '24-hour operations desk',
    body: 'Every Meridian client has one phone number, nine names, and no menu. A human answers inside twelve seconds, at any hour, in any time zone.',
  },
  {
    title: 'Onboard provisioning',
    body: 'Dinner from the restaurant of your choice — or from a restaurant that closed at sundown. Our concierges have a standing arrangement with fourteen of them.',
  },
  {
    title: 'Fuel-to-runway in 70 minutes',
    body: 'From the first request to wheels-up. We are measured by minutes, not by the glossy brochure you did not receive.',
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const [openIndex, setOpenIndex] = useState(0);

  // When accordion height changes, we must inform GSAP so that subsequent pinned sections (like HorizontalShowcase) update their trigger positions.
  useGsap(() => {
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 550); // wait for the duration-500 transition to finish
    return () => clearTimeout(timeoutId);
  }, [openIndex]);

  useGsap(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        '[data-feat-spec]',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-feat-spec-group]',
            start: 'top 75%',
            once: true,
          },
        },
      );

      gsap.fromTo(
        '[data-feat-image]',
        { scale: 1.08, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '[data-feat-image]',
            start: 'top 80%',
            once: true,
          },
        },
      );
    },
    [],
    ref,
  );

  return (
    <section
      ref={ref}
      id="aircraft"
      className="relative bg-ink-950 py-28 md:py-40"
    >
      <div className="container-fluid">
        <div className="mb-16 flex items-end justify-between border-t border-[var(--line)] pt-6 md:mb-24">
          <div>
            <p className="eyebrow mb-4">§ 03 — Aircraft</p>
            <h2 className="max-w-[18ch] font-display text-6xl italic leading-[0.95] text-balance md:text-7xl">
              A single airframe. Kept <span className="text-ember-400">ready</span>.
            </h2>
          </div>
          <p className="hidden max-w-[28ch] text-right text-sm leading-relaxed text-bone-200/70 md:block">
            Fleet rotation is a compromise. Meridian operates one Gulfstream
            G650ER, under one dedicated crew, under one maintenance regime,
            on permanent standby in Geneva.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-12">
          {/* Aircraft image — uses a tinted poster as a stand-in */}
          <div className="md:col-span-7">
            <div
              data-feat-image
              className="relative aspect-[16/10] overflow-hidden rounded-sm ring-1 ring-[var(--line-strong)]"
            >
              <img
                src="/videos/hero-2-poster.jpg"
                alt="Gulfstream G650ER overlooking the horizon"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/30 mix-blend-multiply"
              />

              {/* HUD overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-8">
                <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-superwide text-bone-100/85">
                  <span>GL-650ER / HB-MRD</span>
                  <span>FL 510 — M 0.925</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="font-display text-3xl italic text-bone-100 md:text-5xl">
                    Gulfstream <span className="text-ember-400">650ER</span>
                  </div>
                  <div className="hidden font-mono text-[10px] uppercase tracking-superwide text-bone-100/70 md:block">
                    Ready — Geneva, 04:12 UTC
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specs */}
          <div
            data-feat-spec-group
            className="md:col-span-5 md:col-start-8 md:pt-4"
          >
            <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {SPECS.map(([key, val]) => (
                <li
                  key={key}
                  data-feat-spec
                  className="flex items-center justify-between gap-6 py-5"
                >
                  <span className="text-xs uppercase tracking-[0.22em] text-bone-400">
                    {key}
                  </span>
                  <span className="font-display text-lg italic text-bone-100 md:text-xl">
                    {val}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Advantages / accordion */}
        <div id="expeditions" className="mt-28 border-t border-[var(--line)] pt-12 md:mt-40">
          <div className="mb-12 flex items-end justify-between md:mb-16">
            <div>
              <p className="eyebrow mb-4">§ 04 — Advantages</p>
              <h3 className="max-w-[18ch] font-display text-5xl italic leading-[0.95] text-balance md:text-6xl">
                A better way to <span className="text-ember-400">fly.</span>
              </h3>
            </div>
          </div>

          <ul className="border-t border-[var(--line)]">
            {FEATURES.map((f, i) => {
              const open = openIndex === i;
              return (
                <li key={f.title} className="border-b border-[var(--line)]">
                  <button
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    aria-expanded={open}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-300 hover:bg-ink-900/40 md:py-8"
                  >
                    <div className="flex items-baseline gap-6">
                      <span className="font-mono text-xs tabular-nums text-bone-400">
                        0{i + 1}
                      </span>
                      <span className="font-display text-3xl italic text-bone-100 md:text-5xl">
                        {f.title}
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className={cn(
                        'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] transition-[background,transform] duration-500 ease-soft',
                        open && 'rotate-45 bg-ember-500/20 border-ember-500/60',
                      )}
                    >
                      <span className="absolute h-4 w-px bg-bone-100" />
                      <span className="absolute h-px w-4 bg-bone-100" />
                    </span>
                  </button>

                  <div
                    className={cn(
                      'grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-soft',
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="min-h-0">
                     <div className="grid gap-6 pb-8 md:grid-cols-12 md:pb-10">
                       <p className="text-sm leading-relaxed text-bone-200/85 md:col-span-12 md:col-start-1 md:text-base">
                          {f.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
