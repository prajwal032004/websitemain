'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';

const TEAM = [
  { name: 'Dhiraj Kishore', role: 'Founder & Captain', quote: 'We do not sell itineraries. We sell arrival.' },
  { name: 'Deepan', role: 'Director of Operations', quote: 'A good plan is one you can tear up on the tarmac.' },
  { name: 'Pruthvij Prabhu', role: 'Chief Concierge', quote: 'No request is unusual by the second time it is made.' },
];

export default function TeamGrid() {
  const ref = useRef<HTMLElement | null>(null);

  useGsap(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray<HTMLElement>('[data-team-card]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
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
        </div>

        <ul className="grid grid-cols-1 gap-px bg-[var(--line)] md:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m, i) => {
            const initials = m.name.split(' ').map((p) => p[0]).join('');
            return (
              <li
                key={m.name}
                data-team-card
                className="group relative flex flex-col justify-between gap-10 bg-ink-950 p-8 transition-colors duration-500 hover:bg-ink-900 md:p-10"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-7xl italic leading-none text-ember-500/90 md:text-8xl">
                    {initials}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-400">
                    0{i + 1}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl italic text-bone-100 md:text-3xl">
                    {m.name}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-superwide text-bone-400">
                    {m.role}
                  </p>
                  <p className="mt-6 max-w-[28ch] text-sm leading-relaxed text-bone-200/80">
                    &ldquo;{m.quote}&rdquo;
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}