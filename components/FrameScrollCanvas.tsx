'use client';

import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFramePreloader } from '@/hooks/useFramePreloader';
import { useGsap } from '@/hooks/useGsap';
import { useLoaderComplete } from '@/hooks/useLoaderComplete';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { allFramePaths, TOTAL_FRAMES } from '@/utils/frames';
import { cn } from '@/utils/cn';

/**
 * VIDEO BREAKDOWN (241 source frames → 151 exported frames):
 *
 * Frames 0–40   (0–26%):   A lone figure stands deep inside collapsed concrete ruins.
 *                            Rubble fills the foreground. Through a narrow gap in the walls
 *                            the warm amber desert glows — unreachable, beckoning.
 *
 * Frames 40–100 (26–66%):  The camera drifts back and climbs. The ruins grow smaller.
 *                            The walls part like curtains. The figure shrinks to a silhouette
 *                            framed by crumbling stone against a burning horizon.
 *
 * Frames 100–151 (66–100%): The ruins drop below frame entirely. Only sky, sand, and
 *                             sun remain — a vast, silent, golden desert stretching to
 *                             the edge of the world. The figure is gone. You are alone.
 */

interface FrameScrollCanvasProps {
  onProgress?: (progress: number) => void;
  onReady?: () => void;
  onError?: (err: Error) => void;
}

