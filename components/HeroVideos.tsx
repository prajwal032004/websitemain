'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { cn } from '@/utils/cn';

/**
 * HeroVideos — Demo Teaser Showcase
 * ─────────────────────────────────
 * A single editorial showcase of Synkyn Studios' latest demo teaser.
 *
 * Layout (top → bottom):
 *   1. Section eyebrow + index badge          (above)
 *   2. Display headline + lede                (above)
 *   3. Video frame — 16:9, with chrome:
 *        - Play/Mute toggles (top-left, top-right)
 *        - Live timecode + duration           (overlaid corners)
 *        - Custom scrubbable progress bar     (bottom edge)
 *   4. Caption strip + tags                   (below)
 *   5. Production credits + CTA               (below)
 *
 * Responsiveness:
 *   - Mobile: stacked, video aspect 16:9 forced via padding-top trick
 *   - Tablet: same stack, larger headline
 *   - Desktop: 12-col grid, headline left, meta right above video,
 *     credits 2-col below
 *
 * Progress bar:
 *   - Native <video> element drives ground truth
 *   - requestAnimationFrame loop reads currentTime → updates fill width
 *   - Click + drag to scrub: pointer events on the rail set video.currentTime
 *   - Hover state lifts the rail height + reveals timestamp tooltip
 */

const DEMO_VIDEO_SRC = '/videos/herovideo.mp4';

type Tag = string;
const TAGS: Tag[] = ['Cinematography', 'Period drama', 'AI-assisted', 'Color graded', 'Sound designed'];

