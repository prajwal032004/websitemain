'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

/**
 * CustomCursor
 * ─────────────
 * A two-ring magnetic cursor:
 *   - Inner dot  : 8px ember fill, instant follow
 *   - Outer ring : 36px translucent border, lerp-smoothed follow
 *
 * On hover of [data-cursor]:
 *   - Outer ring scales 2.2× and tints ember
 *   - Text label appears inside the ring
 *
 * On hover of links/buttons:
 *   - Inner dot scales 0.5× (retreats)
 *   - Outer ring grows 1.6×
 *
 * Mount this once in the root layout (client-only).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    // Only on devices that actually have a mouse / fine pointer
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0; let my = 0;
    let rx = 0; let ry = 0;
    let rafId = 0;
    let isHidden = true;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      rx = lerp(rx, mx, 0.10);
      ry = lerp(ry, my, 0.10);

      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (isHidden) {
        rx = mx; ry = my;
        isHidden = false;
        setVisible(true);
      }
    };

    const onLeave = () => { setVisible(false); isHidden = true; };
    const onEnter = () => { setVisible(true); isHidden = false; };

    // State for interactive elements
    const setInteractive = (e: Event) => {
      const el = e.target as HTMLElement;
      const closest = el.closest<HTMLElement>('[data-cursor]');
      if (closest) {
        setLabel(closest.dataset.cursor ?? '');
        ring.classList.add('is-action');
      } else if (el.closest('a, button, [role="button"]')) {
        ring.classList.add('is-link');
      }
    };

    const clearInteractive = () => {
      ring.classList.remove('is-action', 'is-link');
      setLabel('');
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', setInteractive);
    document.addEventListener('mouseout', clearInteractive);

    rafId = requestAnimationFrame(tick);

    // Hide the real cursor site-wide via CSS
    document.documentElement.style.cursor = 'none';

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', setInteractive);
      document.removeEventListener('mouseout', clearInteractive);
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        aria-hidden
        className={cn(
          'pointer-events-none fixed left-0 top-0 z-[200]',
          'h-2 w-2 rounded-full bg-ember-400',
          'shadow-[0_0_10px_rgba(230,207,68,0.8)]',
          'transition-[opacity,transform] duration-150',
          visible ? 'opacity-100' : 'opacity-0',
        )}
        style={{ willChange: 'transform' }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        aria-hidden
        className={cn(
          'pointer-events-none fixed left-0 top-0 z-[199]',
          'flex h-9 w-9 items-center justify-center rounded-full',
          'border border-ember-400/40 bg-ember-400/5 backdrop-blur-[2px]',
          'transition-[opacity,width,height,background,border-color,transform] duration-300 ease-soft',
          'cursor-ring',
          visible ? 'opacity-100' : 'opacity-0',
        )}
        style={{ willChange: 'transform' }}
      >
        <span
          ref={labelRef}
          className="select-none font-mono text-[8px] uppercase tracking-[0.2em] text-ember-300 opacity-0 transition-opacity duration-200 cursor-ring-label"
        >
          {label}
        </span>
      </div>

      {/* Global cursor CSS rules */}
      <style>{`
        * { cursor: none !important; }

        .cursor-ring.is-action {
          width: 80px !important;
          height: 80px !important;
          border-color: rgba(230,207,68,0.70) !important;
          background: rgba(230,207,68,0.10) !important;
        }
        .cursor-ring.is-action .cursor-ring-label {
          opacity: 1 !important;
        }

        .cursor-ring.is-link {
          width: 54px !important;
          height: 54px !important;
          border-color: rgba(230,207,68,0.55) !important;
          background: rgba(230,207,68,0.07) !important;
        }
      `}</style>
    </>
  );
}
