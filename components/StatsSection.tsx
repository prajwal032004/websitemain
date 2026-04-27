'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';

const STATS = [
  { value: '13', unit: 'yrs', label: 'In operation', sub: 'Since Geneva, 2013' },
  { value: '47×', unit: '', label: 'Empty Quarter sorties', sub: 'No repeat coordinates' },
  { value: '174', unit: '', label: 'Sovereignties cleared', sub: 'Diplomatic overflights' },
  { value: '11', unit: '', label: 'Crew members', sub: 'Operations never sleep' },
  { value: '04:42', unit: '', label: 'Desert entry — best', sub: 'AM, Rub\u02bc al Khali' },
  { value: '1', unit: '', label: 'Aircraft. One mission.', sub: 'Gulfstream 650ER' },
] as const;

export default function StatsSection() {
  const ref = useRef<HTMLElement | null>(null);

  useGsap(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        '[data-stat-card]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 75%',
            once: true,
          },
        },
      );

      gsap.fromTo(
        '[data-stat-meta]',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 78%',
            once: true,
          },
        },
      );

      /* Number count-up on entry */
      gsap.utils.toArray<HTMLElement>('[data-stat-value]').forEach((el) => {
        const raw = el.dataset.raw ?? '';
        const num = parseFloat(raw);
        if (isNaN(num)) return;
        const suffix = el.dataset.suffix ?? '';
        // Use a stable proxy object — gsap.fromTo requires a DOM node or
        // a pre-existing object reference; an object literal breaks in GSAP 3.
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: num,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
          onUpdate() {
            el.textContent = Math.round(proxy.val).toString() + suffix;
          },
        });
      });
    },
    [],
    ref,
  );

  return (
    <section
      ref={ref}
      id="stats"
      className="relative bg-ink-950 py-24 md:py-36 text-bone-100 overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 100%, rgba(226,137,58,0.09) 0%, transparent 60%)',
        }}
      />

      <div className="container-fluid relative z-10">
        {/* Header */}
        <div className="mb-16 flex items-end justify-between border-t border-[var(--line)] pt-6 md:mb-24">
          <p data-stat-meta className="eyebrow">§ 02 — By the numbers</p>
          <p data-stat-meta className="eyebrow hidden md:block text-bone-200/50">
            Thirteen years. One standard.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-px bg-[var(--line)] md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s, i) => (
            <div
              key={i}
              data-stat-card
              className="group relative flex flex-col justify-between bg-ink-950 p-6 md:p-8 transition-colors duration-500 hover:bg-ink-900"
            >
              {/* Corner accent */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 h-3 w-3 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
              >
                <span className="absolute left-0 top-0 h-px w-full bg-ember-400" />
                <span className="absolute left-0 top-0 h-full w-px bg-ember-400" />
              </span>

              <div>
                <p className="font-display text-[clamp(2.4rem,5vw,3.8rem)] italic leading-[0.9] tracking-tight text-bone-100">
                  <span
                    data-stat-value
                    data-raw={parseFloat(s.value).toString()}
                    data-suffix={s.unit}
                  >
                    {s.value}
                  </span>
                  {s.unit && (
                    <span className="ml-0.5 text-[0.45em] not-italic text-ember-400">
                      {s.unit}
                    </span>
                  )}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-[13px] font-medium leading-snug text-bone-200">{s.label}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-superwide text-bone-200/45">
                  {s.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom rule */}
        <div className="mt-0 h-px w-full bg-[var(--line)]" />
      </div>
    </section>
  );
}