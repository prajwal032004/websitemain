'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';

export default function IntroSection() {
  const ref = useRef<HTMLElement | null>(null);

  useGsap(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray<HTMLElement>('[data-intro-word]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: '105%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 1,
            delay: i * 0.02,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          },
        );
      });

      gsap.fromTo(
        '[data-intro-meta]',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 70%',
            once: true,
          },
        },
      );
    },
    [],
    ref,
  );

  const line1 = 'We do not sell flights.';
  const line2 = 'We sell the hours you remember for the rest of your life.';

  return (
    <section
      ref={ref}
      id="manifesto-body"
      className="relative bg-ink-950 py-28 md:py-40"
    >
      <div className="container-fluid">
        <div className="mb-12 flex items-end justify-between border-t border-[var(--line)] pt-6 md:mb-20">
          <p data-intro-meta className="eyebrow">
            § 01 — Manifesto
          </p>
          <p data-intro-meta className="eyebrow hidden md:block">
            Est. Geneva / 2013
          </p>
        </div>

        <h2 className="font-display text-[10vw] leading-[0.92] tracking-ultratight text-bone-100 md:text-[7vw]">
          <span className="block overflow-hidden">
            {line1.split(' ').map((w, i) => (
              <span key={`a-${i}`} className="relative inline-block overflow-hidden pr-[0.18em]">
                <span data-intro-word className="inline-block will-animate">
                  {w}
                </span>
              </span>
            ))}
          </span>
          <span className="block overflow-hidden text-bone-400">
            {line2.split(' ').map((w, i) => (
              <span key={`b-${i}`} className="relative inline-block overflow-hidden pr-[0.18em]">
                <span data-intro-word className="inline-block italic will-animate">
                  {w}
                </span>
              </span>
            ))}
          </span>
        </h2>

        <div className="mt-20 grid gap-12 border-t border-[var(--line)] pt-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p data-intro-meta className="eyebrow mb-4">
              Principle
            </p>
            <p data-intro-meta className="font-display text-2xl italic text-bone-100 md:text-3xl">
              One aircraft. <br />
              One mission. <br />
              <span className="text-ember-400">One horizon.</span>
            </p>
          </div>
          <div className="md:col-span-8 md:col-start-6">
            <p
              data-intro-meta
              className="text-pretty text-base leading-relaxed text-bone-200/85 md:text-lg"
            >
              For thirteen years we have flown the people who ask for the
              impossible — and then asked us not to tell anyone. A desert at
              4:42 AM. A glacier one storm before it calves. A runway that
              closes in forty minutes and reopens for no one. Our answer is
              always the same: yes, and we will be there before you are.
            </p>
            <p
              data-intro-meta
              className="mt-6 text-pretty text-base leading-relaxed text-bone-200/85 md:text-lg"
            >
              Meridian is a crew of eleven. An operations desk that does not
              sleep. A single Gulfstream 650ER kept at readiness year-round.
              And a thousand small decisions made in your favor before you
              have asked.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
