'use client';

import { useEffect, useRef, useState } from 'react';

export type PreloadStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface PreloadState {
  status: PreloadStatus;
  progress: number; // 0..1
  loaded: number;
  total: number;
  images: HTMLImageElement[];
  failedIndices: number[];
  error: Error | null;
}

interface Options {
  /** Max concurrent in-flight image loads. Browsers cap at ~6 per origin anyway. */
  concurrency?: number;
  /** Ratio of allowed failures (0..1) before we bail with status='error'. */
  failureTolerance?: number;
  /** If true, the effect will not start until you flip it. Useful for deferring on mobile. */
  enabled?: boolean;
}

/**
 * useFramePreloader
 * -----------------
 * Preloads an ordered list of image URLs in parallel (bounded concurrency),
 * decodes them off the main thread when supported (`img.decode()`), and
 * exposes a ready-to-draw array of HTMLImageElement in the same order.
 *
 * Robustness:
 *  - Aborts cleanly on unmount / when `urls` changes.
 *  - Tolerates a small fraction of failed images (some CDNs flake out).
 *  - Re-uses the browser cache — images stay hot for the canvas draw loop.
 */
export function useFramePreloader(urls: string[], options: Options = {}): PreloadState {
  const { concurrency = 8, failureTolerance = 0.05, enabled = true } = options;

  const [state, setState] = useState<PreloadState>(() => ({
    status: 'idle',
    progress: 0,
    loaded: 0,
    total: urls.length,
    images: [],
    failedIndices: [],
    error: null,
  }));

  // Keep the latest options in refs so we don't re-run the effect on every render.
  const concurrencyRef = useRef(concurrency);
  const toleranceRef = useRef(failureTolerance);
  concurrencyRef.current = concurrency;
  toleranceRef.current = failureTolerance;

  useEffect(() => {
    if (!enabled || urls.length === 0) return;

    let cancelled = false;
    const total = urls.length;
    const images: HTMLImageElement[] = new Array(total);
    const failedIndices: number[] = [];
    let completed = 0;

    setState({
      status: 'loading',
      progress: 0,
      loaded: 0,
      total,
      images: [],
      failedIndices: [],
      error: null,
    });

    const loadOne = (index: number): Promise<void> =>
      new Promise<void>((resolve) => {
        if (cancelled) return resolve();

        const img = new Image();
        // Decoding hint tells the browser we don't need it on the main thread.
        img.decoding = 'async';
        // Hint the browser to keep priorities reasonable.
        // @ts-expect-error — fetchPriority is valid HTML but not yet in all TS dom libs
        img.fetchPriority = index < 12 ? 'high' : 'low';

        const finish = (ok: boolean) => {
          if (cancelled) return resolve();
          if (ok) {
            images[index] = img;
          } else {
            failedIndices.push(index);
          }
          completed += 1;

          setState((s) => ({
            ...s,
            progress: completed / total,
            loaded: completed - failedIndices.length,
            failedIndices: failedIndices.slice(),
          }));

          resolve();
        };

        img.onload = () => {
          // Prefer decode() when available — avoids jank on first draw.
          if (typeof img.decode === 'function') {
            img.decode().then(
              () => finish(true),
              () => finish(true), // decode can throw on some Safaris; the image is still usable.
            );
          } else {
            finish(true);
          }
        };
        img.onerror = () => finish(false);

        // Trigger the request.
        img.src = urls[index];
      });

    // Bounded-concurrency worker pool.
    const run = async () => {
      let cursor = 0;
      const workers: Promise<void>[] = [];

      const spawn = async () => {
        while (!cancelled && cursor < total) {
          const idx = cursor++;
          await loadOne(idx);
        }
      };

      for (let i = 0; i < Math.min(concurrencyRef.current, total); i++) {
        workers.push(spawn());
      }

      try {
        await Promise.all(workers);
      } catch (e) {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            status: 'error',
            error: e instanceof Error ? e : new Error(String(e)),
          }));
          return;
        }
      }

      if (cancelled) return;

      const failureRatio = failedIndices.length / total;
      if (failureRatio > toleranceRef.current) {
        setState((s) => ({
          ...s,
          status: 'error',
          images,
          error: new Error(
            `Frame preload failed: ${failedIndices.length}/${total} images could not be loaded.`,
          ),
        }));
        return;
      }

      // Any gaps (failed indices) are filled with the nearest successful neighbour
      // so the canvas draw never receives `undefined`.
      for (const idx of failedIndices) {
        let before = idx - 1;
        while (before >= 0 && !images[before]) before--;
        let after = idx + 1;
        while (after < total && !images[after]) after++;
        images[idx] = images[before] ?? images[after];
      }

      setState({
        status: 'ready',
        progress: 1,
        loaded: total - failedIndices.length,
        total,
        images,
        failedIndices,
        error: null,
      });
    };

    void run();

    return () => {
      cancelled = true;
      // Detach handlers from any in-flight images so they stop mutating state.
      for (const img of images) {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      }
    };
    // We intentionally use the URLs array reference as the sole dep besides `enabled`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls, enabled]);

  return state;
}
