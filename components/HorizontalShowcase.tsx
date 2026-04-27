'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { useGsap } from '@/hooks/useGsap';
import { cn } from '@/utils/cn';
import { framePath } from '@/utils/frames';

const FILMS = [
  { slug: 'atacama', title: 'Atacama Nocturne', year: '2025', category: 'Expedition', poster: framePath(10) },
  { slug: 'svalbard', title: 'The Svalbard Line', year: '2024', category: 'Arctic', poster: framePath(40) },
  { slug: 'patagonia', title: 'Patagonian Thresh', year: '2024', category: 'Remote field', poster: framePath(70) },
  { slug: 'khosh', title: 'Khosh Yailov Descent', year: '2023', category: 'Cultural', poster: framePath(100) },
  { slug: 'empty-quarter', title: 'The Empty Quarter', year: '2022', category: 'Cinematography', poster: framePath(55) },
];

export default function HorizontalShowcase() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGsap(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    const getScrollAmount = () => track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${getScrollAmount()}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
      },
    });

  }, [], wrapperRef);

  return (
    <div ref={wrapperRef}>
      <section className="relative h-[100svh] w-full overflow-hidden bg-ink-950 border-t border-[var(--line)]">
        <div className="absolute top-12 left-6 md:left-12 z-10 flex items-baseline gap-6">
          <span className="eyebrow text-bone-100/40">§ Archive</span>
          <span className="eyebrow text-bone-100/70 hidden md:inline-block">Drag laterally — or scroll</span>
        </div>

        <div
          ref={trackRef}
          className="flex w-max items-center h-full pl-[10vw] gap-8 md:gap-16 will-change-transform"
        >
          {/* Intro panel */}
          <div className="flex-shrink-0 w-[80vw] md:w-[35vw]">
            <h2 className="font-display text-[10vw] md:text-[7vw] leading-[0.92] tracking-ultratight text-bone-100">
              The <span className="italic text-bone-400">archive</span>
            </h2>
            <p className="mt-6 text-bone-200/85 max-w-md leading-relaxed text-base md:text-lg">
              A traveling exhibition of stills from missions that exist only because we made them.
              Scroll right to walk through it.
            </p>
          </div>

          {/* Film slides */}
          {FILMS.map((film, i) => (
            <Link
              key={film.slug}
              href={`/#${film.slug}`}
              className="group flex-shrink-0 w-[75vw] md:w-[32vw] aspect-[3/4] relative overflow-hidden bg-ink-900 ring-1 ring-[var(--line)] transition-all duration-500 hover:ring-ember-500/40"
            >
              {film.poster ? (
                <Image 
                  src={film.poster} 
                  alt={film.title} 
                  fill 
                  sizes="(min-width: 768px) 32vw, 75vw"
                  className="object-cover transition-transform duration-[1400ms] ease-soft group-hover:scale-[1.06]" 
                />
              ) : (
                <div className="w-full h-full bg-ink-800" />
              )}
              
              {/* Readability gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
              
              <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-100/80">N° 0{i + 1}</span>
                <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-100/80">{film.year}</span>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                <h3 className="font-display text-3xl md:text-4xl text-bone-100 italic leading-[0.95]">{film.title}</h3>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-superwide text-bone-400">{film.category}</p>
              </div>
            </Link>
          ))}

          {/* End spacer */}
          <div className="flex-shrink-0 w-[20vw]" />
        </div>
      </section>
    </div>
  );
}
