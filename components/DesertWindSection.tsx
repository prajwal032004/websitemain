'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';

/* ─── Frame paths pulled directly from the existing sequence ─── */
const PANELS = [
  {
    src: '/frames/desktop/0030.webp',
    alt: 'Silhouette within crumbling ruins at sunset',
    caption: 'The approach',
    depth: '01',
    parallaxY: -80,
    parallaxScale: 1.12,
  },
  {
    src: '/frames/desktop/0075.webp',
    alt: 'Figure standing in a desert passage, golden hour',
    caption: 'The passage',
    depth: '02',
    parallaxY: -120,
    parallaxScale: 1.08,
  },
  {
    src: '/frames/desktop/0100.webp',
    alt: 'Ancient doorway opening to endless dunes',
    caption: 'The threshold',
    depth: '03',
    parallaxY: -60,
    parallaxScale: 1.15,
  },
  {
    src: '/frames/desktop/0130.webp',
    alt: 'Vast open desert dunes under a burning sky',
    caption: 'The open',
    depth: '04',
    parallaxY: -100,
    parallaxScale: 1.1,
  },
] as const;

/* ─── Wind particle canvas ──────────────────────────────────── */

type Particle = {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  angle: number;
  life: number;
  maxLife: number;
};

function spawnParticle(W: number, H: number): Particle {
  const maxLife = 90 + Math.random() * 120;
  return {
    x: Math.random() * W * 1.2 - W * 0.1,
    y: Math.random() * H,
    len: 18 + Math.random() * 70,
    speed: 1.2 + Math.random() * 2.8,
    opacity: 0,
    angle: -8 + Math.random() * 16, // slight diagonal — simulates hot-air drift
    life: 0,
    maxLife,
  };
}

function useWindCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let raf = 0;

    const PARTICLE_COUNT = 60;
    const particles: Particle[] = [];

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };

    const init = () => {
      resize();
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = spawnParticle(W, H);
        // Scatter initial life so they don't all spawn at once
        p.life = Math.random() * p.maxLife;
        p.x = Math.random() * W;
        p.y = Math.random() * H;
        particles.push(p);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.life++;

        const halfLife = p.maxLife * 0.5;
        const t = p.life / p.maxLife;
        // Ease in and out
        const fade =
          t < 0.3
            ? t / 0.3
            : t > 0.7
              ? (1 - t) / 0.3
              : 1;

        p.opacity = fade * (0.15 + Math.random() * 0.08);
        // Slight speed flicker for turbulence
        const vx = p.speed * (1 + Math.sin(p.life * 0.08) * 0.2);
        const vy = Math.sin((p.angle * Math.PI) / 180) * vx * 0.4;
        p.x += vx;
        p.y += vy;

        if (p.life >= p.maxLife || p.x > W + 60) {
          Object.assign(p, spawnParticle(W, H));
          p.x = -p.len;
        }

        const rad = (p.angle * Math.PI) / 180;
        const ex = p.x + Math.cos(rad) * p.len;
        const ey = p.y + Math.sin(rad) * p.len;

        const grad = ctx.createLinearGradient(p.x, p.y, ex, ey);
        grad.addColorStop(0, `rgba(255, 210, 140, 0)`);
        grad.addColorStop(0.3, `rgba(255, 200, 120, ${p.opacity})`);
        grad.addColorStop(0.7, `rgba(226, 137, 58, ${p.opacity * 0.9})`);
        grad.addColorStop(1, `rgba(142, 74, 20, 0)`);

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.7 + Math.random() * 0.6;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    init();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [canvasRef]);
}

/* ─── Main component ──────────────────────────────────────── */