export default function HeroVideos() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const tooltipTimeRef = useRef<HTMLSpanElement | null>(null);

  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

  // ── Entrance animation ───────────────────────────────────────────────────
  useGsap(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
      },
      defaults: { ease: 'expo.out' },
    });

    tl.from('[data-hv-eyebrow]', { y: 16, opacity: 0, duration: 0.7 })
      .from('[data-hv-headline]', { y: 60, opacity: 0, duration: 1.1, stagger: 0.06 }, '-=0.4')
      .from('[data-hv-lede]', { y: 24, opacity: 0, duration: 0.9 }, '-=0.6')
      .from('[data-hv-frame]', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out' }, '-=0.6')
      .from('[data-hv-meta]', { y: 24, opacity: 0, duration: 0.9, stagger: 0.06 }, '-=0.7')
      .from('[data-hv-credit]', { y: 24, opacity: 0, duration: 0.8, stagger: 0.05 }, '-=0.6');
  }, [], sectionRef);

  // ── Video → progress bar sync ────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => setDuration(v.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => { setPlaying(false); setCurrentTime(v.duration || 0); };

    v.addEventListener('loadedmetadata', onLoaded);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);

    let raf = 0;
    const fill = fillRef.current;
    const dot = dotRef.current;
    const tick = () => {
      if (v && !scrubbing) {
        const t = v.currentTime;
        setCurrentTime(t);
        const pct = v.duration ? (t / v.duration) * 100 : 0;
        if (fill) fill.style.width = pct + '%';
        if (dot) dot.style.left = pct + '%';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener('loadedmetadata', onLoaded);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
    };
  }, [scrubbing]);

  // ── Scrub interaction ────────────────────────────────────────────────────
  const seekTo = useCallback((clientX: number) => {
    const v = videoRef.current;
    const rail = railRef.current;
    if (!v || !rail || !v.duration) return;
    const rect = rail.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const pct = x / rect.width;
    v.currentTime = pct * v.duration;
    setCurrentTime(v.currentTime);
    if (fillRef.current) fillRef.current.style.width = (pct * 100) + '%';
    if (dotRef.current) dotRef.current.style.left = (pct * 100) + '%';
  }, []);

  const showTooltip = useCallback((clientX: number) => {
    const rail = railRef.current;
    const tooltip = tooltipRef.current;
    const time = tooltipTimeRef.current;
    const v = videoRef.current;
    if (!rail || !tooltip || !time || !v?.duration) return;
    const rect = rail.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const pct = x / rect.width;
    tooltip.style.left = (pct * 100) + '%';
    tooltip.style.opacity = '1';
    time.textContent = formatTime(pct * v.duration);
  }, []);

  const hideTooltip = useCallback(() => {
    const t = tooltipRef.current;
    if (t) t.style.opacity = '0';
  }, []);

  const onRailPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setScrubbing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    seekTo(e.clientX);
  }, [seekTo]);

  const onRailPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    showTooltip(e.clientX);
    if (scrubbing) seekTo(e.clientX);
  }, [seekTo, scrubbing, showTooltip]);

  const onRailPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setScrubbing(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }, []);

  // ── Play/pause + mute ────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => undefined);
    else v.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="reel"
      className="relative bg-ink-950 py-20 text-bone-100 md:py-32"
    >
      <div className="container-fluid">

        {/* ─── ABOVE: Header strip ────────────────────────────────────── */}
        <div data-hv-eyebrow className="mb-8 flex items-center justify-between md:mb-12">
          <p className="eyebrow">§ Reel — Demo Teaser</p>
          <p className="font-mono text-[10px] uppercase tracking-superwide text-bone-400">
            Vol. 07 · 2026
          </p>
        </div>

        {/* ─── ABOVE: Headline + lede ────────────────────────────────── */}
        <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-12 md:items-end md:gap-10">
          <div className="md:col-span-7">
            <h2
              data-hv-headline
              className="font-display text-[12vw] italic leading-[0.86] tracking-ultratight md:text-[6.5vw]"
            >
              The wind <br />
              before the <br />
              <span className="text-ember-400">storm.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p data-hv-lede className="text-base leading-relaxed text-bone-200/85 md:text-lg">
              A 22-second teaser cut from our latest period drama collaboration.
              Shot on volume stage, color-graded for a cool grey midwinter palette,
              scored to a single low piano note.
            </p>
          </div>
        </div>

        {/* ─── VIDEO FRAME — Scaled down for desktop ────────────────── */}
        <div className="flex justify-center">
          <div
            data-hv-frame
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-ink-900 ring-1 ring-white/10 md:rounded-3xl"
          >
            {/* Aspect-ratio container — 16:9 universal */}
            <div className="relative aspect-[16/9] w-full">
            <video
              ref={videoRef}
              src={DEMO_VIDEO_SRC}
              muted={muted}
              playsInline
              preload="metadata"
              autoPlay
              loop
              className="absolute inset-0 h-full w-full object-cover"
              onClick={togglePlay}
            />

            {/* Cinematic vignette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(70% 60% at 50% 50%, transparent 50%, rgba(10,8,7,0.5) 100%)',
              }}
            />

            {/* Top chrome — index + tags */}
            <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-3 md:inset-x-6 md:top-6">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-superwide text-bone-100/85">
                <span className="glass rounded-full border-white/15 bg-white/[0.08] px-3 py-1.5">
                  ◉ REC · DEMO 07
                </span>
              </div>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Unmute' : 'Mute'}
                data-cursor={muted ? 'Unmute' : 'Mute'}
                className="glass pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border-white/15 bg-white/[0.08] text-bone-100 transition-[background,border-color,transform] duration-300 hover:scale-105 hover:border-ember-400 hover:bg-ember-500/15 md:h-11 md:w-11"
              >
                {muted ? <IconMuted /> : <IconUnmuted />}
              </button>
            </div>

            {/* Center play button — only when paused */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? 'Pause' : 'Play'}
              data-cursor={playing ? 'Pause' : 'Play'}
              className={cn(
                'absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full',
                'glass border-white/20 bg-white/[0.10] text-bone-100',
                'transition-[opacity,transform,background] duration-400 ease-soft md:h-20 md:w-20',
                playing ? 'pointer-events-none scale-90 opacity-0' : 'opacity-100',
                'hover:scale-105 hover:bg-ember-500/20',
              )}
            >
              <IconPlay />
            </button>

            {/* Bottom timecode strip */}
            <div className="pointer-events-none absolute inset-x-4 bottom-8 z-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-superwide text-bone-100/80 md:inset-x-6 md:bottom-12">
              <span>{formatTime(currentTime)}</span>
              <span className="hidden sm:inline">Synkyn Studios — Reel 07</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* ─── PROGRESS BAR ─────────────────────────────────────── */}
            <div
              ref={railRef}
              onPointerDown={onRailPointerDown}
              onPointerMove={onRailPointerMove}
              onPointerUp={onRailPointerUp}
              onPointerCancel={onRailPointerUp}
              onPointerLeave={hideTooltip}
              data-cursor="Scrub"
              className="absolute inset-x-4 bottom-3 z-20 cursor-pointer touch-none md:inset-x-6 md:bottom-5"
              style={{ height: '14px' }}
            >
              {/* Hover-lift wrapper — gives the bar a fatter hit area */}
              <div className="group relative h-full">
                {/* Rail */}
                <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/15 transition-[height] duration-200 group-hover:h-[4px]">
                  <div
                    ref={fillRef}
                    className="h-full bg-ember-400 transition-[background] duration-300 group-hover:bg-ember-300"
                    style={{ width: '0%', boxShadow: '0 0 12px rgba(226,137,58,0.45)' }}
                  />
                </div>

                {/* Scrub dot */}
                <div
                  ref={dotRef}
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    left: '0%',
                    boxShadow: '0 0 14px 2px rgba(226,137,58,0.65)',
                  }}
                />

                {/* Tooltip */}
                <div
                  ref={tooltipRef}
                  className="pointer-events-none absolute -top-9 -translate-x-1/2 rounded-md bg-ink-900/95 px-2.5 py-1 font-mono text-[10px] tracking-superwide text-bone-100 ring-1 ring-white/10 transition-opacity duration-150"
                  style={{ left: '0%', opacity: 0 }}
                >
                  <span ref={tooltipTimeRef}>0:00</span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* ─── BELOW: Caption + tags ────────────────────────────────── */}
        <div className="mt-10 flex flex-col gap-6 md:mt-14 md:flex-row md:items-start md:justify-between md:gap-12">
          <p
            data-hv-meta
            className="max-w-[52ch] font-display text-xl italic leading-snug text-bone-100 md:text-2xl"
          >
            &ldquo;Cinema is not what we record.{' '}
            <span className="text-ember-400">It is what we omit.</span>&rdquo;
          </p>

          <ul data-hv-meta className="flex flex-wrap gap-2 md:justify-end">
            {TAGS.map((t) => (
              <li
                key={t}
                className="glass rounded-full border-white/12 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] uppercase tracking-superwide text-bone-300/80"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* ─── BELOW: Credits + CTA ────────────────────────────────── */}
        <div className="mt-12 border-t border-[var(--line)] pt-10 md:mt-16 md:pt-14">
          <div className="grid gap-10 md:grid-cols-12 md:gap-10">
            {/* Credits — 3-col on desktop */}
            <dl
              data-hv-credit
              className="grid grid-cols-2 gap-x-6 gap-y-6 md:col-span-7 md:grid-cols-3"
            >
              {[
                { label: 'Direction', value: 'Dhiraj Kishore' },
                { label: 'Cinematography', value: 'Synkyn DOP Unit' },
                { label: 'Color', value: 'In-house grade' },
                { label: 'Score', value: 'Single piano cue' },
                { label: 'Runtime', value: '0:22' },
                { label: 'Format', value: '2.39 : 1 — H.264' },
              ].map((c) => (
                <div key={c.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-superwide text-bone-400">
                    {c.label}
                  </dt>
                  <dd className="mt-1 font-display text-base italic text-bone-100 md:text-lg">
                    {c.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* CTA column */}
            <div data-hv-credit className="flex flex-col gap-4 md:col-span-4 md:col-start-9">
              <p className="text-sm leading-relaxed text-bone-200/75">
                Want a teaser like this for your project? Brief us — we read
                every enquiry within one working hour.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <a
                  href="/#contact"
                  data-cursor="Brief us"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-ember-500 px-6 py-3.5 text-[11px] uppercase tracking-[0.28em] text-ink-950 transition-[background] duration-300 hover:bg-ember-400"
                >
                  Open a brief
                </a>
                <a
                  href="/works"
                  data-cursor="See works"
                  className="glass inline-flex items-center justify-center gap-3 rounded-full border-white/15 bg-white/[0.04] px-6 py-3.5 text-[11px] uppercase tracking-[0.28em] text-bone-100 transition-[background,border-color] duration-300 hover:border-ember-400 hover:bg-ember-500/10"
                >
                  See full reel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ':' + String(s).padStart(2, '0');
}

// ── Icons ────────────────────────────────────────────────────────────────────

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" aria-hidden>
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

function IconMuted() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}

function IconUnmuted() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}