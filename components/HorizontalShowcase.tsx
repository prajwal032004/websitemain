'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { cn } from '@/utils/cn';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface ShowcaseItem {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  coords: string;
  imgSrc: string;          // static poster / thumbnail
  videoSrc: string;        // video that plays on hover
  accentHex: string;       // per-card accent tint
}

const ITEMS: ShowcaseItem[] = [
  {
    id: 1,
    title: 'Saharan Silence',
    subtitle: 'Where dunes meet stars',
    category: 'Desert',
    coords: '23°14′N  5°49′E',
    imgSrc: '/showcase/sahara-poster.jpg',
    videoSrc: '/videos/showcase/sahara.mp4',
    accentHex: '#E2893A',
  },
  {
    id: 2,
    title: 'Fjord Requiem',
    subtitle: 'Light that never sets',
    category: 'Nordic',
    coords: '61°03′N  6°41′E',
    imgSrc: '/showcase/fjord-poster.jpg',
    videoSrc: '/videos/showcase/fjord.mp4',
    accentHex: '#7FADD9',
  },
  {
    id: 3,
    title: 'Kyoto Dusk',
    subtitle: 'Temples & amber fog',
    category: 'East Asia',
    coords: '35°00′N  135°45′E',
    imgSrc: '/showcase/kyoto-poster.jpg',
    videoSrc: '/videos/showcase/kyoto.mp4',
    accentHex: '#D4A4A4',
  },
  {
    id: 4,
    title: 'Patagonian Edge',
    subtitle: 'Granite cathedrals',
    category: 'Wilderness',
    coords: '50°58′S  73°24′W',
    imgSrc: '/showcase/patagonia-poster.jpg',
    videoSrc: '/videos/showcase/patagonia.mp4',
    accentHex: '#8FC4A2',
  },
  {
    id: 5,
    title: 'Aegean Chapter',
    subtitle: 'Caldera & cobalt',
    category: 'Mediterranean',
    coords: '36°23′N  25°27′E',
    imgSrc: '/showcase/aegean-poster.jpg',
    videoSrc: '/videos/showcase/aegean.mp4',
    accentHex: '#4FA8C5',
  },
  {
    id: 6,
    title: 'Namib Passage',
    subtitle: 'Oldest desert on earth',
    category: 'Desert',
    coords: '24°12′S  15°49′E',
    imgSrc: '/showcase/namib-poster.jpg',
    videoSrc: '/videos/showcase/namib.mp4',
    accentHex: '#C4804A',
  },
];

function romanize(n: number): string {
  return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][n - 1] ?? String(n);
}

// ---------------------------------------------------------------------------
// HorizontalShowcase
// ---------------------------------------------------------------------------

