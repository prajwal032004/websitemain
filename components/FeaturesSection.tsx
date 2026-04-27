'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { cn } from '@/utils/cn';

const FEATURES = [
  {
    index: '01',
    title: 'Readiness year-round',
    body:
      'Our aircraft sits at 90-minute readiness, 365 days a year. No repositioning delays, no crew rest windows that compromise your window. When you call, we are already dressed.',
    accent: false,
    wide: true,
  },
  {
    index: '02',
    title: 'The operations desk',
    body:
      'Eleven people. No call centre. No ticket queue. The same voice answers at 3 AM Fiji time as at noon in Geneva — and that voice already knows your preferences.',
    accent: false,
    wide: false,
  },
  {
    index: '03',
    title: 'Impossible clearances',
    body:
      'We have landed at airfields that officially do not accept private traffic. Diplomatic permits, restricted overflights, last-hour slot injections — this is the unglamorous half of what we do.',
    accent: true,
    wide: false,
  },
  {
    index: '04',
    title: 'Discretion as standard',
    body:
      'We do not maintain passenger manifests beyond the legally required minimum. We do not discuss who flies with us. We have never been asked twice.',
    accent: false,
    wide: false,
  },
  {
    index: '05',
    title: 'The 650ER at altitude',
    body:
      'Mach 0.925. Range of 7,500 nm non-stop. Cabin pressurised to 4,850 ft at cruise. You arrive in the same condition you boarded — rested, ready, present.',
    accent: false,
    wide: false,
  },
  {
    index: '06',
    title: 'Bespoke cabin',
    body:
      'No standard configuration. The cabin is reset for each mission — layout, provisions, temperature, fragrance. We have never served the same flight twice.',
    accent: false,
    wide: true,
  },
] as const;

export default function FeaturesSection() {
  const ref = useRef<HTMLElement | null>(null);

  useGsap(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        '[data-feat-meta]',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 78%',
            once: true,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>('[data-feat-card]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            delay: i * 0.06,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 84%',
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
    <section
      ref={ref}
      id="features"
      className="relative bg-ink-900 py-28 text-bone-100 md:py-40"
    >
      {/* Background texture layer */}
      <div aria-hidden className="grain pointer-events-none absolute inset-0 z-0 opacity-60 overflow-hidden" />

      {/* Ember glow — top right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(55% 40% at 85% 10%, rgba(226,137,58,0.10) 0%, transparent 65%), radial-gradient(45% 35% at 15% 90%, rgba(142,74,20,0.08) 0%, transparent 65%)',
        }}
      />

      <div className="container-fluid relative z-10">
        {/* Header */}
        <div className="mb-14 flex items-end justify-between border-t border-[var(--line)] pt-6 md:mb-20">
          <p data-feat-meta className="eyebrow">§ 03 — How we operate</p>
          <p data-feat-meta className="eyebrow hidden md:block text-bone-200/50">
            Six principles, one aircraft
          </p>
        </div>

        {/* Headline */}
        <div className="mb-16 md:mb-24 md:max-w-[60ch]">
          <h2 className="font-display text-[clamp(2.8rem,7vw,5.5rem)] italic leading-[0.90] tracking-tight text-bone-100">
            Engineered for the{' '}
            <span className="text-ember-400">one percent</span>
            <br className="hidden sm:block" /> of the one percent.
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid gap-px bg-[var(--line)] md:grid-cols-12">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              data-feat-card
              className={cn(
                'group relative flex flex-col justify-between overflow-hidden bg-ink-900 p-8 transition-colors duration-500 hover:bg-ink-950 md:p-10',
                f.wide ? 'md:col-span-8' : 'md:col-span-4',
                f.accent && 'bg-ember-500/[0.06] hover:bg-ember-500/[0.09]',
              )}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-200/40">
                  {f.index}
                </span>
                {/* Subtle arrow — appears on hover */}
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4 shrink-0 translate-x-1 -translate-y-1 text-ember-400 opacity-0 transition-[opacity,transform] duration-300 ease-soft group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="M3 13 L13 3 M6 3 h7 v7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Content */}
              <div className="mt-12 md:mt-20">
                <h3
                  className={cn(
                    'font-display text-[clamp(1.6rem,3.5vw,2.4rem)] italic leading-[0.95]',
                    f.accent ? 'text-ember-300' : 'text-bone-100',
                  )}
                >
                  {f.title}
                </h3>
                <p className="mt-4 max-w-[38ch] text-[13px] leading-relaxed text-bone-200/70 md:text-sm">
                  {f.body}
                </p>
              </div>

              {/* Bottom corner lines */}
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
              >
                <span className="absolute bottom-0 right-0 h-px w-full bg-ember-400/50" />
                <span className="absolute bottom-0 right-0 h-full w-px bg-ember-400/50" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}