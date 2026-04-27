'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  caption: string;
}

const STATS: Stat[] = [
  {
    value: 5243,
    label: 'Missions flown',
    caption: 'Since the first charter in 2013.',
  },
  {
    value: 174,
    suffix: ' countries',
    label: 'Reach',
    caption: 'On six continents, one aircraft.',
  },
  {
    value: 11263,
    suffix: ' km',
    label: 'Non-stop range',
    caption: 'Geneva to Sydney without breathing.',
  },
  {
    value: 14,
    suffix: ' hrs',
    label: 'Airborne endurance',
    caption: 'Cabin altitude equivalent 4,060 ft.',
  },
];

export default function StatsSection() {
  const ref = useRef<HTMLElement | null>(null);

  useGsap(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray<HTMLElement>('[data-stat]').forEach((el) => {
        const target = parseFloat(el.dataset.value ?? '0');
        const countObj = { v: 0 };

        gsap.to(countObj, {
          v: target,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = Math.round(countObj.v).toLocaleString('en-US');
          },
        });
      });

      gsap.fromTo(
        '[data-stat-row]',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 75%',
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
      className="relative border-y border-[var(--line)] bg-ink-900 py-24 md:py-32"
    >
      <div className="container-fluid">
        <div className="mb-12 flex items-end justify-between md:mb-20">
          <p className="eyebrow">§ 02 — Record</p>
          <p className="eyebrow hidden md:block">Verified by IS-BAO Stage III</p>
        </div>

        <ul className="grid grid-cols-1 gap-px bg-[var(--line)] md:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <li
              key={s.label}
              data-stat-row
              className="relative flex flex-col gap-6 bg-ink-900 p-8 md:p-10"
            >
              <span className="eyebrow">{s.label}</span>

              <div className="font-display text-5xl tabular-nums leading-none tracking-ultratight md:text-6xl">
                {s.prefix}
                <span data-stat data-value={s.value}>
                  0
                </span>
                {s.suffix ? (
                  <span className="text-bone-400">{s.suffix}</span>
                ) : null}
              </div>

              <p className="mt-auto max-w-[26ch] text-sm leading-relaxed text-bone-200/70">
                {s.caption}
              </p>

              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-4 font-mono text-[10px] tracking-superwide text-bone-400"
              >
                0{STATS.indexOf(s) + 1}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}