export default function HorizontalShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useGsap(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      gsap.registerPlugin(ScrollTrigger);

      const getScrollAmount = () =>
        -(track.scrollWidth - section.offsetWidth);

      // ── Entry reveal ────────────────────────────────────────────────────
      const entryTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
        },
        defaults: { ease: 'expo.out' },
      });

      entryTl
        .from('[data-hs-eyebrow]', {
          y: 16,
          opacity: 0,
          duration: 1.0,
          stagger: 0.1,
        })
        .from(
          '[data-hs-card]',
          { x: 80, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out' },
          0.15,
        );

      // ── Horizontal pin & scroll ─────────────────────────────────────────
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount()) + section.offsetWidth * 0.35}`,
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      pinTl
        // Slide the strip
        .to(track, {
          x: () => getScrollAmount(),
          ease: 'none',
        })
        // Fade the progress indicator
        .from(
          '[data-hs-progress-fill]',
          { scaleX: 0, ease: 'none' },
          0,
        );

      // ── Progress rail sync ──────────────────────────────────────────────
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.abs(getScrollAmount()) + section.offsetWidth * 0.35}`,
        scrub: 1.1,
        onUpdate: (self) => {
          const fill = document.querySelector<HTMLElement>('[data-hs-progress-fill]');
          if (fill) fill.style.transform = `scaleX(${self.progress})`;
        },
        invalidateOnRefresh: true,
      });

      // ── Parallax card contents ──────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('[data-hs-inner]').forEach((inner, i) => {
        gsap.to(inner, {
          x: -32 * (i * 0.12 + 0.5),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.abs(getScrollAmount()) + section.offsetWidth * 0.35}`,
            scrub: 1.4,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    [],
    sectionRef,
  );

  return (
    <section
      ref={sectionRef}
      id="horizontal-showcase"
      aria-label="Destination showcase"
      /* ── CRITICAL: z-index is controlled by HomeShell layer wrapper.
         Do NOT add position/z-index here — would break GSAP's fixed pin. ── */
      className="relative h-screen w-full overflow-hidden bg-ink-950"
      style={{ zIndex: 2 }}
    >

      {/* ── Atmospheric grain + radial ──────────────────────────────── */}
      <div aria-hidden className="grain pointer-events-none absolute inset-0 z-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(226,137,58,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 40%, rgba(142,74,20,0.06) 0%, transparent 55%)',
        }}
      />

      {/* ── Top seam bleed ───────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-30"
        style={{
          height: 'clamp(80px, 14svh, 140px)',
          background: 'linear-gradient(to bottom, #0A0807 0%, transparent 100%)',
        }}
      />
      {/* ── Bottom seam bleed ────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30"
        style={{
          height: 'clamp(60px, 10svh, 100px)',
          background: 'linear-gradient(to top, #0A0807 0%, transparent 100%)',
        }}
      />

      {/* ── Top meta bar ─────────────────────────────────────────────── */}
      <div className="container-fluid pointer-events-none absolute left-0 right-0 top-8 z-20 flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <span
            data-hs-eyebrow
            className="font-mono text-[9px] uppercase tracking-superwide text-ember-400/70"
          >
            § Selected itineraries
          </span>
          <h2
            data-hs-eyebrow
            className="font-display text-[clamp(1.6rem,3.2vw,3rem)] italic leading-tight tracking-tight text-bone-100"
          >
            Meridian Journeys
          </h2>
        </div>

        {/* Scroll hint */}
        <div
          data-hs-eyebrow
          className="hidden items-center gap-2.5 md:flex"
        >
          <span className="font-mono text-[9px] uppercase tracking-superwide text-bone-200/40">
            Scroll to explore
          </span>
          <span aria-hidden className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-px w-3 bg-ember-400/40"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
            <span className="block h-px w-6 bg-ember-400/80" />
          </span>
        </div>
      </div>

      {/* ── Horizontal track ─────────────────────────────────────────── */}
      <div
        ref={trackRef}
        className="absolute top-0 flex h-full items-center will-change-transform"
        style={{ paddingLeft: 'clamp(1.5rem,5vw,5rem)', gap: 'clamp(0.75rem,1.5vw,1.5rem)' }}
      >
        {ITEMS.map((item, idx) => (
          <ShowcaseCard
            key={item.id}
            item={item}
            index={idx}
            isActive={activeIdx === idx}
            onEnter={() => setActiveIdx(idx)}
            onLeave={() => setActiveIdx((prev) => (prev === idx ? null : prev))}
          />
        ))}

        {/* End spacer */}
        <div className="shrink-0" style={{ width: 'clamp(1.5rem,5vw,5rem)' }} />
      </div>

      {/* ── Bottom progress rail ──────────────────────────────────────── */}
      <div
        className="container-fluid absolute bottom-8 left-0 right-0 z-20 flex items-center gap-4"
        aria-hidden
      >
        {/* Counter */}
        <span className="font-mono text-[9px] uppercase tracking-superwide text-bone-200/40 tabular-nums">
          {String(activeIdx !== null ? activeIdx + 1 : 1).padStart(2, '0')}&nbsp;/&nbsp;{String(ITEMS.length).padStart(2, '0')}
        </span>

        {/* Rail */}
        <div
          className="relative h-px flex-1 overflow-hidden rounded-full"
          style={{ background: 'rgba(255,255,255,0.10)' }}
        >
          <span
            data-hs-progress-fill
            className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(226,137,58,0.5) 0%, rgba(226,137,58,0.95) 100%)',
              transform: 'scaleX(0)',
              boxShadow: '0 0 8px rgba(226,137,58,0.4)',
            }}
          />
        </div>

        {/* Total */}
        <span className="font-mono text-[9px] uppercase tracking-superwide text-bone-200/40">
          {ITEMS.length} destinations
        </span>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ShowcaseCard
// ---------------------------------------------------------------------------

interface ShowcaseCardProps {
  item: ShowcaseItem;
  index: number;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function ShowcaseCard({ item, index, isActive, onEnter, onLeave }: ShowcaseCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [imgError, setImgError] = useState(false);

  // ── Accent as CSS custom property ───────────────────────────────────────
  const accentRgb = hexToRgb(item.accentHex);

  // ── Play / pause video on hover ──────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.currentTime = 0;
      v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, [isActive]);

  // ── Card hover tilt (subtle 3-D) ────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;   // -0.5 → 0.5
    const y = (e.clientY - top) / height - 0.5;
    gsap.to(el, {
      rotateY: x * 6,
      rotateX: -y * 4,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 900,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' });
    onLeave();
  }, [onLeave]);

  return (
    <div
      ref={cardRef}
      data-hs-card
      onMouseEnter={onEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={
        {
          '--accent': accentRgb,
          flexShrink: 0,
          width: 'clamp(280px, 45vw, 640px)',
          height: 'clamp(400px, 80vh, 880px)',
          willChange: 'transform',
        } as React.CSSProperties
      }
      className={cn(
        'group/card relative cursor-pointer select-none',
        'rounded-[1.75rem] overflow-hidden',
        'ring-1 transition-[box-shadow,--tw-ring-color] duration-500 ease-out',
        isActive
          ? 'ring-[rgba(var(--accent),0.55)] shadow-[0_0_0_1px_rgba(var(--accent),0.20),0_28px_90px_-24px_rgba(var(--accent),0.55),0_8px_30px_-8px_rgba(0,0,0,0.7)]'
          : 'ring-white/10 shadow-[0_16px_60px_-20px_rgba(0,0,0,0.65)]',
      )}
    >

      {/* ── Inner (parallax target) ── */}
      <div data-hs-inner className="relative h-full w-full">

        {/* ── Static poster image ── */}
        {!imgError && (
          <img
            src={item.imgSrc}
            alt=""
            aria-hidden
            draggable={false}
            onError={() => setImgError(true)}
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              'transition-opacity duration-700 ease-out',
              isActive && videoReady ? 'opacity-0' : 'opacity-100',
            )}
          />
        )}

        {/* ── Fallback gradient when image is missing ── */}
        {imgError && (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 80% 70% at 50% 60%, rgba(${accentRgb},0.22) 0%, rgba(10,8,7,0.95) 80%)`,
            }}
          />
        )}

        {/* ── Hover video ── */}
        <video
          ref={videoRef}
          src={item.videoSrc}
          muted
          playsInline
          loop
          preload="none"
          onCanPlay={() => setVideoReady(true)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            'transition-opacity duration-700 ease-out',
            isActive && videoReady ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden
        />

        {/* ── Deep cinematic vignette ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              'linear-gradient(180deg, rgba(10,8,7,0.45) 0%, transparent 30%, transparent 50%, rgba(10,8,7,0.90) 100%)',
              'linear-gradient(90deg, rgba(10,8,7,0.14) 0%, transparent 25%, transparent 75%, rgba(10,8,7,0.14) 100%)',
            ].join(', '),
          }}
        />

        {/* ── Active accent edge glow ── */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500',
            isActive ? 'opacity-100' : 'opacity-0',
          )}
          style={{ boxShadow: `inset 0 0 50px rgba(${accentRgb},0.15)` }}
        />

        {/* ── Top-left category chip ── */}
        <div className="absolute left-4 top-4 z-10">
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
              'border backdrop-blur-md',
              'transition-[background,border-color,box-shadow] duration-500',
              isActive
                ? 'border-[rgba(var(--accent),0.45)] bg-[rgba(var(--accent),0.15)] shadow-[0_0_14px_rgba(var(--accent),0.20)]'
                : 'border-white/15 bg-white/[0.06]',
            )}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500"
              style={{ background: isActive ? `rgb(${accentRgb})` : 'rgba(255,255,255,0.45)' }}
            />
            <span className="font-mono text-[9px] uppercase tracking-superwide text-bone-100">
              {item.category}&nbsp;—&nbsp;{romanize(item.id)}
            </span>
          </div>
        </div>

        {/* ── Top-right: "Playing" indicator ── */}
        <div
          className={cn(
            'absolute right-4 top-4 z-10',
            'transition-[opacity,transform] duration-500 ease-out',
            isActive ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
          )}
        >
          <div
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 backdrop-blur-md"
            style={{
              borderColor: `rgba(${accentRgb},0.45)`,
              background: `rgba(${accentRgb},0.14)`,
            }}
          >
            <SoundBars accentRgb={accentRgb} active={isActive} />
            <span className="font-mono text-[8px] uppercase tracking-superwide text-bone-100/80">
              Live
            </span>
          </div>
        </div>

        {/* ── Large roman numeral watermark ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 z-0 -translate-y-1/2 select-none"
        >
          <span
            className={cn(
              'font-display italic leading-none transition-[opacity,color] duration-500',
              'text-[clamp(5rem,12vw,9rem)]',
              isActive ? 'text-bone-100/[0.07]' : 'text-bone-100/[0.04]',
            )}
          >
            {romanize(item.id)}
          </span>
        </div>

        {/* ── Bottom text block ── */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          {/* Coords */}
          <p
            className={cn(
              'mb-1.5 font-mono text-[9px] uppercase tracking-superwide transition-[opacity,transform] duration-500',
              isActive ? 'translate-y-0 opacity-60' : 'translate-y-1 opacity-30',
            )}
            style={{ color: isActive ? `rgb(${accentRgb})` : 'rgb(var(--color-bone-200))' }}
          >
            {item.coords}
          </p>

          {/* Title */}
          <h3
            className={cn(
              'font-display text-[clamp(1.15rem,2.2vw,1.8rem)] italic leading-tight tracking-tight text-bone-50',
              'transition-transform duration-500',
              isActive ? 'translate-y-0' : 'translate-y-0.5',
            )}
          >
            {item.title}
          </h3>

          {/* Subtitle */}
          <p
            className={cn(
              'mt-0.5 font-mono text-[10px] uppercase tracking-superwide',
              'transition-[opacity,transform] duration-500 ease-out',
              isActive ? 'translate-y-0 opacity-55' : 'translate-y-1 opacity-0',
            )}
            style={{ color: `rgba(${accentRgb},0.85)` }}
          >
            {item.subtitle}
          </p>

          {/* Divider + CTA */}
          <div
            className={cn(
              'mt-3.5 flex items-center gap-3',
              'transition-[opacity,transform] duration-500 ease-out',
              isActive ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
            )}
          >
            <span
              className="block h-px flex-1 origin-left"
              style={{ background: `rgba(${accentRgb},0.35)` }}
            />
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-superwide text-bone-50"
              style={{
                border: `1px solid rgba(${accentRgb},0.35)`,
                background: `rgba(${accentRgb},0.10)`,
              }}
            >
              Explore
              <svg
                viewBox="0 0 12 12"
                className="h-2 w-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </span>
          </div>
        </div>

        {/* ── Progress ring (video) ── */}
        {isActive && (
          <div className="pointer-events-none absolute bottom-4 left-4 z-10">
            <VideoProgressRing videoRef={videoRef} accentRgb={accentRgb} />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// VideoProgressRing
// ---------------------------------------------------------------------------

function VideoProgressRing({
  videoRef,
  accentRgb,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  accentRgb: string;
}) {
  const [progress, setProgress] = useState(0);
  const SIZE = 28;
  const STROKE = 1.6;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v && v.duration > 0) setProgress(v.currentTime / v.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [videoRef]);

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
      <circle
        cx={SIZE / 2} cy={SIZE / 2} r={R}
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={STROKE}
      />
      <circle
        cx={SIZE / 2} cy={SIZE / 2} r={R}
        fill="none"
        stroke={`rgb(${accentRgb})`}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={CIRC}
        strokeDashoffset={CIRC * (1 - progress)}
        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        style={{ transition: 'stroke-dashoffset 120ms linear', filter: `drop-shadow(0 0 3px rgb(${accentRgb}))` }}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SoundBars — animated equalizer icon
// ---------------------------------------------------------------------------

function SoundBars({ accentRgb, active }: { accentRgb: string; active: boolean }) {
  return (
    <span className="flex items-end gap-[2px]" style={{ height: 10 }}>
      {[4, 8, 6, 10, 5].map((h, i) => (
        <span
          key={i}
          className="w-[2px] rounded-full"
          style={{
            height: active ? h : 3,
            background: `rgb(${accentRgb})`,
            transition: `height ${180 + i * 55}ms ease-in-out`,
            animation: active ? `soundBar${i} ${0.6 + i * 0.1}s ease-in-out infinite alternate` : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes soundBar0 { from { height: 3px } to { height: 8px } }
        @keyframes soundBar1 { from { height: 5px } to { height: 10px } }
        @keyframes soundBar2 { from { height: 4px } to { height: 7px } }
        @keyframes soundBar3 { from { height: 7px } to { height: 12px } }
        @keyframes soundBar4 { from { height: 3px } to { height: 6px } }
      `}</style>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert #RRGGBB → "R,G,B" string for CSS rgba() */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
