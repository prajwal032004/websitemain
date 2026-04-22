'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

interface LoaderProps {
  /** 0..1 — mirrors the preloader's own progress value. */
  progress: number;
  /** When true, the loader plays its exit animation and then unmounts itself. */
  done: boolean;
  /** Called after the exit animation has finished and the loader can be removed. */
  onExited?: () => void;
  /** Optional error message. When set, shows a subdued error state. */
  error?: string | null;
}

export default function Loader({ progress, done, onExited, error }: LoaderProps) {
  const [visible, setVisible] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Smoothly animate the displayed progress so the counter doesn't jitter.
  useEffect(() => {
    const target = Math.max(0, Math.min(1, progress));

    const tick = () => {
      setDisplayProgress((current) => {
        const delta = target - current;
        if (Math.abs(delta) < 0.0005) return target;
        return current + delta * 0.12;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [progress]);

  // Exit sequence — wait for CSS transition, then notify parent.
  useEffect(() => {
    if (!done) return;
    const timeout = window.setTimeout(() => {
      setVisible(false);
      onExited?.();
    }, 1100);
    return () => window.clearTimeout(timeout);
  }, [done, onExited]);

  if (!visible) return null;

  const pct = Math.round(displayProgress * 100);

  return (
    <div
      aria-hidden={done}
      role="status"
      aria-live="polite"
      className={cn(
        'fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-ink-950 text-bone-100',
        'transition-[clip-path,opacity] duration-[1100ms] ease-silk grain',
        done
          ? '[clip-path:inset(0_0_100%_0)] opacity-0'
          : '[clip-path:inset(0_0_0_0)] opacity-100',
      )}
    >
      {/* Soft ambient glow that breathes while loading */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 40% at 50% 60%, rgba(226,137,58,0.18) 0%, rgba(226,137,58,0.06) 35%, transparent 70%)',
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <span className="font-mono text-[11px] uppercase tracking-superwide text-bone-400">
          Meridian / 00°00′
        </span>
        <span className="font-mono text-[11px] uppercase tracking-superwide text-bone-400">
          Preparing sequence
        </span>
      </header>

      {/* Center mark */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 flex items-center gap-4 font-mono text-[10px] uppercase tracking-superwide text-bone-400">
          <span className="h-px w-10 bg-bone-400/40" />
          <span>Expedition No. 07</span>
          <span className="h-px w-10 bg-bone-400/40" />
        </div>

        <h1 className="font-display text-[14vw] leading-[0.9] tracking-ultratight md:text-[120px]">
          <span className="block italic text-bone-100">Meridian</span>
        </h1>

        <p className="mt-6 max-w-md font-display text-[15px] italic text-bone-300/70">
          Where the horizon ends and the voyage begins.
        </p>
      </div>

      {/* Progress footer */}
      <footer className="relative z-10 px-6 pb-8 md:px-12 md:pb-12">
        <div className="flex items-end justify-between gap-8">
          <div className="min-w-0">
            <div className="eyebrow mb-2">Loading</div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl tabular-nums leading-none md:text-7xl">
                {String(pct).padStart(3, '0')}
              </span>
              <span className="font-mono text-xs text-bone-400">%</span>
            </div>
          </div>

          <div className="hidden text-right md:block">
            <div className="eyebrow mb-2">Status</div>
            <div className="font-mono text-xs text-bone-100">
              {error ? 'Recovering' : done ? 'Ready' : 'Transmitting…'}
            </div>
          </div>
        </div>

        {/* Progress rail */}
        <div className="relative mt-6 h-px w-full bg-bone-100/15">
          <div
            className="absolute left-0 top-0 h-full bg-ember-500 transition-[width] duration-500 ease-soft"
            style={{ width: `${pct}%` }}
          />
          {/* A thin moving tick for life */}
          <div
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-ember-400 shadow-[0_0_14px_2px_rgba(226,137,58,0.6)] transition-[left] duration-500 ease-soft"
            style={{ left: `calc(${pct}% - 4px)` }}
          />
        </div>

        {error ? (
          <p className="mt-4 font-mono text-[11px] text-ember-400/80">
            {error} &nbsp;— continuing in degraded mode.
          </p>
        ) : null}
      </footer>
    </div>
  );
}
