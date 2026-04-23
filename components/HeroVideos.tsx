'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

/** Video source pairs. Swap filenames here if you rename the files in /public/videos. */
const DESKTOP_SRCS = ['/videos/desktop.mp4', '/videos/desktop.mp4'] as const;
const MOBILE_SRCS = ['/videos/mobile.mp4', '/videos/mobile.mp4'] as const;

/**
 * HeroVideos — two-video diptych.
 *
 * Entrance animation is triggered by ScrollTrigger (when the section enters
 * the viewport), not by `useLoaderComplete` — because this section now lives
 * BELOW the FrameScrollCanvas, so by the time the user reaches it the loader
 * has long since dismissed. We want the choreography to fire when it becomes
 * visible, not on page load.
 *
 * Videos also lazy-start via IntersectionObserver to avoid burning bandwidth
 * on an off-screen autoplay.
 */
export default function HeroVideos() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const sectionRef = useRef<HTMLElement | null>(null);

  const sources = isDesktop === false ? MOBILE_SRCS : DESKTOP_SRCS;

  const [audioOwnerIndex, setAudioOwnerIndex] = useState<number | null>(null);

  useEffect(() => {
    setAudioOwnerIndex(null);
  }, [sources]);

  // Entrance + scroll parallax — both scroll-driven so they behave correctly
  // when HeroVideos is the *second* section on the page.
  useGsap(
    () => {
      if (!sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%', // fires when top of section is 80% down the viewport
          once: true,       // play once; afterwards items remain visible
        },
      });

      tl.from('[data-hero-tile]', {
        y: 56,
        scale: 0.94,
        opacity: 0,
        duration: 1.3,
        stagger: 0.14,
      })
        .from(
          '[data-hero-meta]',
          { y: 14, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out' },
          0.35,
        )
        .from(
          '[data-hero-glass]',
          { y: 20, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out' },
          0.55,
        );

      // Subtle scroll-out parallax — tiles lift and shrink a touch when leaving view.
      gsap.to('[data-hero-tile]', {
        y: -36,
        scale: 0.97,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
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
        'pb-6 md:pb-8',
      )}
    >
      {/* Warm glow + grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 45% at 50% 0%, rgba(226,137,58,0.18) 0%, transparent 60%), radial-gradient(90% 70% at 50% 100%, rgba(142,74,20,0.10) 0%, transparent 70%)',
        }}
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0" />

      {/* ─── Top meta ──────────────────────────────────────────── */}
      <div className="container-fluid relative z-10 flex items-center justify-between gap-4">
        <p data-hero-meta className="eyebrow">
          § Our story — diptych
        </p>
        <p data-hero-meta className="eyebrow hidden sm:block">
          Press a speaker to listen — one at a time.
        </p>
      </div>

      {/* ─── Center stage: two tiles ───────────────────────────── */}
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

      {/* ─── Bottom meta ──────────────────────────────────────── */}
      <div className="container-fluid relative z-10 mt-2 flex items-center justify-between gap-4 md:mt-0">
        <p data-hero-meta className="eyebrow">
          46°12′N&nbsp;&nbsp;6°09′E &nbsp;—&nbsp; Geneva
        </p>

        <a
          data-hero-meta
          href="#manifesto-body"
          aria-label="Continue"
          className={cn(
            'group inline-flex items-center gap-3 text-bone-100',
            'glass rounded-full border-white/15 bg-white/[0.05] px-4 py-2 transition-[background,border-color] duration-300 hover:border-ember-400 hover:bg-ember-500/10',
          )}
        >
          <span className="font-mono text-[10px] uppercase tracking-superwide md:text-[11px]">
            Continue
          </span>
          <span
            aria-hidden
            className="relative block h-6 w-px overflow-hidden bg-bone-100/20"
          >
            <span className="absolute inset-x-0 top-0 block h-2.5 w-px animate-[shimmer_2s_linear_infinite] bg-ember-400" />
          </span>
        </a>
      </div>
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

function VideoTile({
  src,
  index,
  primary,
  isAudioOwner,
  onRequestAudio,
}: VideoTileProps) {
  const tileRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);

  const muted = !isAudioOwner;

  // Lazy-autoplay: only start the video once the tile is close to the viewport.
  // Saves bandwidth/battery while the user is still reading the section above.
  useEffect(() => {
    const el = tileRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect(); // one-shot — once seen, stay on
            break;
          }
        }
      },
      { rootMargin: '200px 0px', threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Sync the <video> element's `muted` property with the parent's ownership.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
  }, [muted]);

  // (Re)try autoplay when the video comes into view or the src changes.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !inView) return;
    v.load();

    const tryPlay = async () => {
      try {
        await v.play();
        setNeedsGesture(false);
      } catch {
        setNeedsGesture(true);
      }
    };
    void tryPlay();
  }, [src, inView]);

  // Pause when the tile scrolls well out of view (saves decoding cycles).
  useEffect(() => {
    const el = tileRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const v = videoRef.current;
        if (!v) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (v.paused) v.play().catch(() => undefined);
          } else {
            if (!v.paused) v.pause();
          }
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Progress rail
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    const tick = () => {
      if (v.duration > 0) setProgress(v.currentTime / v.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(
        () => setNeedsGesture(false),
        () => setNeedsGesture(true),
      );
    } else {
      v.pause();
    }
  }, []);

  const toggleMute = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const v = videoRef.current;
      if (!v) return;

      onRequestAudio(muted);

      if (v.paused) {
        v.play().then(
          () => setNeedsGesture(false),
          () => undefined,
        );
      }
    },
    [muted, onRequestAudio],
  );

  return (
    <div
      ref={tileRef}
      data-hero-tile
      className={cn(
        'relative w-full overflow-hidden will-animate',
        'rounded-[1.5rem] sm:rounded-[1.75rem] md:rounded-[2rem] lg:rounded-[2.5rem]',
        'bg-ink-900 ring-1 ring-white/10',
        isAudioOwner && 'ring-ember-400/40',
        'shadow-[0_30px_100px_-40px_rgba(226,137,58,0.25),0_8px_30px_-10px_rgba(0,0,0,0.55)]',
        'h-[calc((100svh-220px)/2)] min-h-[180px] max-h-[60svh]',
        'md:h-[calc(100svh-220px)] md:min-h-[320px] md:max-h-[820px]',
        'transition-[box-shadow,--tw-ring-color] duration-500 ease-soft',
      )}
    >
      {!failed && inView ? (
        <video
          ref={videoRef}
          key={src}
          src={src}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover"
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
        <div
          aria-hidden
          className="absolute inset-0 grid place-items-center bg-ink-900 text-bone-400"
        >
          <p className="font-mono text-[11px] uppercase tracking-superwide">
            Panel {index + 1} — offline
          </p>
        </div>
      ) : (
        // Before the tile is in view, just a quiet ember glow placeholder.
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(226,137,58,0.12) 0%, rgba(0,0,0,0) 70%)',
          }}
        />
      )}

      {/* Cinematic veil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/45 via-transparent to-ink-950/55"
      />

      {/* Top-left chip */}
      <div
        data-hero-glass
        className="pointer-events-none absolute left-3 top-3 md:left-4 md:top-4"
      >
        <div className="glass inline-flex items-center gap-2 rounded-full border-white/15 bg-white/[0.06] px-3 py-1.5">
          {primary ? (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-ember-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember-400" />
            </span>
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-bone-100/50" />
          )}
          <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-100">
            {primary ? 'Our story' : 'Dispatch'}&nbsp;—&nbsp;{romanize(index + 1)}
          </span>
        </div>
      </div>

      {/* Top-right audio toggle */}
      <button
        data-hero-glass
        type="button"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute panel — mutes the other' : 'Mute panel'}
        aria-pressed={!muted}
        className={cn(
          'glass absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full transition-[background,border-color,color] duration-300',
          'md:right-4 md:top-4 md:h-10 md:w-10',
          isAudioOwner
            ? 'border-ember-400/70 bg-ember-500/20 text-bone-50 hover:bg-ember-500/30'
            : 'border-white/15 bg-white/[0.06] text-bone-100 hover:border-white/30 hover:bg-white/[0.12]',
        )}
      >
        <AudioIcon muted={muted} />
      </button>

      {/* Gesture-required play button */}
      {needsGesture ? (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play panel"
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            'glass grid h-16 w-16 place-items-center rounded-full border-white/20 bg-white/[0.12] backdrop-blur-xl transition-[background,transform] duration-400 ease-soft',
            'hover:scale-[1.05] hover:bg-white/[0.18]',
            'md:h-20 md:w-20',
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 translate-x-0.5 text-bone-100 md:h-6 md:w-6"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </button>
      ) : null}

      {/* Progress rail */}
      <div
        aria-hidden
        className="absolute inset-x-3 bottom-3 h-px overflow-hidden rounded-full bg-white/15 md:inset-x-4 md:bottom-4"
      >
        <span
          className="block h-full bg-ember-400/90"
          style={{ width: `${progress * 100}%`, transition: 'width 120ms linear' }}
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