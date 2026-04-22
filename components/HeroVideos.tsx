'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { useLoaderComplete } from '@/hooks/useLoaderComplete';
import { cn } from '@/utils/cn';

export default function HeroVideos() {
  const active = useLoaderComplete();
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftVidRef = useRef<HTMLVideoElement | null>(null);
  const rightVidRef = useRef<HTMLVideoElement | null>(null);
  const [leftFailed, setLeftFailed] = useState(false);
  const [rightFailed, setRightFailed] = useState(false);

  useGsap(
    () => {
      if (!active || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      // Try to play the videos; autoplay can fail on iOS if the user hasn't interacted,
      // but `muted + playsInline` is our insurance policy.
      const tryPlay = async (v: HTMLVideoElement | null, onFail: () => void) => {
        if (!v) return;
        try {
          await v.play();
        } catch {
          onFail();
        }
      };
      void tryPlay(leftVidRef.current, () => setLeftFailed(true));
      void tryPlay(rightVidRef.current, () => setRightFailed(true));

      // Cinematic intro — panels slide in from the edges behind the headline.
      const intro = gsap.timeline({
        defaults: { ease: 'expo.out', duration: 1.4 },
        delay: 0.1,
      });

      intro
        .from('[data-hero-panel="left"]', { xPercent: -18, opacity: 0 }, 0)
        .from('[data-hero-panel="right"]', { xPercent: 18, opacity: 0 }, 0)
        .from('[data-hero-line]', { yPercent: 110, opacity: 0, stagger: 0.08, duration: 1.1 }, 0.15)
        .from(
          '[data-hero-meta]',
          { y: 20, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out' },
          0.55,
        );

      // Scroll parallax — panels drift apart and scale down slightly while scrolling out.
      const parallax = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      parallax
        .to('[data-hero-panel="left"]', { xPercent: -6, scale: 0.95, ease: 'none' }, 0)
        .to('[data-hero-panel="right"]', { xPercent: 6, scale: 0.95, ease: 'none' }, 0)
        .to('[data-hero-headline]', { y: -80, opacity: 0.7, ease: 'none' }, 0);
    },
    [active],
    sectionRef,
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink-950 pt-24 md:pt-32"
    >
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 0%, rgba(226,137,58,0.14) 0%, transparent 60%), radial-gradient(100% 80% at 50% 100%, rgba(10,8,7,1) 40%, rgba(142,74,20,0.08) 100%)',
        }}
      />

      {/* Videos */}
      <div className="container-fluid relative z-10 grid grid-cols-2 gap-3 md:gap-6">
        <VideoPanel
          side="left"
          src="/videos/hero-1.mp4"
          poster="/videos/hero-1-poster.jpg"
          videoRef={leftVidRef}
          failed={leftFailed}
          onFail={() => setLeftFailed(true)}
          label="N 29°58′"
          sublabel="Dune / approach"
        />
        <VideoPanel
          side="right"
          src="/videos/hero-2.mp4"
          poster="/videos/hero-2-poster.jpg"
          videoRef={rightVidRef}
          failed={rightFailed}
          onFail={() => setRightFailed(true)}
          label="W 112°07′"
          sublabel="Aperture / exit"
        />
      </div>

      {/* Headline over the panels */}
      <div
        data-hero-headline
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[100svh] flex-col justify-between pt-32 md:pt-40"
      >
        <div className="container-fluid">
          <div className="flex items-end justify-between gap-6">
            <p data-hero-meta className="eyebrow">
              MMXXVI / Vol. 07
            </p>
            <p data-hero-meta className="eyebrow hidden md:block">
              24 / 151 — Index
            </p>
          </div>

          <h1 className="mt-8 font-display text-[15vw] leading-[0.88] tracking-ultratight text-bone-100 md:mt-10 md:text-[13vw]">
            <span className="block overflow-hidden">
              <span data-hero-line className="block">
                Private <em className="italic text-bone-200"> Journeys</em>
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block pl-[18vw] md:pl-[24vw]">
                beyond <span className="italic text-ember-400">
                  Limits</span>
              </span>
            </span>
          </h1>
        </div>

        <div className="container-fluid pb-10 md:pb-14">
          <div className="flex items-end justify-between gap-8">
            <p
              data-hero-meta
              className="max-w-sm text-sm leading-relaxed text-bone-200/80 md:text-base"
            >
              Meridian crafts bespoke voyages for twelve passengers at a time — from a
              frozen Patagonian fjord to the last light over the Rub&rsquo; al Khali.
              No brochure. No itinerary. Only the horizon you choose.
            </p>

            <a
              data-hero-meta
              href="#manifesto"
              className="group pointer-events-auto hidden items-center gap-3 text-sm text-bone-100 md:flex"
              aria-label="Scroll to manifesto"
            >
              <span className="font-mono text-[11px] uppercase tracking-superwide">
                Continue
              </span>
              <span
                aria-hidden
                className="relative block h-8 w-px overflow-hidden bg-bone-100/20"
              >
                <span className="absolute inset-x-0 top-0 block h-3 w-px animate-[shimmer_2s_linear_infinite] bg-ember-400" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

interface VideoPanelProps {
  src: string;
  poster: string;
  side: 'left' | 'right';
  label: string;
  sublabel: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  failed: boolean;
  onFail: () => void;
}

function VideoPanel({
  src,
  poster,
  side,
  label,
  sublabel,
  videoRef,
  failed,
  onFail,
}: VideoPanelProps) {
  return (
    <div
      data-hero-panel={side}
      className={cn(
        'relative aspect-[4/5] overflow-hidden rounded-sm bg-ink-800 ring-1 ring-[var(--line-strong)]',
        'md:aspect-[3/4]',
      )}
    >
      {!failed ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="h-full w-full scale-[1.03] object-cover"
          muted
          playsInline
          autoPlay
          loop
          preload="metadata"
          onError={onFail}
          aria-hidden
        />
      ) : (
        // Graceful fallback: poster only. Still feels intentional.
        <img
          src={poster}
          alt=""
          className="h-full w-full scale-[1.03] object-cover"
          aria-hidden
        />
      )}

      {/* Readability gradient */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-ink-950/40"
      />

      {/* Panel labels */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-4 md:px-6 md:pb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-superwide text-bone-100/80">
            {label}
          </p>
          <p className="mt-1 font-display text-sm italic text-bone-100/90">
            {sublabel}
          </p>
        </div>
        <div className="hidden font-mono text-[10px] uppercase tracking-superwide text-bone-100/60 md:block">
          {side === 'left' ? '01 / 02' : '02 / 02'}
        </div>
      </div>

      {/* Corner ticks — editorial detail */}
      <CornerTick className="left-2 top-2" />
      <CornerTick className="right-2 top-2" rotate={90} />
    </div>
  );
}

function CornerTick({
  className,
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn('absolute h-4 w-4 md:h-5 md:w-5', className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span className="absolute left-0 top-0 h-px w-full bg-bone-100/60" />
      <span className="absolute left-0 top-0 h-full w-px bg-bone-100/60" />
    </div>
  );
}