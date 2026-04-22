'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGsap } from '@/hooks/useGsap';
import { useLoaderComplete } from '@/hooks/useLoaderComplete';

export default function AboutHero() {
  const ref = useRef<HTMLElement | null>(null);
  const active = useLoaderComplete();

  useGsap(
    () => {
      if (!active || !ref.current) return;

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 });
      tl.from('[data-about-eyebrow]', { y: 20, opacity: 0, duration: 0.9 })
        .from(
          '[data-about-word]',
          { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.07 },
          '-=0.6',
        )
        .from(
          '[data-about-sub]',
          { y: 20, opacity: 0, duration: 0.9, stagger: 0.1 },
          '-=0.5',
        );
    },
    [active],
    ref,
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-[90svh] flex-col justify-between overflow-hidden bg-ink-950 pb-20 pt-32 md:pt-44"
    >
      <div className="container-fluid relative">
        <div className="flex items-end justify-between">
          <p data-about-eyebrow className="eyebrow">
            § About — Meridian
          </p>
          <p data-about-eyebrow className="eyebrow hidden md:block">
            Est. Geneva, 2013
          </p>
        </div>

        <h1 className="mt-14 max-w-[16ch] font-display text-[13vw] leading-[0.88] tracking-ultratight text-bone-100 md:text-[8vw]">
          <span className="block overflow-hidden">
            <span data-about-word className="block">
              We fly for those
            </span>
          </span>
          <span className="block overflow-hidden pl-[6vw] md:pl-[8vw]">
            <span data-about-word className="block italic text-bone-200">
              who do not need
            </span>
          </span>
          <span className="block overflow-hidden pl-[14vw] md:pl-[16vw]">
            <span data-about-word className="block italic text-ember-400">
              a brochure.
            </span>
          </span>
        </h1>
      </div>

      <div className="container-fluid mt-20 grid gap-10 md:grid-cols-12 md:items-end">
        <p
          data-about-sub
          className="max-w-lg text-base leading-relaxed text-bone-200/80 md:col-span-5 md:text-lg"
        >
          Thirteen years. One aircraft. Eleven people who answer their
          phones. Meridian is an operator, not a marketplace — every flight
          begins and ends with a human you have spoken to before.
        </p>
        <dl
          data-about-sub
          className="grid grid-cols-3 gap-6 md:col-span-4 md:col-start-9"
        >
          {[
            ['2013', 'Founded'],
            ['11', 'Crew'],
            ['174', 'Countries'],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="eyebrow">{l}</dt>
              <dd className="mt-2 font-display text-3xl italic leading-none text-bone-100 md:text-4xl">
                {n}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}