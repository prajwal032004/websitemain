'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

const DESKTOP_SRCS = ['/videos/desktop.mp4', '/videos/desktop.mp4'] as const;
const MOBILE_SRCS  = ['/videos/mobile.mp4',  '/videos/mobile.mp4' ] as const;

export default function HeroVideos() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const sectionRef = useRef<HTMLElement | null>(null);
  const sources = isDesktop === false ? MOBILE_SRCS : DESKTOP_SRCS;
  const [audioOwnerIndex, setAudioOwnerIndex] = useState<number | null>(null);

  useEffect(() => { setAudioOwnerIndex(null); }, [sources]);

  useGsap(
    () => {
      if (!sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      // ── Entry animation ──────────────────────────────────────────────
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      tl.from('[data-hero-tile]', {
        y: 72,
        scale: 0.92,
        opacity: 0,
        duration: 1.5,
        stagger: 0.18,
      })
        .from(
          '[data-hero-meta]',
          { y: 18, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out' },
          0.3,
        )
        .from(
          '[data-hero-glass]',
          { y: 24, opacity: 0, duration: 1.0, stagger: 0.07, ease: 'power3.out' },
          0.5,
        )
        .from(
          '[data-hero-divider]',
          { scaleX: 0, opacity: 0, duration: 1.1, ease: 'expo.out', transformOrigin: 'left center' },
          0.2,
        );

      // ── Scroll-out parallax ──────────────────────────────────────────
      gsap.to('[data-hero-tile]', {
        y: -48,
        scale: 0.965,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    },
    [],
    sectionRef,
  );

  return (
    <section
      ref={sectionRef}
      id="hero-videos"
      className={cn(
        'relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950',
        'pt-16 sm:pt-20 md:pt-24',
        'pb-6 md:pb-10',
      )}
    >

      {/* ─── Seam bleed from FrameScrollCanvas above ─────────────────────
          Must be the very first child. Dissolves the hard section boundary
          into #0A0807 before the section's own atmosphere layers kick in.  */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-30"
        style={{
          height: 'clamp(120px, 22svh, 220px)',
          background: 'linear-gradient(to bottom, #0A0807 0%, transparent 100%)',
        }}
      />

      {/* ─── Warm ember radial — top ────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(70% 45% at 50% 0%, rgba(226,137,58,0.16) 0%, transparent 60%), radial-gradient(90% 70% at 50% 100%, rgba(142,74,20,0.10) 0%, transparent 70%)',
        }}
      />

      {/* ─── Subtle vignette corners ─────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 55%, rgba(10,8,7,0.55) 100%)',
        }}
      />

      {/* ─── Grain ───────────────────────────────────────────────────── */}
      <div aria-hidden className="grain pointer-events-none absolute inset-0 z-0" />

      {/* ─── Top meta bar ────────────────────────────────────────────── */}
      <div className="container-fluid relative z-10 flex items-center justify-between gap-4">

        {/* Left eyebrow */}
        <div className="flex items-center gap-3">
          <span
            data-hero-divider
            className="hidden h-px w-8 origin-left bg-ember-400/60 sm:block"
          />
          <p data-hero-meta className="eyebrow text-bone-200/70">
            § Our story — diptych
          </p>
        </div>

        {/* Right instruction chip */}
        <div
          data-hero-meta
          className="glass hidden items-center gap-2 rounded-full border-white/10 bg-white/[0.04] px-3.5 py-1.5 sm:flex"
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-ember-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember-400" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-200/60">
            Press a speaker to listen — one at a time.
          </span>
        </div>
      </div>

      {/* ─── Section label — large editorial watermark ───────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 -translate-y-1/2 overflow-hidden select-none"
      >
        <p
          className="whitespace-nowrap text-center font-display text-[clamp(5rem,18vw,16rem)] italic leading-none text-bone-100/[0.025] tracking-tight"
        >
          diptych
        </p>
      </div>

      {/* ─── Center stage: two tiles ─────────────────────────────────── */}
      <div className="container-fluid relative z-10 flex flex-1 items-center justify-center py-4 md:py-10">
        <div
          className={cn(
            'grid w-full gap-3 sm:gap-4 md:gap-5',
            'grid-cols-1 md:grid-cols-2',
            'mx-auto max-w-[1440px]',
          )}
        >
          {sources.map((src, i) => (
            <VideoTile
              key={`${src}-${i}`}
              src={src}
              index={i}
              primary={i === 0}
              isAudioOwner={audioOwnerIndex === i}
              onRequestAudio={(claim) =>
                setAudioOwnerIndex(claim ? i : (owner) => (owner === i ? null : owner))
              }
            />
          ))}
        </div>
      </div>

      {/* ─── Bottom chrome ───────────────────────────────────────────── */}
      <div className="container-fluid relative z-10 mt-2 flex items-center justify-between gap-4 md:mt-0">

        {/* Coordinates */}
        <div className="flex items-center gap-3">
          <span
            data-hero-divider
            className="hidden h-px w-8 origin-left bg-ember-400/60 sm:block"
          />
          <p data-hero-meta className="eyebrow text-bone-200/60">
            46°12′N&nbsp;&nbsp;6°09′E&nbsp;—&nbsp;Geneva
          </p>
        </div>

        {/* Continue CTA */}
        <a
          data-hero-meta
          href="#manifesto-body"
          aria-label="Continue"
          className={cn(
            'group inline-flex items-center gap-3 text-bone-100',
            'glass rounded-full border-white/15 bg-white/[0.05] px-4 py-2',
            'transition-[background,border-color,box-shadow] duration-500 ease-soft',
            'hover:border-ember-400/60 hover:bg-ember-500/10 hover:shadow-[0_0_24px_rgba(226,137,58,0.15)]',
          )}
        >
          <span className="font-mono text-[10px] uppercase tracking-superwide md:text-[11px]">
            Continue
          </span>
          <span aria-hidden className="relative block h-6 w-px overflow-hidden bg-bone-100/20">
            <span className="absolute inset-x-0 top-0 block h-2.5 w-px animate-[shimmer_2s_linear_infinite] bg-ember-400" />
          </span>
          {/* Arrow nudge on hover */}
          <svg
            viewBox="0 0 12 12"
            className="h-2.5 w-2.5 translate-x-0 text-ember-400 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M2 6h8M6 2l4 4-4 4" />
          </svg>
        </a>
      </div>

      {/* ─── Bottom fade to next section ─────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
        style={{
          height: 'clamp(60px, 10svh, 100px)',
          background: 'linear-gradient(to top, #0A0807 0%, transparent 100%)',
        }}
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// VideoTile
// ---------------------------------------------------------------------------

interface VideoTileProps {
  src: string;
  index: number;
  primary: boolean;
  isAudioOwner: boolean;
  onRequestAudio: (claim: boolean) => void;
}

function VideoTile({ src, index, primary, isAudioOwner, onRequestAudio }: VideoTileProps) {
  const tileRef   = useRef<HTMLDivElement | null>(null);
  const videoRef  = useRef<HTMLVideoElement | null>(null);
  const [failed,       setFailed      ] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [progress,     setProgress    ] = useState(0);
  const [inView,       setInView      ] = useState(false);
  const [isPlaying,    setIsPlaying   ] = useState(false);

  const muted = !isAudioOwner;

  // ── Lazy-autoplay ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = tileRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) { if (e.isIntersecting) { setInView(true); io.disconnect(); break; } } },
      { rootMargin: '200px 0px', threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── Sync muted ───────────────────────────────────────────────────────────
  useEffect(() => { const v = videoRef.current; if (v) v.muted = muted; }, [muted]);

  // ── Play on inView ───────────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !inView) return;
    v.load();
    v.play().then(() => { setNeedsGesture(false); setIsPlaying(true); }).catch(() => setNeedsGesture(true));
  }, [src, inView]);

  // ── Pause when scrolled out ──────────────────────────────────────────────
  useEffect(() => {
    const el = tileRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const v = videoRef.current;
        if (!v) return;
        for (const e of entries) {
          if (e.isIntersecting) { if (v.paused) v.play().catch(() => undefined); }
          else                  { if (!v.paused) v.pause(); }
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── Progress rail ────────────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    const tick = () => { if (v.duration > 0) setProgress(v.currentTime / v.duration); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => { setNeedsGesture(false); setIsPlaying(true); }, () => setNeedsGesture(true));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    onRequestAudio(muted);
    if (v.paused) v.play().then(() => { setNeedsGesture(false); setIsPlaying(true); }, () => undefined);
  }, [muted, onRequestAudio]);

  return (
    <div
      ref={tileRef}
      data-hero-tile
      className={cn(
        'group/tile relative w-full overflow-hidden will-animate',
        'rounded-[1.5rem] sm:rounded-[1.75rem] md:rounded-[2rem] lg:rounded-[2.5rem]',
        'bg-ink-900',
        // Ring — ember accent when audio owner, subtle otherwise
        'ring-1 transition-[box-shadow,--tw-ring-color] duration-500 ease-soft',
        isAudioOwner
          ? 'ring-ember-400/50 shadow-[0_0_0_1px_rgba(226,137,58,0.25),0_32px_110px_-36px_rgba(226,137,58,0.45),0_8px_30px_-10px_rgba(0,0,0,0.6)]'
          : 'ring-white/10 shadow-[0_30px_100px_-40px_rgba(226,137,58,0.20),0_8px_30px_-10px_rgba(0,0,0,0.55)]',
        // Height
        'h-[calc((100svh-220px)/2)] min-h-[180px] max-h-[60svh]',
        'md:h-[calc(100svh-220px)] md:min-h-[320px] md:max-h-[820px]',
      )}
    >
      {/* ── Video ── */}
      {!failed && inView ? (
        <video
          ref={videoRef}
          key={src}
          src={src}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover transition-transform duration-700 ease-soft group-hover/tile:scale-[1.015]"
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          onError={() => setFailed(true)}
          onClick={togglePlay}
          aria-label={`Meridian — story diptych ${index + 1} of 2`}
        />
      ) : failed ? (
        <div aria-hidden className="absolute inset-0 grid place-items-center bg-ink-900 text-bone-400">
          <p className="font-mono text-[11px] uppercase tracking-superwide">Panel {index + 1} — offline</p>
        </div>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(226,137,58,0.10) 0%, transparent 70%)' }}
        />
      )}

      {/* ── Cinematic vignette veil ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'linear-gradient(180deg, rgba(10,8,7,0.50) 0%, transparent 28%, transparent 62%, rgba(10,8,7,0.72) 100%)',
            'linear-gradient(90deg, rgba(10,8,7,0.18) 0%, transparent 30%, transparent 70%, rgba(10,8,7,0.18) 100%)',
          ].join(', '),
        }}
      />

      {/* ── Ember edge glow when audio owner ── */}
      {isAudioOwner && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-700"
          style={{
            boxShadow: 'inset 0 0 40px rgba(226,137,58,0.12)',
          }}
        />
      )}

      {/* ── Top-left identity chip ── */}
      <div
        data-hero-glass
        className="pointer-events-none absolute left-3 top-3 md:left-4 md:top-4"
      >
        <div className="glass inline-flex items-center gap-2 rounded-full border-white/15 bg-white/[0.06] px-3 py-1.5 backdrop-blur-md">
          {primary ? (
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-ember-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember-400" />
            </span>
          ) : (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-bone-100/45" />
          )}
          <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-100">
            {primary ? 'Our story' : 'Dispatch'}&nbsp;—&nbsp;{romanize(index + 1)}
          </span>
        </div>
      </div>

      {/* ── Top-right audio toggle ── */}
      <button
        data-hero-glass
        type="button"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute — mutes the other panel' : 'Mute panel'}
        aria-pressed={!muted}
        className={cn(
          'glass absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full',
          'transition-[background,border-color,color,box-shadow,transform] duration-300 ease-soft',
          'md:right-4 md:top-4 md:h-10 md:w-10',
          'active:scale-90',
          isAudioOwner
            ? 'border-ember-400/70 bg-ember-500/20 text-bone-50 shadow-[0_0_16px_rgba(226,137,58,0.30)] hover:bg-ember-500/30'
            : 'border-white/15 bg-white/[0.06] text-bone-100/80 hover:border-white/30 hover:bg-white/[0.12] hover:text-bone-100',
        )}
      >
        <AudioIcon muted={muted} />
      </button>

      {/* ── Gesture play button ── */}
      {needsGesture && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play panel"
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            'glass grid h-16 w-16 place-items-center rounded-full border-white/20 bg-white/[0.12]',
            'backdrop-blur-xl transition-[background,transform,box-shadow] duration-400 ease-soft',
            'hover:scale-[1.06] hover:bg-white/[0.18] hover:shadow-[0_0_32px_rgba(226,137,58,0.20)]',
            'md:h-20 md:w-20',
          )}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-0.5 text-bone-100 md:h-6 md:w-6" aria-hidden>
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </button>
      )}

      {/* ── Index number — large editorial watermark ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 right-4 select-none md:bottom-10 md:right-6"
      >
        <span className="font-display text-[clamp(3rem,8vw,6rem)] italic leading-none text-bone-100/[0.06]">
          {romanize(index + 1)}
        </span>
      </div>

      {/* ── Progress rail ── */}
      <div
        aria-hidden
        className="absolute inset-x-3 bottom-3 overflow-hidden rounded-full md:inset-x-4 md:bottom-4"
        style={{ height: '1.5px', background: 'rgba(255,255,255,0.12)' }}
      >
        {/* Track glow */}
        <span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progress * 100}%`,
            background: isAudioOwner
              ? 'linear-gradient(90deg, rgba(226,137,58,0.6) 0%, rgba(226,137,58,0.95) 100%)'
              : 'rgba(255,255,255,0.55)',
            transition: 'width 120ms linear',
            boxShadow: isAudioOwner ? '0 0 6px rgba(226,137,58,0.5)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Audio icon
// ---------------------------------------------------------------------------

function AudioIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" stroke="none" />
      {muted ? (
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      )}
    </svg>
  );
}

function romanize(n: number): string {
  return ['I', 'II', 'III', 'IV', 'V'][n - 1] ?? String(n);
}