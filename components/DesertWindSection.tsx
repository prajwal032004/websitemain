'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';

/*
  ROOT CAUSE FIX:
  Next.js <Image fill> requires the PARENT to have:
    position: relative  (or absolute)
    display: block
    width defined
    height defined  ← this is what was missing / broken

  The padding-top trick ONLY works if the parent has no explicit height set
  and overflow:hidden. With Next Image fill, we must give an explicit height
  OR use a wrapper with a known height via Tailwind h-* or inline style.

  Solution: use explicit pixel/vw heights per panel, with object-fit:cover
  and precise object-position per image. No padding-top trick needed.

  Panel heights (desktop → mobile):
  ─ Row 1: Both panels share the SAME height → matched row.
    Desktop: 520px tall. Mobile: 60vw tall.
  ─ Row 2 (Pianist, full-width):
    Desktop: 560px. Mobile: 58vw.

  Per-image object-position:
  ─ Golden Hour:   center 25%  → keeps hat + face + sun rays, crops ground
  ─ Petal Rain:    center 40%  → keeps chandelier + figure + falling petals
  ─ Pianist:       center 35%  → keeps blossoms overhead + pianist + hands
*/

const PANELS = [
  {
    src: '/showcase/field-golden.jpg',
    alt: 'Woman in straw hat in a wildflower meadow, golden sun rays through forest',
    caption: 'Golden hour',
    depth: '01',
    objectPosition: 'center 25%',
    parallaxY: -80,
    parallaxScale: 1.14,
    sizes: '(min-width: 768px) 58vw, 100vw',
  },
  {
    src: '/showcase/blossom-rain.jpg',
    alt: 'Figure in sheer gown under cascading cherry blossom chandelier in spotlight',
    caption: 'Petal rain',
    depth: '02',
    objectPosition: 'center 40%',
    parallaxY: -100,
    parallaxScale: 1.1,
    sizes: '(min-width: 768px) 42vw, 100vw',
  },
  {
    src: '/showcase/pianist-blossom.jpg',
    alt: 'Pianist at grand piano under cherry blossom canopy, atmospheric spotlight',
    caption: 'Nocturne',
    depth: '03',
    objectPosition: 'center 35%',
    parallaxY: -60,
    parallaxScale: 1.12,
    sizes: '100vw',
  },
] as const;

/* ─── Petal particle canvas ─── */
type Particle = {
  x: number; y: number; len: number; speed: number;
  opacity: number; angle: number; life: number; maxLife: number;
};

function spawnParticle(W: number, H: number): Particle {
  const maxLife = 90 + Math.random() * 120;
  return {
    x: Math.random() * W * 1.2 - W * 0.1, y: Math.random() * H,
    len: 18 + Math.random() * 70, speed: 1.2 + Math.random() * 2.8,
    opacity: 0, angle: -8 + Math.random() * 16, life: 0, maxLife,
  };
}

function usePetalCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W = 0, H = 0, raf = 0;
    const PARTICLE_COUNT = 60;
    const particles: Particle[] = [];
    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    const init = () => {
      resize();
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = spawnParticle(W, H);
        p.life = Math.random() * p.maxLife;
        p.x = Math.random() * W; p.y = Math.random() * H;
        particles.push(p);
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.life++;
        const t = p.life / p.maxLife;
        const fade = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1;
        p.opacity = fade * (0.15 + Math.random() * 0.08);
        const vx = p.speed * (1 + Math.sin(p.life * 0.08) * 0.2);
        p.x += vx; p.y += Math.sin((p.angle * Math.PI) / 180) * vx * 0.4;
        if (p.life >= p.maxLife || p.x > W + 60) { Object.assign(p, spawnParticle(W, H)); p.x = -p.len; }
        const rad = (p.angle * Math.PI) / 180;
        const ex = p.x + Math.cos(rad) * p.len, ey = p.y + Math.sin(rad) * p.len;
        const grad = ctx.createLinearGradient(p.x, p.y, ex, ey);
        if (p.life % 3 === 0) {
          grad.addColorStop(0, `rgba(232,165,168,0)`);
          grad.addColorStop(0.3, `rgba(232,165,168,${p.opacity * 0.7})`);
          grad.addColorStop(0.7, `rgba(212,134,138,${p.opacity * 0.6})`);
          grad.addColorStop(1, `rgba(180,100,110,0)`);
        } else {
          grad.addColorStop(0, `rgba(245,232,138,0)`);
          grad.addColorStop(0.3, `rgba(240,224,106,${p.opacity})`);
          grad.addColorStop(0.7, `rgba(230,207,68,${p.opacity * 0.9})`);
          grad.addColorStop(1, `rgba(184,164,30,0)`);
        }
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(ex, ey);
        ctx.strokeStyle = grad; ctx.lineWidth = 0.7 + Math.random() * 0.6;
        ctx.lineCap = 'round'; ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas); init(); draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef]);
}

