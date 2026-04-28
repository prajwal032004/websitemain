'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { useLoaderComplete } from '@/hooks/useLoaderComplete';

export default function WorksHero() {
  const ref = useRef<HTMLElement | null>(null);
  const active = useLoaderComplete();

  useGsap(
    () => {
      if (!active || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        delay: 0.1,
      });

      tl.from('[data-works-eyebrow]', { y: 20, opacity: 0, duration: 0.9 })
        .from(
          '[data-works-word]',
          { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.08 },
          '-=0.6',
        )
        .from(
          '[data-works-sub]',
          { y: 24, opacity: 0, duration: 1, stagger: 0.08 },
          '-=0.4',
        );

      // Scroll parallax — title drifts up a touch as you leave the hero.
      gsap.to('[data-works-parallax]', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    },
    [active],
    ref,
  );

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-ink-950 pt-32 md:pt-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 50% at 50% 0%, rgba(230,207,68,0.12) 0%, transparent 60%)',
        }}
      />

      <div className="container-fluid relative z-10">
        <div className="flex items-end justify-between">
          <p data-works-eyebrow className="eyebrow">
            § Works — Selected Expeditions
          </p>
          <p data-works-eyebrow className="eyebrow hidden md:block">
            07 dossiers / of 5,243
          </p>
        </div>

        <h1
          data-works-parallax
          className="mt-10 font-display text-[16vw] leading-[0.86] tracking-ultratight text-bone-100 md:mt-14 md:text-[13vw]"
        >
          <span className="block overflow-hidden">
            <span data-works-word className="block">
              The <em className="italic text-bone-200">dossier</em>
            </span>
          </span>
          <span className="block overflow-hidden pl-[8vw] md:pl-[12vw]">
            <span data-works-word className="block italic text-ember-400">
              of voyages
            </span>
          </span>
          <span className="block overflow-hidden pl-[22vw] md:pl-[30vw]">
            <span data-works-word className="block">
              already made.
            </span>
          </span>
        </h1>
      </div>

      <div className="container-fluid relative z-10 pb-14 md:pb-20">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <p
            data-works-sub
            className="max-w-lg text-sm leading-relaxed text-bone-200/80 md:col-span-5 md:text-base"
          >
            A partial selection. We do not publish the full register —
            discretion is part of the commission. Each expedition below was
            briefed in a sentence, flown in a week, and written up only
            years after the fact.
          </p>
          <div
            data-works-sub
            className="md:col-span-4 md:col-start-9 md:text-right"
          >
            <p className="font-mono text-[11px] uppercase tracking-superwide text-bone-400">
              Scroll
            </p>
            <p className="mt-2 font-display text-2xl italic text-bone-100">
              to the archive
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}