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

export default function FrameScrollCanvas({
  onProgress,
  onReady,
  onError,
}: FrameScrollCanvasProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
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

  useEffect(() => { onProgress?.(progress); }, [progress, onProgress]);

  useEffect(() => {
    if (status === 'ready') onReady?.();
    if (status === 'error' && error) onError?.(error);
  }, [status, error, onReady, onError]);

  useGsap(
    () => {
      if (status !== 'ready') return;
      if (!canvasRef.current || !sectionRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const canvas = canvasRef.current;
      const section = sectionRef.current;

      const ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: false,
        // Ask the browser for the widest colour gamut available
        colorSpace: 'display-p3',
      } as CanvasRenderingContext2DSettings);
      if (!ctx) { onError?.(new Error('Canvas 2D context unavailable.')); return; }

      // Use true device pixel ratio — no cap — for maximum sharpness.
      // On a 3× Retina screen this means 3× the pixels.
      const dpr = window.devicePixelRatio || 1;

      // ── resizeCanvas ──────────────────────────────────────────────────────
      const resizeCanvas = () => {
        const cw = window.innerWidth;
        const ch = window.innerHeight;

        canvas.width = Math.max(1, Math.floor(cw * dpr));
        canvas.height = Math.max(1, Math.floor(ch * dpr));
        canvas.style.width = `${cw}px`;
        canvas.style.height = `${ch}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        stateRef.current.lastDrawn = -1;
        drawFrame(stateRef.current.frame);
      };

      // ── drawFrame ─────────────────────────────────────────────────────────
      // Cover-fill: image always fills the viewport with no letterboxing.
      // No transforms, no compositing layers — draw directly to the backing
      // store at full DPR resolution for maximum clarity.
      const drawFrame = (index: number) => {
        const i = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
        if (i === stateRef.current.lastDrawn) return;

        const img = images[i];
        if (!img || !img.naturalWidth) return;

        const cw = window.innerWidth;
        const ch = window.innerHeight;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        // Object-fit: cover
        const scale = Math.max(cw / iw, ch / ih);
        const drawW = iw * scale;
        const drawH = ih * scale;
        const dx = (cw - drawW) * 0.5;
        const dy = (ch - drawH) * 0.5;

        // Clear to base colour first (no save/restore overhead)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#0A0807';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Restore DPR transform and draw
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, dx, dy, drawW, drawH);

        stateRef.current.lastDrawn = i;
      };

      // Ensure veil resets inline style on resize to mobile
      const handleVeilResize = () => {
        const veilEl = document.querySelector<HTMLElement>('[data-fs-bottom-veil]');
        if (veilEl) {
          const isMob = !window.matchMedia('(min-width: 768px)').matches;
          if (isMob) veilEl.style.opacity = '';
        }
      };

      const handleResize = () => {
        resizeCanvas();
        handleVeilResize();
      };

      resizeCanvas();
      drawFrame(0);

      window.addEventListener('resize', handleResize);

      const enter = gsap.fromTo(
        canvas,
        { scale: 0.96 },
        { scale: 1, duration: 1.4, ease: 'expo.out' },
      );

      const isMobileNow = !window.matchMedia('(min-width: 768px)').matches;
      const scrollMultiplier = isMobileNow ? 4.0 : 4.5;
      const totalPx = () => Math.round(window.innerHeight * scrollMultiplier);

      // ── MAIN PIN TRIGGER ──────────────────────────────────────────────────
      const trigger = ScrollTrigger.create({
        trigger: section,
        pin: true,
        pinSpacing: true,
        start: 'top top',
        end: () => `+=${totalPx()}`,
        scroller: document.body,
        anticipatePin: 1,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const nextFrame = self.progress * (TOTAL_FRAMES - 1);
          stateRef.current.frame = nextFrame;
          drawFrame(nextFrame);
        },
      });

      // ── Progress meter ────────────────────────────────────────────────────
      const progressFill = document.querySelector<HTMLElement>('[data-fs-arc-fill]');
      const progressDot = document.querySelector<HTMLElement>('[data-fs-arc-dot]');

      const meterTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${totalPx()}`,
        scroller: document.body,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const pct = self.progress;
          if (progressFill) progressFill.style.width = `${Math.round(pct * 100)}%`;
          if (progressDot) progressDot.style.left = `${Math.max(0, Math.min(100, pct * 100))}%`;
        },
      });

      // ── Bottom veil ────────────────────────────────────────────────────────
      const veil = document.querySelector<HTMLElement>('[data-fs-bottom-veil]');
      const veilTrigger = veil
        ? ScrollTrigger.create({
          trigger: section,
          start: () => `top+=${Math.round(0.85 * totalPx())} top`,
          end: () => `top+=${Math.round(1.00 * totalPx())} top`,
          scroller: document.body,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const isMob = !window.matchMedia('(min-width: 768px)').matches;
            if (isMob) {
              veil.style.opacity = '';
            } else {
              const eased = self.progress * self.progress * (3 - 2 * self.progress);
              veil.style.opacity = String(eased);
            }
          },
        })
        : null;

      return () => {
        window.removeEventListener('resize', handleResize);
        enter.kill();
        trigger.kill();
        meterTrigger.kill();
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
      className="relative h-[100svh] w-full overflow-hidden bg-ink-950 text-bone-100"
    >
      {/* Loading placeholder */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-700 ease-soft',
          status === 'ready' ? 'opacity-0' : 'opacity-100',
        )}
        style={{
          background:
            'radial-gradient(60% 45% at 50% 55%, rgba(230,207,68,0.12) 0%, rgba(230,207,68,0.04) 45%, transparent 75%)',
        }}
      />

      {/* Canvas — rendered at full DPR for maximum sharpness */}
      <canvas
        ref={canvasRef}
        className={cn(
          'absolute inset-0 transition-opacity duration-[1200ms] ease-soft',
          status === 'ready' && loaderDone ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          imageRendering: 'high-quality',
        } as unknown as React.CSSProperties}
      />

      {/* Bottom veil — fades in at end of sequence (always visible on mobile) */}
      <div
        data-fs-bottom-veil
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 opacity-100 md:opacity-0"
        style={{
          height: 'clamp(120px, 22svh, 220px)',
          background: 'linear-gradient(to top, #0A0807 0%, transparent 100%)',
        }}
      />

      {/* Bottom chrome — location tag */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-40 px-5 md:px-12">
        <div className="flex items-center justify-between gap-4">
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
          <span className="hidden font-mono text-[10px] uppercase tracking-superwide text-bone-200/70 md:inline">
            Meridian — Expedition 07
          </span>
        </div>
      </div>
    </section>
  );
}