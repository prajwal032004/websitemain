import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink-950 px-6 text-center text-bone-100">
      <div className="max-w-md">
        <p className="eyebrow mb-6 text-bone-400">Meridian — 404</p>
        <h1 className="font-display text-6xl italic leading-[0.95] md:text-7xl">
          Out of range.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-bone-200/80">
          The page you were looking for is not on our manifest. Return to the
          tower and begin again.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-ember-500 px-6 py-4 text-xs uppercase tracking-[0.28em] text-ink-950"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