export default function FrameScrollCanvas({
  onProgress,
  onReady,
  onError,
}: FrameScrollCanvasProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stateRef = useRef({ frame: 0, lastDrawn: -1 });

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const variant: 'desktop' | 'mobile' = isDesktop === false ? 'mobile' : 'desktop';
  const urls = useMemo(() => allFramePaths(variant), [variant]);

  const loaderDone = useLoaderComplete();

  const { status, progress, images, error } = useFramePreloader(urls, {
    concurrency: 10,
    failureTolerance: 0.1,
  });

  useEffect(() => {
    onProgress?.(progress);
  }, [progress, onProgress]);

  useEffect(() => {
    if (status === 'ready') onReady?.();
    if (status === 'error' && error) onError?.(error);
  }, [status, error, onReady, onError]);

  useGsap(
    () => {
      if (status !== 'ready') return;
      if (!canvasRef.current || !stageRef.current || !sectionRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const canvas = canvasRef.current;
      const stage = stageRef.current;

      // ─── High-quality 2D context ─────────────────────────────────────
      // alpha:false        → skip alpha compositing pass (perf)
      // desynchronized:false → colour-accurate, no screen-tearing artefacts
      const ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: false,
      });
      if (!ctx) {
        onError?.(new Error('Canvas 2D context unavailable.'));
        return;
      }

      // ─── Full device pixel ratio — NEVER cap this ────────────────────
      // Capping DPR (e.g. Math.min(dpr, 2)) is the #1 cause of blurry
      // canvas on Retina / 3× flagship screens. Use the real value.
      const dpr = window.devicePixelRatio || 1;

      // ─── resizeCanvas ────────────────────────────────────────────────
      // Sets the canvas backing store to physical pixels (logical × dpr),
      // then applies a permanent ctx transform so all subsequent draw calls
      // work in logical pixel coordinates — no manual dpr math in drawFrame.
      const resizeCanvas = () => {
        const { clientWidth: cw, clientHeight: ch } = stage;

        canvas.width  = Math.max(1, Math.floor(cw * dpr));
        canvas.height = Math.max(1, Math.floor(ch * dpr));
        canvas.style.width  = `${cw}px`;
        canvas.style.height = `${ch}px`;

        // Scale once; drawFrame always sees logical pixels.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Highest quality interpolation — browsers can silently reset this,
        // so we also re-apply it inside drawFrame before every paint.
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        stateRef.current.lastDrawn = -1;
        drawFrame(stateRef.current.frame);
      };

      // ─── drawFrame ──────────────────────────────────────────────────
      const drawFrame = (index: number) => {
        const i = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
        if (i === stateRef.current.lastDrawn) return;

        const img = images[i];
        if (!img || !img.naturalWidth) return;

        // Re-apply smoothing every frame — some browsers reset it per-frame.
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // ── Object-fit: cover in logical-pixel space ──────────────────
        // Because ctx is scaled by dpr via setTransform, all coordinates
        // below are in CSS/logical pixels — the GPU handles the DPR upscale.
        const { clientWidth: cw, clientHeight: ch } = stage;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        // Cover: enlarge the image until it fills the stage in both axes.
        const scale = Math.max(cw / iw, ch / ih);
        const drawW = iw * scale;
        const drawH = ih * scale;
        const dx    = (cw - drawW) * 0.5; // centre horizontally
        const dy    = (ch - drawH) * 0.5; // centre vertically

        // Fill background in physical-pixel space (before dpr transform).
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#0A0807';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore(); // restores the dpr-scaled transform

        // Draw image — covers the stage at full native sharpness.
        ctx.drawImage(img, dx, dy, drawW, drawH);

        stateRef.current.lastDrawn = i;
      };

      resizeCanvas();
      drawFrame(0);

      const ro = new ResizeObserver(() => resizeCanvas());
      ro.observe(stage);

      const enter = gsap.fromTo(
        canvas,
        { scale: 0.96 },
        { scale: 1, duration: 1.4, ease: 'expo.out' },
      );

      const isMobileNow = !window.matchMedia('(min-width: 768px)').matches;
      const scrollMultiplier = isMobileNow ? 4.0 : 4.5;

      const totalPx = () => Math.round(window.innerHeight * scrollMultiplier);

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${totalPx()}`,
        pin: stageRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const nextFrame = self.progress * (TOTAL_FRAMES - 1);
          stateRef.current.frame = nextFrame;
          drawFrame(nextFrame);
        },
      });

      const chapters = gsap.utils.toArray<HTMLElement>('[data-fs-chapter]');
      const chapterTriggers: ScrollTrigger[] = [];

      chapters.forEach((el) => {
        const start = parseFloat(el.dataset.fsStart ?? '0');
        const end   = parseFloat(el.dataset.fsEnd   ?? '1');
        const peak  = parseFloat(el.dataset.fsPeak  ?? String((start + end) / 2));

        gsap.set(el, { opacity: 0, y: 28, willChange: 'opacity, transform' });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => `top+=${Math.round(start * totalPx())} top`,
            end:   () => `top+=${Math.round(end   * totalPx())} top`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        const inDur = Math.max(0.2, (peak - start) / Math.max(0.001, end - start));
        tl.to(el, { opacity: 1, y: 0,   ease: 'power2.out', duration: inDur })
          .to(el, { opacity: 0, y: -22, ease: 'power2.in',  duration: 1 - inDur });

        chapterTriggers.push(tl.scrollTrigger as ScrollTrigger);
      });

      // ─── Chapter indicator + progress bar ───────────────────────────
      const chapterLabel = document.querySelector<HTMLElement>('[data-fs-chapter-label]');
      const progressFill = document.querySelector<HTMLElement>('[data-fs-arc-fill]');
      const progressDot  = document.querySelector<HTMLElement>('[data-fs-arc-dot]');

      const romanFor = (p: number) => (p < 0.33 ? 'I' : p < 0.66 ? 'II' : 'III');
      let lastRoman = '';

      const meterTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${totalPx()}`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const pct = self.progress;
          if (progressFill) progressFill.style.width = `${Math.round(pct * 100)}%`;
          if (progressDot)  progressDot.style.left   = `${Math.max(0, Math.min(100, pct * 100))}%`;

          if (chapterLabel) {
            const roman = romanFor(pct);
            if (roman !== lastRoman) {
              lastRoman = roman;
              gsap.fromTo(
                chapterLabel,
                { opacity: 0, y: 4 },
                { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', overwrite: true },
              );
              chapterLabel.textContent = roman;
            }
          }
        },
      });

      // ─── Bottom veil: fades in over the last ~15% of scroll ─────────
      // Starts at 85% progress (second-to-last frame zone) and reaches
      // full opacity at 100%, creating a seamless bleed into #0A0807.
      const veil = document.querySelector<HTMLElement>('[data-fs-bottom-veil]');
      const veilTrigger = veil
        ? ScrollTrigger.create({
            trigger: sectionRef.current,
            start: () => `top+=${Math.round(0.85 * totalPx())} top`,
            end:   () => `top+=${Math.round(1.00 * totalPx())} top`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Ease the opacity with a smooth curve so the fade feels
              // organic rather than mechanical.
              const eased = self.progress * self.progress * (3 - 2 * self.progress); // smoothstep
              veil.style.opacity = String(eased);
            },
          })
        : null;

      return () => {
        ro.disconnect();
        enter.kill();
        trigger.kill();
        meterTrigger.kill();
        chapterTriggers.forEach((t) => t.kill());
        veilTrigger?.kill();
      };
    },
    [status, images.length],
    sectionRef,
  );

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      aria-label="Scroll-driven sequence"
      className="relative bg-ink-950 text-bone-100"
    >
      <div ref={stageRef} className="relative h-[100svh] w-full overflow-hidden">

        {/* Loading placeholder — quiet ember pulse */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 transition-opacity duration-700 ease-soft',
            status === 'ready' ? 'opacity-0' : 'opacity-100',
          )}
          style={{
            background:
              'radial-gradient(60% 45% at 50% 55%, rgba(226,137,58,0.12) 0%, rgba(226,137,58,0.04) 45%, transparent 75%)',
          }}
        />

        {/*
          'high-quality' is a valid CSS value for image-rendering but is not
          yet in React's CSSProperties type union. We cast via a style object
          typed as React.CSSProperties & { imageRendering: string } to avoid
          the TS error while keeping the runtime value correct.
        */}
        <canvas
          ref={canvasRef}
          className={cn(
            'frame-canvas transition-opacity duration-[1200ms] ease-soft',
            status === 'ready' && loaderDone ? 'opacity-100' : 'opacity-0',
          )}
          style={
            {
              imageRendering: 'high-quality',
            } as React.CSSProperties & { imageRendering: string }
          }
        />

        {/* ─── Top + bottom atmospheric gradient overlay ──────────────── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: [
              'linear-gradient(180deg, rgba(10,8,7,0.72) 0%, rgba(10,8,7,0.10) 20%, rgba(10,8,7,0) 40%, rgba(10,8,7,0) 52%, rgba(10,8,7,0.95) 100%)',
            ].join(', '),
          }}
        />

        {/* ─── Bottom veil — fades in at ~85% scroll progress ─────────────
            Height is ~1 cm visually (clamp keeps it proportional across
            viewports). Gradient bleeds upward from solid #0A0807 to
            transparent so the canvas dissolves cleanly into the background.
            Opacity is driven by JS (ScrollTrigger) above; starts at 0.       */}
        <div
          data-fs-bottom-veil
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
          style={{
            height: 'clamp(120px, 22svh, 220px)',
            opacity: 0,
            background: 'linear-gradient(to top, #0A0807 0%, transparent 100%)',
          }}
        />

        {/* ─── Chapter I ─────────────────────────────────────────────── */}
        <div
          data-fs-chapter
          data-fs-start="0.00"
          data-fs-end="0.30"
          data-fs-peak="0.12"
          className="container-fluid pointer-events-none absolute inset-x-0 top-[20svh] z-30"
          style={{
            opacity: 0,
            textShadow: '0 2px 24px rgba(10,8,7,0.9), 0 1px 4px rgba(10,8,7,0.8)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-[22ch]">
              <p className="eyebrow mb-2 text-bone-200/80 text-[10px] md:text-[11px]">Chapter I</p>
              <h2 className="font-display text-[clamp(2.4rem,8vw,5.5rem)] italic leading-[0.92]">
                Inside the{' '}
                <span className="text-ember-400">ruin.</span>
              </h2>
              <p className="mt-3 max-w-[26ch] text-[13px] leading-relaxed text-bone-200/75 md:text-sm">
                Walls of broken concrete. Rebar like ribs.
                And through the gap — the desert, golden, impossible.
              </p>
            </div>
            <p className="hidden shrink-0 max-w-[18ch] text-right font-mono text-[10px] uppercase tracking-superwide text-bone-200/50 md:block mt-1">
              Scroll to move<br />through the sequence.
            </p>
          </div>
        </div>

        {/* ─── Chapter II ────────────────────────────────────────────── */}
        <div
          data-fs-chapter
          data-fs-start="0.345"
          data-fs-end="0.66"
          data-fs-peak="0.495"
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center"
          style={{
            opacity: 0,
            textShadow: '0 0 40px rgba(10,8,7,1), 0 0 20px rgba(10,8,7,0.95), 0 2px 8px rgba(10,8,7,0.9)',
          }}
        >
          <p className="eyebrow mb-3 text-bone-200/80 text-[10px] md:text-[11px]">Chapter II</p>
          <h3 className="font-display text-[clamp(2.8rem,10vw,7rem)] italic leading-[0.90] text-balance text-center px-4">
            Between walls,{' '}
            <br className="hidden sm:block" />
            <span className="text-ember-400">a horizon.</span>
          </h3>
          <p
            className="mt-5 max-w-[32ch] text-center text-[13px] leading-relaxed text-bone-200/85 md:text-sm px-4"
            style={{ textShadow: '0 0 30px rgba(10,8,7,1), 0 0 12px rgba(10,8,7,0.95)' }}
          >
            The ruins still frame you. The figure still stands.
            But the desert is no longer a glimpse — it is everything.
          </p>
        </div>

        {/* ─── Chapter III ───────────────────────────────────────────── */}
        <div
          data-fs-chapter
          data-fs-start="0.90"
          data-fs-end="1.00"
          data-fs-peak="0.84"
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            opacity: 0,
            textShadow: '0 2px 28px rgba(10,8,7,0.95), 0 1px 6px rgba(10,8,7,0.85)',
          }}
        >
          {/* ── Top: chapter label centred at top of sky ── */}
          <div className="absolute inset-x-0 top-[8svh] flex flex-col items-center">
            <p className="eyebrow text-bone-200/70 text-[10px] md:text-[11px]">Chapter III</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-superwide text-bone-200/50 hidden md:block">
              The walls are gone. The ruins are memory.
            </p>
          </div>

          {/* ── Centre: giant headline floated over the dunes ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h3 className="font-display text-[clamp(3rem,12vw,9rem)] italic leading-[0.88]">
              Only sand.
              <br />
              <span className="text-ember-400">Only sun.</span>
            </h3>
          </div>

          {/* ── Bottom left: existential line ── */}
          <div className="absolute bottom-[14svh] left-0 px-5 md:px-12 sm:bottom-[18svh]">
            <p className="max-w-[22ch] text-[13px] leading-relaxed text-bone-200/80 md:text-sm">
              What remains is the horizon —<br />
              limitless, indifferent,<br />
              and entirely, terribly yours.
            </p>
          </div>

          {/* ── Bottom right: coordinate tag ── */}
          <div className="absolute bottom-[14svh] right-0 hidden px-5 text-right md:block md:px-12 sm:bottom-[18svh]">
            <p className="font-mono text-[10px] uppercase tracking-superwide text-bone-200/55">
              23°N 13°E — Sahara<br />
              Meridian Expedition 07
            </p>
          </div>
        </div>

        {/* ─── Bottom chrome ─────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-40 px-5 md:px-12">
          <div className="flex items-center justify-between gap-4">

            {/* Left: Location indicator */}
            <div className="flex items-center gap-1.5 text-ember-400 font-mono text-[10px] tracking-wide">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 shrink-0 opacity-80"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
              </svg>
              <span className="whitespace-nowrap">Bengaluru, India</span>
            </div>

            {/* Right: Expedition tag — hidden on mobile */}
            <span className="hidden font-mono text-[10px] uppercase tracking-superwide text-bone-200/70 md:inline">
              Meridian — Expedition 07
            </span>

          </div>
        </div>

      </div>{/* /stageRef */}
    </section>
  );
}