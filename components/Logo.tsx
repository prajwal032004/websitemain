import { cn } from '@/utils/cn';

interface LogoProps {
  /** When false, renders only the circular mark — useful for tight spaces. */
  showWordmark?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Meridian's mark + wordmark. The whole thing is sized via `font-size` on the
 * parent — at 20px the mark is ~20px tall (navbar), at 56px it's ~56px tall
 * (loader hero). That makes the loader→navbar FLIP animation trivial:
 * we just animate x / y / scale on a single element.
 */
export default function Logo({
  showWordmark = true,
  className,
  ariaLabel = 'Meridian',
}: LogoProps) {
  return (
    <span
      aria-label={ariaLabel}
      role="img"
      className={cn(
        'inline-flex items-center gap-[0.42em] leading-none text-current',
        className,
      )}
    >
      <svg
        viewBox="0 0 40 40"
        className="h-[1em] w-[1em] shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        aria-hidden
      >
        {/* Meridian circle */}
        <circle cx="20" cy="20" r="12.5" />
        {/* Equator / horizon line */}
        <line x1="2" y1="20" x2="38" y2="20" />
        {/* Pole ticks */}
        <line x1="20" y1="3" x2="20" y2="7" />
        <line x1="20" y1="33" x2="20" y2="37" />
        {/* Sun on the horizon */}
        <circle cx="26" cy="20" r="1.8" fill="currentColor" stroke="none" />
      </svg>

      {showWordmark ? (
        <span className="font-display italic tracking-[-0.02em] text-[0.9em]">
          Meridian
        </span>
      ) : null}
    </span>
  );
}