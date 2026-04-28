'use client';

import { useEffect, useRef, useState } from 'react';

interface LoaderProps {
  /** 0..1 — mirrors the preloader's own progress value. */
  progress: number;
  /** When true, the loader plays its curtain-split exit and then unmounts. */
  done: boolean;
  /** Called after the exit animation has finished and the loader can be removed. */
  onExited?: () => void;
  /** Optional error message. When set, shows a subdued error state. */
  error?: string | null;
}

export default function Loader({ progress, done, onExited, error }: LoaderProps) {
  const [visible, setVisible] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'gone'>('loading');

  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // ── Smooth counter ───────────────────────────────────────────────────────
  useEffect(() => {
    const target = Math.max(0, Math.min(1, progress));
    const tick = () => {
      setDisplayProgress((cur) => {
        const delta = target - cur;
        if (Math.abs(delta) < 0.0005) return target;
        return cur + delta * 0.12;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [progress]);

  // ── Curtain-split exit when done ─────────────────────────────────────────
  useEffect(() => {
    if (!done) return;

    // Short flicker pause, then trigger reveal phase
    const revealTimer = window.setTimeout(async () => {
      setPhase('reveal');

      const top = topRef.current;
      const bottom = bottomRef.current;
      const content = contentRef.current;
      if (!top || !bottom) return;

      // Fade content out first
      if (content) {
        content.style.transition = 'opacity 0.35s ease';
        content.style.opacity = '0';
      }

      // Wait a beat then split the curtains
      await delay(200);

      const easing = 'cubic-bezier(0.77, 0, 0.175, 1)';
      top.style.transition = `transform 1.0s ${easing}`;
      bottom.style.transition = `transform 1.0s ${easing}`;
      top.style.transform = 'translateY(-100%)';
      bottom.style.transform = 'translateY(100%)';

      // After curtains clear, mark gone
      const goneTimer = window.setTimeout(() => {
        setVisible(false);
        setPhase('gone');
        onExited?.();
      }, 1100);

      return () => window.clearTimeout(goneTimer);
    }, 180);

    return () => window.clearTimeout(revealTimer);
  }, [done, onExited]);

  if (!visible) return null;

  const pct = Math.round(displayProgress * 100);

  return (
    <div
      aria-hidden={done}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[120] pointer-events-none overflow-hidden"
    >
      {/* ── Top curtain half ──────────────────────────────────────────── */}
      <div
        ref={topRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-ink-950 will-change-transform"
        style={{ transform: 'translateY(0)' }}
      >
        {/* Ambient fog */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at 30% 80%, rgba(230,207,68,0.22) 0%, transparent 60%), radial-gradient(ellipse at 80% 60%, rgba(184,170,40,0.12) 0%, transparent 60%)',
          }}
        />
        {/* Grain */}
        <div aria-hidden className="grain absolute inset-0" />
      </div>

      {/* ── Bottom curtain half ───────────────────────────────────────── */}
      <div
        ref={bottomRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-950 will-change-transform"
        style={{ transform: 'translateY(0)' }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at 70% 20%, rgba(230,207,68,0.18) 0%, transparent 60%)',
          }}
        />
        <div aria-hidden className="grain absolute inset-0" />
      </div>

      {/* ── Center brand + counter ────────────────────────────────────── */}
      {/* Lives above both curtain halves; fades out before curtains split */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 text-bone-100"
        style={{ opacity: 1 }}
      >
        {/* Eyebrow */}
        <p
          className="font-mono text-[10px] uppercase tracking-superwide text-bone-400"
          style={{ animation: 'fadeSlideUp 1.1s cubic-bezier(0.77,0,0.175,1) both' }}
        >
          Expedition No. 07
        </p>

        {/* Wordmark */}
        <h1
          className="font-display text-[18vw] italic leading-[0.88] tracking-ultratight md:text-[10rem]"
          style={{ animation: 'fadeSlideUp 1.2s 0.08s cubic-bezier(0.77,0,0.175,1) both' }}
        >
          Meridian
          <span className="text-ember-400">.</span>
        </h1>

        {/* Counter */}
        <div
          className="font-mono text-xs tracking-[0.5em] text-bone-400"
          style={{ animation: 'fadeSlideUp 1.2s 0.16s cubic-bezier(0.77,0,0.175,1) both' }}
        >
          {String(pct).padStart(3, '0')}
        </div>

        {/* Progress rail */}
        <div className="relative mt-2 h-px w-48 bg-bone-100/15 md:w-64">
          <div
            className="absolute left-0 top-0 h-full bg-ember-500"
            style={{ width: `${pct}%`, transition: 'width 0.5s ease' }}
          />
          <div
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-ember-400 shadow-[0_0_14px_2px_rgba(230,207,68,0.6)]"
            style={{ left: `calc(${pct}% - 4px)`, transition: 'left 0.5s ease' }}
          />
        </div>

        {error && (
          <p className="font-mono text-[11px] text-ember-400/80">
            {error}&nbsp;— continuing in degraded mode.
          </p>
        )}
      </div>

      {/* ── Keyframes injected once via a style tag ───────────────────── */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}

// ── Tiny helper ──────────────────────────────────────────────────────────────
function delay(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}