/* ─── Main component ─── */
export default function DesertWindSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  usePetalCanvas(canvasRef);

  useGsap(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray<HTMLElement>('[data-dw-word]').forEach((el, i) => {
      gsap.fromTo(el, { yPercent: 110, opacity: 0 },
        {
          yPercent: 0, opacity: 1, duration: 1.1, delay: i * 0.04, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
    });
    gsap.fromTo('[data-dw-meta]', { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '[data-dw-copy]', start: 'top 80%', once: true }
      });
    gsap.fromTo(canvasRef.current, { opacity: 0 },
      {
        opacity: 1, duration: 1.8, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true }
      });
    gsap.utils.toArray<HTMLElement>('[data-dw-panel]').forEach((panel) => {
      const img = panel.querySelector<HTMLElement>('[data-dw-img]');
      const py = parseFloat(panel.dataset.parallaxY ?? '-80');
      const ps = parseFloat(panel.dataset.parallaxScale ?? '1.1');
      if (img) {
        gsap.set(img, { scale: ps });
        gsap.to(img, {
          yPercent: (py / window.innerHeight) * 100, ease: 'none',
          scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        });
      }
      gsap.fromTo(panel, { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: panel, start: 'top 85%', once: true }
        });
    });
    gsap.utils.toArray<HTMLElement>('[data-dw-line]').forEach((line) => {
      gsap.fromTo(line, { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: line, start: 'top 85%', once: true }
        });
    });
    gsap.to('[data-dw-stat-bob]', { y: -10, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }, [], sectionRef);

  return (
    <section
      ref={sectionRef}
      id="desert-wind"
      className="relative overflow-hidden bg-ink-950 py-28 text-bone-100 md:py-40"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(70% 50% at 50% 75%, rgba(232,165,168,0.08) 0%, transparent 60%), radial-gradient(60% 45% at 25% 20%, rgba(240,224,106,0.10) 0%, transparent 55%), radial-gradient(50% 40% at 80% 40%, rgba(212,134,138,0.06) 0%, transparent 55%)',
      }} />
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-0" />

      {/* ── Header ── */}
      <div className="container-fluid relative z-20">
        <div data-dw-line className="mb-8 h-px w-full origin-left bg-[var(--line)] md:mb-12" />
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-20">
          <div className="flex-1">
            <p data-dw-meta className="eyebrow mb-5">§ Visual Narrative — Featured Works</p>
            <h2 className="font-display text-[11vw] leading-[0.88] tracking-ultratight md:text-[6.5vw]">
              {'Light'.split('').map((ch, i) => (
                <span key={`a${i}`} className="inline-block overflow-hidden">
                  <span data-dw-word className="inline-block">{ch === ' ' ? '\u00A0' : ch}</span>
                </span>
              ))}
              <br />
              <span className="italic text-ember-400">
                {'blooms'.split('').map((ch, i) => (
                  <span key={`b${i}`} className="inline-block overflow-hidden">
                    <span data-dw-word className="inline-block">{ch}</span>
                  </span>
                ))}
              </span>
              <br />
              {'in silence.'.split('').map((ch, i) => (
                <span key={`c${i}`} className="inline-block overflow-hidden">
                  <span data-dw-word className="inline-block text-bone-300">{ch === ' ' ? '\u00A0' : ch}</span>
                </span>
              ))}
            </h2>
          </div>
          <div data-dw-copy className="flex-shrink-0 md:max-w-[38ch]">
            <p data-dw-meta className="text-base leading-relaxed text-bone-200/80 md:text-lg">
              Every frame holds a world that exists for a single breath. We capture the moments between
              moments — the light that arrives just once, the stillness before the petals fall, the note
              that hangs in the air long after the hands have left the keys.
            </p>
            <div data-dw-line className="my-6 h-px w-full origin-left bg-[var(--line)] md:my-8" />
            <div data-dw-stat-bob className="glass inline-flex items-stretch divide-x divide-[var(--line)] rounded-2xl border-white/15 bg-white/[0.04]">
              {[{ value: '03', label: 'Featured' }, { value: '∞', label: 'Perspectives' }, { value: '1/125', label: 'Shutter' }].map((s) => (
                <div key={s.label} className="flex flex-col gap-1 px-5 py-4">
                  <span className="font-display text-2xl italic text-bone-100">{s.value}</span>
                  <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-400">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Image grid ── */}
      <div className="container-fluid relative z-20 mt-20 md:mt-28">

        {/*
          ROW 1 — Two panels side by side.
          CRITICAL: Both panels use h-[60vw] on mobile, h-[520px] on desktop.
          This gives them an IDENTICAL, EXPLICIT height so the row is even
          and both images fill 100% of their box with zero gaps.
          Grid: on desktop, 7:5 column split. On mobile, stacked full-width.
        */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">

          {/* Panel 1 — Golden Hour */}
          <div
            data-dw-panel
            data-parallax-y={PANELS[0].parallaxY}
            data-parallax-scale={PANELS[0].parallaxScale}
            className="relative overflow-hidden rounded-2xl ring-1 ring-white/[0.08] md:col-span-7 md:rounded-3xl
                       h-[60vw] md:h-[520px]"
          >
            <Image
              data-dw-img
              src={PANELS[0].src}
              alt={PANELS[0].alt}
              fill
              quality={100}
              sizes={PANELS[0].sizes}
              className="object-cover"
              style={{ objectPosition: PANELS[0].objectPosition }}
              priority
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-ink-950/15" />
            <PanelLabel depth={PANELS[0].depth} caption={PANELS[0].caption} />
            <PanelCorners />
          </div>

          {/* Panel 2 — Petal Rain */}
          <div
            data-dw-panel
            data-parallax-y={PANELS[1].parallaxY}
            data-parallax-scale={PANELS[1].parallaxScale}
            className="relative overflow-hidden rounded-2xl ring-1 ring-white/[0.08] md:col-span-5 md:rounded-3xl
                       h-[60vw] md:h-[520px]"
          >
            <Image
              data-dw-img
              src={PANELS[1].src}
              alt={PANELS[1].alt}
              fill
              quality={100}
              sizes={PANELS[1].sizes}
              className="object-cover"
              style={{ objectPosition: PANELS[1].objectPosition }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-ink-950/10" />
            <PanelLabel depth={PANELS[1].depth} caption={PANELS[1].caption} />
            <PanelCorners />
          </div>
        </div>

        {/* Mid divider */}
        <div className="relative my-10 flex items-center gap-4 md:my-14 md:gap-6">
          <div data-dw-line className="h-px flex-1 origin-left bg-[var(--line)]" />
          <div className="glass flex items-center gap-3 rounded-full border-white/15 bg-white/[0.04] px-4 py-2 md:px-5 md:py-2.5">
            <PetalIcon />
            <span className="font-mono text-[9px] uppercase tracking-superwide text-bone-200 md:text-[10px]">
              Visual narrative — curated collection
            </span>
          </div>
          <div data-dw-line className="h-px flex-1 origin-left bg-[var(--line)]" />
        </div>

        {/*
          ROW 2 — Full-width Pianist.
          Explicit heights: h-[58vw] mobile (preserves cinematic feel),
          h-[560px] desktop. Image fills 100%, no gaps possible.
          objectPosition: center 35% keeps blossoms + pianist + hands all visible.
        */}
        <div
          data-dw-panel
          data-parallax-y={PANELS[2].parallaxY}
          data-parallax-scale={PANELS[2].parallaxScale}
          className="relative overflow-hidden rounded-2xl ring-1 ring-white/[0.08] md:rounded-3xl
                     h-[58vw] md:h-[560px]"
        >
          <Image
            data-dw-img
            src={PANELS[2].src}
            alt={PANELS[2].alt}
            fill
            quality={100}
            sizes={PANELS[2].sizes}
            className="object-cover"
            style={{ objectPosition: PANELS[2].objectPosition }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-ink-950/20" />

          {/* Editorial quote — fluid sizing for all screens */}
          <div className="absolute inset-x-3 bottom-3 z-10 sm:inset-x-4 sm:bottom-4 md:inset-x-6 md:bottom-6">
            <div className="glass rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 backdrop-blur-sm sm:rounded-2xl sm:px-5 sm:py-4 md:rounded-3xl md:px-7 md:py-6">
              <p
                className="font-display italic leading-[1.3] text-bone-100"
                style={{ fontSize: 'clamp(11px, 2.8vw, 28px)' }}
              >
                &ldquo;The music does not end when the hands leave the keys.
                It ends when the last petal{' '}
                <span className="text-ember-400">settles</span>.&rdquo;
              </p>
              <p
                className="mt-1 font-mono uppercase tracking-superwide text-bone-300 sm:mt-2 md:mt-3"
                style={{ fontSize: 'clamp(7px, 1.4vw, 10px)' }}
              >
                — From the archive
              </p>
            </div>
          </div>

          <PanelLabel depth={PANELS[2].depth} caption={PANELS[2].caption} top />
          <PanelCorners />
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="container-fluid relative z-20 mt-20 md:mt-28">
        <div data-dw-line className="mb-10 h-px w-full origin-left bg-[var(--line)] md:mb-14" />
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p data-dw-meta className="eyebrow mb-3">Ready to create?</p>
            <p data-dw-meta className="max-w-[36ch] font-display text-4xl italic leading-[0.95] md:text-5xl">
              Your vision.{' '}<span className="text-ember-400">Our lens.</span>
            </p>
          </div>
          <a
            data-dw-meta
            href="#contact"
            className="group glass inline-flex items-center gap-4 rounded-full border-white/15 bg-white/[0.05] px-7 py-4 text-bone-100 transition-[background,border-color] duration-400 hover:border-ember-400 hover:bg-ember-500/12"
          >
            <span className="font-mono text-[11px] uppercase tracking-superwide">Open a brief</span>
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

/* ── Sub-components ── */
function PanelLabel({ depth, caption, top = false }: { depth: string; caption: string; top?: boolean }) {
  return (
    <div className={`pointer-events-none absolute z-10 flex items-center gap-3 ${top ? 'left-4 top-4 md:left-5 md:top-5' : 'bottom-4 left-4 md:bottom-5 md:left-5'}`}>
      <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-200/90">{depth}</span>
      <span className="h-px w-6 bg-bone-200/40" />
      <span className="font-display text-sm italic text-bone-100 md:text-base">{caption}</span>
    </div>
  );
}

function PanelCorners() {
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4">
        <span className="absolute left-0 top-0 h-px w-full bg-bone-100/50" />
        <span className="absolute left-0 top-0 h-full w-px bg-bone-100/50" />
      </span>
      <span aria-hidden className="pointer-events-none absolute right-3 top-3 z-10 h-4 w-4">
        <span className="absolute right-0 top-0 h-px w-full bg-bone-100/50" />
        <span className="absolute right-0 top-0 h-full w-px bg-bone-100/50" />
      </span>
      <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 z-10 h-4 w-4">
        <span className="absolute bottom-0 left-0 h-px w-full bg-bone-100/50" />
        <span className="absolute bottom-0 left-0 h-full w-px bg-bone-100/50" />
      </span>
      <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 z-10 h-4 w-4">
        <span className="absolute bottom-0 right-0 h-px w-full bg-bone-100/50" />
        <span className="absolute bottom-0 right-0 h-full w-px bg-bone-100/50" />
      </span>
    </>
  );
}

function PetalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blush-400" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M12 3c-3 4-7 7-7 11a7 7 0 0 0 14 0c0-4-4-7-7-11z" />
      <path d="M12 8v8" />
    </svg>
  );
}