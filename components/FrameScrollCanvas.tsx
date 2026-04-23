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

interface FrameScrollCanvasProps {
  onProgress?: (progress: number) => void;
  onReady?: () => void;
  onError?: (err: Error) => void;
}

/**
 * FrameScrollCanvas
 * -----------------
 * A pinned, scroll-driven image sequence.
 *
 *   - Outer <section> is tall (pin duration). It pins an inner 100svh stage.
 *   - GSAP ScrollTrigger scrubs a frame index 0 → TOTAL_FRAMES-1 across the pin.
 *   - On each update we paint the preloaded HTMLImageElement into <canvas>.
 *
 * Responsiveness
 * --------------
 *   - Loads the 900w `mobile` frame set under 768px; 1600w `desktop` over.
 *   - Scroll distance is ~3.0x viewport on desktop, ~2.2x on mobile — the
 *     mobile value keeps the sequence from feeling interminable on a phone.
 *   - Full recompute on breakpoint change (URLs change → preloader restarts
 *     → status goes 'loading' → useGsap cleans up and re-runs).
 */
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
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        onError?.(new Error('Canvas 2D context unavailable.'));
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const resizeCanvas = () => {
        const { clientWidth, clientHeight } = stage;
        canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
        canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
        canvas.style.width = `${clientWidth}px`;
        canvas.style.height = `${clientHeight}px`;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        stateRef.current.lastDrawn = -1;
        drawFrame(stateRef.current.frame);
      };

      const drawFrame = (index: number) => {
        const i = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
        if (i === stateRef.current.lastDrawn) return;

        const img = images[i];
        if (!img || !img.naturalWidth) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        const scale = Math.max(cw / iw, ch / ih);
        const drawW = iw * scale;
        const drawH = ih * scale;
        const dx = (cw - drawW) * 0.5;
        const dy = (ch - drawH) * 0.5;

        ctx.fillStyle = '#0A0807';
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, drawW, drawH);

        stateRef.current.lastDrawn = i;
      };

      resizeCanvas();
      drawFrame(0);

      const ro = new ResizeObserver(() => resizeCanvas());
      ro.observe(stage);

      // Entrance — the canvas subtly scales up from 0.96 as it fades in.
      // Runs once when everything's ready; doesn't conflict with the CSS opacity transition.
      const enter = gsap.fromTo(
        canvas,
        { scale: 0.96 },
        { scale: 1, duration: 1.4, ease: 'expo.out' },
      );

      // Pin + scrub. Mobile gets a shorter scroll distance so the sequence
      // doesn't feel like an endless scroll on a phone.
      const scrollMultiplier = window.matchMedia('(min-width: 768px)').matches ? 3.0 : 2.2;

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * scrollMultiplier)}`,
        pin: stageRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.45,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const nextFrame = self.progress * (TOTAL_FRAMES - 1);
          stateRef.current.frame = nextFrame;
          drawFrame(nextFrame);
        },
      });

      // Chapter reveals — one timeline per chapter, scrubbed to a segment of
      // the pinned range. Using a single scrub timeline ties the copy's
      // opacity directly to scroll position (no popping).
      const chapters = gsap.utils.toArray<HTMLElement>('[data-fs-chapter]');
      const chapterTriggers: ScrollTrigger[] = [];

      chapters.forEach((el) => {
        const start = parseFloat(el.dataset.fsStart ?? '0');
        const end = parseFloat(el.dataset.fsEnd ?? '1');
        const peak = parseFloat(el.dataset.fsPeak ?? String((start + end) / 2));

        gsap.set(el, { opacity: 0, y: 24 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${start * scrollMultiplier * 100}% top`,
            end: `top+=${end * scrollMultiplier * 100}% top`,
            scrub: true,
          },
        });

        const inDur = Math.max(0.15, (peak - start) / Math.max(0.001, end - start));
        tl.to(el, { opacity: 1, y: 0, ease: 'power2.out', duration: inDur })
          .to(el, { opacity: 0, y: -18, ease: 'power2.in', duration: 1 - inDur });

        chapterTriggers.push(tl.scrollTrigger as ScrollTrigger);
      });

      // Chapter indicator + progress orb — updates via scroll, no frame numbers.
      const chapterLabel = document.querySelector<HTMLElement>('[data-fs-chapter-label]');
      const progressFill = document.querySelector<HTMLElement>('[data-fs-arc-fill]');
      const progressDot = document.querySelector<HTMLElement>('[data-fs-arc-dot]');

      const romanFor = (p: number) => (p < 0.33 ? 'I' : p < 0.66 ? 'II' : 'III');
      let lastRoman = '';

      const meterTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * scrollMultiplier)}`,
        scrub: true,
        onUpdate: (self) => {
          const pct = self.progress;
          if (progressFill) progressFill.style.width = `${Math.round(pct * 100)}%`;
          if (progressDot) progressDot.style.left = `${Math.max(0, Math.min(100, pct * 100))}%`;

          if (chapterLabel) {
            const roman = romanFor(pct);
            if (roman !== lastRoman) {
              lastRoman = roman;
              // Quick fade-swap so it doesn't jump
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

      return () => {
        ro.disconnect();
        enter.kill();
        trigger.kill();
        meterTrigger.kill();
        chapterTriggers.forEach((t) => t.kill());
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
        {/* Placeholder while frames load — a quiet ember pulse so the top of
            page isn't pitch-black if preloading takes a moment on slow networks */}
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

        <canvas
          ref={canvasRef}
          className={cn(
            'frame-canvas transition-opacity duration-[1200ms] ease-soft',
            status === 'ready' && loaderDone ? 'opacity-100' : 'opacity-0',
          )}
        />

        {/* Vignette — readability for overlay copy */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,8,7,0.55) 0%, rgba(10,8,7,0) 25%, rgba(10,8,7,0) 60%, rgba(10,8,7,0.90) 100%)',
          }}
        />

        {/* Chapter I */}
        <div
          data-fs-chapter
          data-fs-start="0"
          data-fs-end="0.2"
          data-fs-peak="0.08"
          className="container-fluid pointer-events-none absolute inset-x-0 top-[12svh] z-20 flex items-start justify-between gap-6 sm:top-[14svh]"
        >
          <div className="max-w-[18ch]">
            <p className="eyebrow mb-3 text-bone-200">Chapter I</p>
            <h2 className="font-display text-4xl italic leading-[0.95] sm:text-5xl md:text-7xl">
              The <span className="text-ember-400">approach.</span>
            </h2>
          </div>
          <p className="hidden max-w-[22ch] text-right font-mono text-[11px] uppercase tracking-superwide text-bone-200 md:block">
            Scroll — let the sequence unfold at your pace.
          </p>
        </div>

        {/* Chapter II */}
        <div
          data-fs-chapter
          data-fs-start="0.28"
          data-fs-end="0.58"
          data-fs-peak="0.43"
          className="container-fluid pointer-events-none absolute inset-x-0 top-[30svh] z-20 text-center sm:top-[36svh]"
        >
          <p className="eyebrow mb-3">Chapter II</p>
          <h3 className="mx-auto max-w-[14ch] font-display text-5xl italic leading-[0.95] text-balance sm:text-6xl md:text-8xl">
            Between walls, a <span className="text-ember-400">horizon</span>.
          </h3>
        </div>

        {/* Chapter III */}
        <div
          data-fs-chapter
          data-fs-start="0.68"
          data-fs-end="0.98"
          data-fs-peak="0.85"
          className="container-fluid pointer-events-none absolute inset-x-0 bottom-[14svh] z-20 flex flex-col items-start justify-between gap-6 sm:bottom-[18svh] md:flex-row md:items-end"
        >
          <div className="max-w-[18ch]">
            <p className="eyebrow mb-3">Chapter III</p>
            <h3 className="font-display text-4xl italic leading-[0.95] sm:text-5xl md:text-6xl">
              Step through. <br />
              <span className="text-ember-400">Keep walking.</span>
            </h3>
          </div>
          <div className="hidden max-w-[30ch] text-right md:block">
            <p className="text-sm leading-relaxed text-bone-200/80">
              Meridian does not offer destinations. It offers the moment
              immediately after you arrive — when the air is warm, the rest
              of the world is half a sky away, and you have nowhere you need
              to be.
            </p>
          </div>
        </div>

        {/* Bottom chrome — chapter indicator + a thin progress arc with a traveling orb.
            Replaces the old "Frame 001 / 151" meter. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-5 md:px-12 md:pb-8"
        >
          <div className="flex items-center gap-4 md:gap-8">
            {/* Chapter marker */}
            <div className="flex items-baseline gap-2 md:gap-3">
              <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-200/70">
                Chapter
              </span>
              <span
                data-fs-chapter-label
                className="font-display text-xl italic leading-none text-bone-100 md:text-2xl"
              >
                I
              </span>
            </div>

            {/* Progress arc */}
            <div className="relative h-px flex-1 overflow-visible">
              {/* Base rail */}
              <span className="absolute inset-0 rounded-full bg-white/12" />
              {/* Filled portion */}
              <span
                data-fs-arc-fill
                className="absolute left-0 top-0 block h-full rounded-full bg-ember-400/90"
                style={{ width: '0%', transition: 'width 120ms linear' }}
              />
              {/* Traveling orb */}
              <span
                data-fs-arc-dot
                className="pointer-events-none absolute top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-400 shadow-[0_0_14px_2px_rgba(226,137,58,0.55)]"
                style={{ left: '0%', transition: 'left 120ms linear' }}
              />
            </div>

            {/* Brand tail */}
            <span className="hidden font-mono text-[10px] uppercase tracking-superwide text-bone-200/70 md:inline">
              Meridian — Expedition 07
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}