'use client';

const DESTINATIONS = [
  'Geneva', 'Marrakech', 'Cape Town', 'Hong Kong', 'Reykjavík',
  'São Paulo', 'Dubai', 'Ushuaia', 'Tokyo', 'Singapore',
  'Kathmandu', 'Mykonos', 'Addis Ababa', 'Queenstown', 'Aspen',
  'Mumbai', 'Helsinki', 'Beirut', 'Miami', 'Istanbul',
  'Reykjavík', 'Zanzibar', 'Buenos Aires', 'Seoul', 'Amman',
];

export default function DestinationsMarquee() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-16 md:py-24">
      <div className="container-fluid mb-10 flex items-end justify-between">
        <p className="eyebrow">§ 05 — Reach</p>
        <p className="eyebrow hidden md:block">174 sovereignties, one flight plan</p>
      </div>

      <div
        className="group relative flex select-none overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
        aria-hidden
      >
        {[0, 1].map((pass) => (
          <ul
            key={pass}
            className="flex shrink-0 animate-marquee items-center gap-14 whitespace-nowrap pr-14 font-display text-6xl italic tracking-tight md:text-8xl"
          >
            {DESTINATIONS.map((d, i) => (
              <li key={`${pass}-${d}-${i}`} className="flex items-center gap-14">
                <span className="text-bone-100">{d}</span>
                <span
                  aria-hidden
                  className="block h-2 w-2 rotate-45 bg-ember-500"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>

      <p className="container-fluid mt-10 max-w-lg text-sm leading-relaxed text-bone-200/70">
        Clearances, overflights, diplomatic permits, customs — handled before
        you finish the sentence. We do not ask where you would like to go.
        We ask when.
      </p>
    </section>
  );
}