export default function DesertWindSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useWindCanvas(canvasRef);

  useGsap(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      /* Headline word reveal */
      gsap.utils.toArray<HTMLElement>('[data-dw-word]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            delay: i * 0.04,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });

      /* Eyebrow + body copy */
      gsap.fromTo(
        '[data-dw-meta]',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-dw-copy]',
            start: 'top 80%',
            once: true,
          },
        },
      );

      /* Canvas fade in */
      gsap.fromTo(
        canvasRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        },
      );

      /* Each image panel: parallax scroll */
      gsap.utils.toArray<HTMLElement>('[data-dw-panel]').forEach((panel) => {
        const img = panel.querySelector<HTMLElement>('[data-dw-img]');
        const py = parseFloat(panel.dataset.parallaxY ?? '-80');
        const ps = parseFloat(panel.dataset.parallaxScale ?? '1.1');

        if (img) {
          /* Scale the inner image up slightly so parallax shift doesn't reveal edges */
          gsap.set(img, { scale: ps });

          gsap.to(img, {
            yPercent: (py / window.innerHeight) * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        }

        /* Panel entrance */
        gsap.fromTo(
          panel,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              once: true,
            },
          },
        );
      });

      /* Horizontal divider lines — draw left-to-right */
      gsap.utils.toArray<HTMLElement>('[data-dw-line]').forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 85%',
              once: true,
            },
          },
        );
      });

      /* Floating stats chip — subtle bob */
      gsap.to('[data-dw-stat-bob]', {
        y: -10,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    },
    [],
    sectionRef,
  );

  return (
    <section
      ref={sectionRef}
      id="desert-wind"
      className="relative overflow-hidden bg-ink-950 py-28 text-bone-100 md:py-40"
    >
      {/* ── Ambient background glow ─────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 50% at 50% 80%, rgba(226,137,58,0.13) 0%, transparent 65%), radial-gradient(60% 40% at 20% 20%, rgba(142,74,20,0.10) 0%, transparent 60%)',
        }}
      />

      {/* ── Wind particle canvas ─────────────────────────────── */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-0"
      />

      {/* ── Section header ───────────────────────────────────── */}
      <div className="container-fluid relative z-20">
        <div
          data-dw-line
          className="mb-8 h-px w-full origin-left bg-[var(--line)] md:mb-12"
        />

        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-20">
          {/* Headline */}
          <div className="flex-1">
            <p data-dw-meta className="eyebrow mb-5">
              § The Rub&apos; al Khali — Expedition Notes
            </p>
            <h2 className="font-display text-[11vw] leading-[0.88] tracking-ultratight md:text-[6.5vw]">
              {'The wind'.split('').map((ch, i) => (
                <span key={`a${i}`} className="inline-block overflow-hidden">
                  <span data-dw-word className="inline-block">
                    {ch === ' ' ? '\u00A0' : ch}
                  </span>
                </span>
              ))}
              <br />
              <span className="italic text-ember-400">
                {'remembers'.split('').map((ch, i) => (
                  <span key={`b${i}`} className="inline-block overflow-hidden">
                    <span data-dw-word className="inline-block">
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
              <br />
              {'everything.'.split('').map((ch, i) => (
                <span key={`c${i}`} className="inline-block overflow-hidden">
                  <span data-dw-word className="inline-block text-bone-300">
                    {ch === ' ' ? '\u00A0' : ch}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          {/* Body + stat */}
          <div data-dw-copy className="flex-shrink-0 md:max-w-[38ch]">
            <p data-dw-meta className="text-base leading-relaxed text-bone-200/80 md:text-lg">
              The Empty Quarter shifts four centimetres per year. By the time
              you land, the dune you flew over on the way in is already a
              different shape. Meridian has flown this quarter — and ones like
              it — forty-seven times. We have never landed in exactly the same
              place twice.
            </p>

            <div
              data-dw-line
              className="my-6 h-px w-full origin-left bg-[var(--line)] md:my-8"
            />

            {/* Floating mini-stats strip */}
            <div
              data-dw-stat-bob
              className="glass inline-flex items-stretch divide-x divide-[var(--line)] rounded-2xl border-white/15 bg-white/[0.04]"
            >
              {[
                { value: '47×', label: 'Empty Quarter' },
                { value: '38°C', label: 'Avg midday' },
                { value: '04:42', label: 'Best entry' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-1 px-5 py-4">
                  <span className="font-display text-2xl italic text-bone-100">
                    {s.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-400">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Image grid — 4 desert frames ────────────────────── */}
      <div className="container-fluid relative z-20 mt-20 md:mt-28">
        {/* Row 1: 2-col + 1-col  (wide + tall) */}
        <div className="grid gap-4 md:grid-cols-12 md:gap-6">
          {/* Panel 1 — wide */}
          <div
            data-dw-panel
            data-parallax-y={PANELS[0].parallaxY}
            data-parallax-scale={PANELS[0].parallaxScale}
            className="relative overflow-hidden rounded-2xl md:col-span-7 md:rounded-3xl"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden">
              <Image
                data-dw-img
                src={PANELS[0].src}
                alt={PANELS[0].alt}
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
                priority
              />
              {/* Overlay */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-ink-950/30"
              />
            </div>
            <PanelLabel depth={PANELS[0].depth} caption={PANELS[0].caption} />
            <PanelCorners />
          </div>

          {/* Panel 2 — tall */}
          <div
            data-dw-panel
            data-parallax-y={PANELS[1].parallaxY}
            data-parallax-scale={PANELS[1].parallaxScale}
            className="relative overflow-hidden rounded-2xl md:col-span-5 md:rounded-3xl"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                data-dw-img
                src={PANELS[1].src}
                alt={PANELS[1].alt}
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/15 to-ink-950/25"
              />
            </div>
            <PanelLabel depth={PANELS[1].depth} caption={PANELS[1].caption} />
            <PanelCorners />
          </div>
        </div>

        {/* Mid divider with wind marker */}
        <div className="relative my-10 flex items-center gap-6 md:my-14">
          <div
            data-dw-line
            className="h-px flex-1 origin-left bg-[var(--line)]"
          />
          <div className="glass flex items-center gap-3 rounded-full border-white/15 bg-white/[0.04] px-5 py-2.5">
            <WindIcon />
            <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-200">
              Wind reading — 24 kts / NE
            </span>
          </div>
          <div
            data-dw-line
            className="h-px flex-1 origin-left bg-[var(--line)]"
          />
        </div>

        {/* Row 2: 1-col + wide  (tall + wide) */}
        <div className="grid gap-4 md:grid-cols-12 md:gap-6">
          {/* Panel 3 — narrow */}
          <div
            data-dw-panel
            data-parallax-y={PANELS[2].parallaxY}
            data-parallax-scale={PANELS[2].parallaxScale}
            className="relative overflow-hidden rounded-2xl md:col-span-5 md:rounded-3xl"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                data-dw-img
                src={PANELS[2].src}
                alt={PANELS[2].alt}
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/15 to-ink-950/25"
              />
            </div>
            <PanelLabel depth={PANELS[2].depth} caption={PANELS[2].caption} />
            <PanelCorners />
          </div>

          {/* Panel 4 — wide, with floating glass quote */}
          <div
            data-dw-panel
            data-parallax-y={PANELS[3].parallaxY}
            data-parallax-scale={PANELS[3].parallaxScale}
            className="relative overflow-hidden rounded-2xl md:col-span-7 md:rounded-3xl"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden">
              <Image
                data-dw-img
                src={PANELS[3].src}
                alt={PANELS[3].alt}
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/10 to-ink-950/35"
              />

              {/* Floating glass editorial quote on the big open-dunes image */}
              <div className="absolute inset-x-4 bottom-4 z-10 md:inset-x-6 md:bottom-6">
                <div className="glass rounded-2xl border-white/15 bg-white/[0.06] px-5 py-4 md:rounded-3xl md:px-7 md:py-6">
                  <p className="font-display text-xl italic leading-snug text-bone-100 md:text-3xl">
                    &ldquo;The Rub&apos; al Khali does not forgive a late{' '}
                    <span className="text-ember-400">arrival</span>.
                    Neither do we.&rdquo;
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-superwide text-bone-300">
                    — Meridian operations log, 2022
                  </p>
                </div>
              </div>
            </div>
            <PanelLabel depth={PANELS[3].depth} caption={PANELS[3].caption} top />
            <PanelCorners />
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <div className="container-fluid relative z-20 mt-20 md:mt-28">
        <div
          data-dw-line
          className="mb-10 h-px w-full origin-left bg-[var(--line)] md:mb-14"
        />
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p data-dw-meta className="eyebrow mb-3">Ready to move?</p>
            <p
              data-dw-meta
              className="max-w-[36ch] font-display text-4xl italic leading-[0.95] md:text-5xl"
            >
              Your coordinates.{' '}
              <span className="text-ember-400">Our aircraft.</span>
            </p>
          </div>
          <a
            data-dw-meta
            href="#contact"
            className="group glass inline-flex items-center gap-4 rounded-full border-white/15 bg-white/[0.05] px-7 py-4 text-bone-100 transition-[background,border-color] duration-400 hover:border-ember-400 hover:bg-ember-500/12"
          >
            <span className="font-mono text-[11px] uppercase tracking-superwide">
              Open a brief
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ember-500 text-ink-950 transition-[background,transform] duration-400 ease-soft group-hover:scale-110 group-hover:bg-ember-400">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                <path d="M3 8h8M8 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function PanelLabel({
  depth,
  caption,
  top = false,
}: {
  depth: string;
  caption: string;
  top?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-10 flex items-center gap-3 ${top
          ? 'left-4 top-4 md:left-5 md:top-5'
          : 'bottom-4 left-4 md:bottom-5 md:left-5'
        }`}
    >
      <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-200/90">
        {depth}
      </span>
      <span className="h-px w-6 bg-bone-200/40" />
      <span className="font-display text-sm italic text-bone-100 md:text-base">
        {caption}
      </span>
    </div>
  );
}

function PanelCorners() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4"
      >
        <span className="absolute left-0 top-0 h-px w-full bg-bone-100/50" />
        <span className="absolute left-0 top-0 h-full w-px bg-bone-100/50" />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 z-10 h-4 w-4"
      >
        <span className="absolute right-0 top-0 h-px w-full bg-bone-100/50" />
        <span className="absolute right-0 top-0 h-full w-px bg-bone-100/50" />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-3 z-10 h-4 w-4"
      >
        <span className="absolute bottom-0 left-0 h-px w-full bg-bone-100/50" />
        <span className="absolute bottom-0 left-0 h-full w-px bg-bone-100/50" />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 right-3 z-10 h-4 w-4"
      >
        <span className="absolute bottom-0 right-0 h-px w-full bg-bone-100/50" />
        <span className="absolute bottom-0 right-0 h-full w-px bg-bone-100/50" />
      </span>
    </>
  );
}

function WindIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-ember-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M3 8h13a3 3 0 0 0 0-6 3 3 0 0 0-3 3" />
      <path d="M3 12h16a3 3 0 0 1 0 6 3 3 0 0 1-3-3" />
      <path d="M3 16h7" />
    </svg>
  );
}