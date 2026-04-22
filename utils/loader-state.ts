/**
 * A tiny framework-agnostic pub/sub for the loader's completion state.
 * Survives route changes (module state is preserved) but resets on full reload.
 */
let complete = false;
const listeners = new Set<() => void>();

export function markLoaderComplete(): void {
  if (complete) return;
  complete = true;
  for (const listener of listeners) listener();
}

export function subscribeLoader(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function isLoaderComplete(): boolean {
  return complete;
}