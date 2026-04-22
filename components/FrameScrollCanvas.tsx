'use client';

import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFramePreloader } from '@/hooks/useFramePreloader';
import { useGsap } from '@/hooks/useGsap';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { allFramePaths, TOTAL_FRAMES } from '@/utils/frames';
import { cn } from '@/utils/cn';

interface FrameScrollCanvasProps {
  /** Called with preload progress 0..1 — optional, mostly useful for instrumentation. */
  onProgress?: (progress: number) => void;
  /** Called once every frame is in memory (or a tolerable number have failed). */
  onReady?: () => void;
  /** Called if the preloader gives up entirely. */
  onError?: (err: Error) => void;
}

/**
 * FrameScrollCanvas
 * -----------------
 * The pinned, scroll-driven image sequence. Conceptually:
 *   - One outer <section> is tall (e.g. 400vh). It pins an inner 100vh stage.
 *   - GSAP ScrollTrigger scrubs a single `frame` index 0 → TOTAL_FRAMES-1 across
 *     the pin's duration.
 *   - On every frame change we draw the corresponding preloaded image into a
 *     <canvas>. This is much smoother than swapping <img> src attributes,
 *     since the browser can't flicker-reload or reflow.
 */
export default function FrameScrollCanvas({ onProgress, onReady, onError }: FrameScrollCanvasProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Refs used inside the GSAP tick — keeping them out of state avoids re-renders on scroll.
  const stateRef = useRef({ frame: 0, lastDrawn: -1 });

  // Pick the right image set for the current viewport.
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const variant: 'desktop' | 'mobile' = isDesktop === false ? 'mobile' : 'desktop';

  // Memoized so the preloader hook doesn't restart on every render.
  const urls = useMemo(() => allFramePaths(variant), [variant]);

  const { status, progress, images, error } = useFramePreloader(urls, {
    concurrency: 10,
    failureTolerance: 0.1,
  });

  // Report progress and lifecycle events to the parent.
  useEffect(() => {
    onProgress?.(progress);
  }, [progress, onProgress]);

  useEffect(() => {
    if (status === 'ready') onReady?.();
    if (status === 'error' && error) onError?.(error);
  }, [status, error, onReady, onError]);

  // Set up the canvas + ScrollTrigger once images are ready.
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

      // Size the canvas for device pixel ratio — crisp on retina.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const resizeCanvas = () => {
        const { clientWidth, clientHeight } = stage;
        canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
        canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
        canvas.style.width = `${clientWidth}px`;
        canvas.style.height = `${clientHeight}px`;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        // Force a redraw on resize
        stateRef.current.lastDrawn = -1;
        drawFrame(stateRef.current.frame);
      };

      // Cover-style draw — mimics `object-fit: cover` on a DOM image.
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

      // Keep the canvas resolution in sync with layout changes.
      const ro = new ResizeObserver(() => resizeCanvas());
      ro.observe(stage);

      // The scrub is the magic — ScrollTrigger interpolates the `frame` property
      // smoothly between 0 and TOTAL_FRAMES-1 as the user scrolls the pinned range.
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${Math.round(window.innerHeight * 3.4)}`, // 3.4x viewport of scroll distance
        pin: stageRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.4,
        onUpdate: (self) => {
          const nextFrame = self.progress * (TOTAL_FRAMES - 1);
          stateRef.current.frame = nextFrame;
          drawFrame(nextFrame);
        },
      });

      // Animate the overlay copy in relation to the same scroll.
      gsap.fromTo(
        '[data-fs-copy-enter]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      gsap.to('[data-fs-copy-exit]', {
        opacity: 0,
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=30%',
          scrub: true,
        },
      });

      // Stagger the three captions that appear across the sequence.
      gsap.utils.toArray<HTMLElement>('[data-fs-chapter]').forEach((el) => {
        const start = parseFloat(el.dataset.fsStart ?? '0');
        const end = parseFloat(el.dataset.fsEnd ?? '1');

        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${start * 100}% top`,
              end: `top+=${end * 100}% top`,
              toggleActions: 'play reverse play reverse',
            },
          },
        );
      });

      return () => {
        ro.disconnect();
        trigger.kill();
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
      <div
        ref={stageRef}
        className="relative h-[100svh] w-full overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className={cn(
            'frame-canvas transition-opacity duration-[1200ms] ease-soft',
            status === 'ready' ? 'opacity-100' : 'opacity-0',
          )}
        />

        {/* Subtle top + bottom vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,8,7,0.55) 0%, rgba(10,8,7,0) 25%, rgba(10,8,7,0) 60%, rgba(10,8,7,0.85) 100%)',
          }}
        />

        {/* Chapter 1 — entering */}
        <div
          data-fs-chapter
          data-fs-start="0"
          data-fs-end="0.15"
          className="container-fluid pointer-events-none absolute inset-x-0 top-[14svh] z-20 flex justify-between"
        >
          <div>
            <p data-fs-copy-enter className="eyebrow mb-3 text-bone-200">
              Chapter I
            </p>
            <h2
              data-fs-copy-enter
              className="font-display text-5xl italic leading-[0.95] md:text-7xl"
            >
              The <span className="text-ember-400">approach.</span>
            </h2>
          </div>
          <p
            data-fs-copy-exit
            className="hidden max-w-[22ch] text-right font-mono text-[11px] uppercase tracking-superwide text-bone-200 md:block"
          >
            Scroll — let the sequence unfold at your pace.
          </p>
        </div>

        {/* Chapter 2 — mid */}
        <div
          data-fs-chapter
          data-fs-start="0.35"
          data-fs-end="0.6"
          className="container-fluid pointer-events-none absolute inset-x-0 top-[36svh] z-20 text-center"
        >
          <p className="eyebrow mb-4">Chapter II</p>
          <h3 className="mx-auto max-w-[14ch] font-display text-6xl italic leading-[0.95] text-balance md:text-8xl">
            Between walls, a <span className="text-ember-400">horizon</span>.
          </h3>
        </div>

        {/* Chapter 3 — end */}
        <div
          data-fs-chapter
          data-fs-start="0.75"
          data-fs-end="0.95"
          className="container-fluid pointer-events-none absolute inset-x-0 bottom-[12svh] z-20 flex items-end justify-between"
        >
          <div>
            <p className="eyebrow mb-3">Chapter III</p>
            <h3 className="font-display text-5xl italic leading-[0.95] md:text-6xl">
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

        {/* Progress rail — a thin persistent signal at the bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-5 pb-4 font-mono text-[10px] uppercase tracking-superwide text-bone-200/70 md:px-12 md:pb-6"
        >
          <span>Frame 001 / {TOTAL_FRAMES}</span>
          <span>Meridian — Sequence 07</span>
        </div>
      </div>
    </section>
  );
}