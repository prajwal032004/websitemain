'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';

const MILESTONES = [
  {
    year: '2013',
    title: 'Geneva. Three people, one Citation XLS.',
    body: 'Meridian was founded as an operator for a handful of private clients who needed a single phone number and one crew.',
  },
  {
    year: '2016',
    title: 'First mission above 80°N.',
    body: 'A week-long re-provisioning run to an Arctic science station. The request arrived by handwritten note. We left Geneva in forty-nine minutes.',
  },
  {
    year: '2019',
    title: 'Single-aircraft doctrine.',
    body: 'We retired our second airframe and consolidated to one Gulfstream G650ER — held at readiness, crewed by the same six people year-round.',
  },
  {
    year: '2022',
    title: '5,000th mission flown.',
    body: 'A night landing in a remote valley, witnessed by a family of four and a stray dog. We did not take a photograph.',
  },
  {
    year: '2024',
    title: 'Dubai operations center.',
    body: 'A second 24-hour desk opened in Dubai International Financial Centre, giving us parity on both sides of the clock.',
  },
  {
    year: '2026',
    title: 'Today.',
    body: 'Eleven people. One aircraft. No brochure. The register continues to grow, quietly.',
  },
];

export default function StorySection() {
  const ref = useRef<HTMLElement | null>(null);

  useGsap(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray<HTMLElement>('[data-milestone]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          },
        );
      });

      // Draw the vertical timeline line as you scroll.
      gsap.fromTo(
        '[data-timeline-line]',
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: true,
          },
        },
      );
    },
    [],
    ref,
  );

  return (
    <section ref={ref} className="relative border-y border-[var(--line)] bg-ink-900 py-28 md:py-40">
      <div className="container-fluid">
        <div className="mb-16 flex items-end justify-between md:mb-24">
          <div>
            <p className="eyebrow mb-4">§ Story</p>
            <h2 className="max-w-[22ch] font-display text-5xl italic leading-[0.95] text-balance md:text-6xl">
              A narrow, consistent <span className="text-ember-400">line.</span>
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-relaxed text-bone-200/70 md:block">
            We have never pivoted. We have never rebranded. We have
            occasionally changed the cutlery.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <span
            data-timeline-line
            aria-hidden
            className="absolute left-0 top-0 h-full w-px bg-[var(--line-strong)] md:left-[12.5%]"
          />

          <ul className="space-y-14 md:space-y-20">
            {MILESTONES.map((m, i) => (
              <li
                key={m.year}
                data-milestone
                className="relative grid gap-6 pl-8 md:grid-cols-12 md:gap-10 md:pl-0"
              >
                {/* Dot */}
                <span
                  aria-hidden
                  className="absolute left-0 top-3 h-2 w-2 rounded-full bg-ember-500 shadow-[0_0_12px_2px_rgba(230,207,68,0.5)] md:left-[calc(12.5%-4px)]"
                />

                <div className="md:col-span-2 md:pl-16">
                  <p className="font-display text-4xl italic tabular-nums text-bone-100 md:text-5xl">
                    {m.year}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-superwide text-bone-400">
                    § {String(i + 1).padStart(2, '0')}
                  </p>
                </div>

                <div className="md:col-span-7 md:col-start-5">
                  <h3 className="font-display text-2xl italic text-bone-100 md:text-3xl">
                    {m.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-base leading-relaxed text-bone-200/80">
                    {m.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}