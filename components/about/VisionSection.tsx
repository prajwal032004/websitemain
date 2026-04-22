'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';

export default function VisionSection() {
  const ref = useRef<HTMLElement | null>(null);

  useGsap(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray<HTMLElement>('[data-vision-word]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: '105%', opacity: 0 },
          {
            y: '0%', opacity: 1, duration: 1, delay: i * 0.015, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });
    },
    [],
    ref,
  );

  const line = 'Our vision is smaller than you would expect: to be the last operator a person ever calls.';

  return (
    <section ref={ref} className="relative bg-ink-900 py-28 md:py-40">
      <div className="container-fluid">
        <div className="mb-12 flex items-end justify-between border-t border-[var(--line)] pt-6">
          <p className="eyebrow">§ Vision</p>
          <p className="eyebrow hidden md:block">In fewer words</p>
        </div>

        <h2 className="font-display text-[8vw] leading-[0.92] tracking-ultratight text-bone-100 md:text-[5vw]">
          {line.split(' ').map((w, i) => (
            <span key={i} className="relative inline-block overflow-hidden pr-[0.18em]">
              <span data-vision-word className="inline-block">
                {w === 'last' || w === 'ever' ? <em className="italic text-ember-400">{w}</em> : w}
              </span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}