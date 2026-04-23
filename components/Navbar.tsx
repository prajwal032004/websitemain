'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/works', label: 'Works' },
  { href: '/about', label: 'About' },
];

/**
 * Navbar
 * ------
 * The brand logo lives here and ONLY here. It is marked with
 * `[data-logo-target]` so the LogoLoader can measure it and animate its
 * own (flying) logo to this exact position. Because this element is always
 * visible, the loader's unmount is seamless — the flying logo arrives at
 * the target position and "becomes" this logo. No fade-in, no flicker.
 */
export default function Navbar() {
  const pathname = usePathname();

  const [hidden, setHidden] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastYRef.current;
        if (y > 120 && delta > 6) setHidden(true);
        else if (delta < -4 || y < 80) setHidden(false);
        setCondensed(y > 24);
        lastYRef.current = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const close = useCallback(() => setMobileOpen(false), []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-[transform,padding,background,border-color] duration-500 ease-soft',
          hidden ? '-translate-y-full' : 'translate-y-0',
          condensed
            ? 'border-b border-[var(--line)] bg-ink-950/65 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-ink-950/55'
            : 'border-b border-transparent py-5',
        )}
      >
        <div className="container-fluid flex items-center justify-between gap-6">
          {/* Logo — single element, always visible, serves as FLIP target. */}
          <Link
            href="/"
            aria-label="Meridian — home"
            className="flex items-center text-bone-100"
          >
            <span
              data-logo-target
              className="inline-flex items-center text-[20px] leading-none md:text-[22px]"
            >
              <Logo />
            </span>
          </Link>

          {/* Desktop links */}
          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group relative rounded-full px-4 py-2 text-sm transition-colors duration-300',
                  isActive(link.href)
                    ? 'text-bone-50'
                    : 'text-bone-200 hover:text-bone-50',
                )}
              >
                <span className="relative z-10">{link.label}</span>
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-0 rounded-full transition-[opacity,transform,background] duration-300 ease-soft',
                    isActive(link.href)
                      ? 'scale-100 bg-bone-100/10 opacity-100'
                      : 'scale-75 bg-bone-100/0 opacity-0 group-hover:scale-100 group-hover:bg-bone-100/10 group-hover:opacity-100',
                  )}
                />
                {isActive(link.href) ? (
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ember-400 shadow-[0_0_8px_rgba(226,137,58,0.8)]"
                  />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/#contact"
              className="group hidden items-center gap-2 rounded-full border border-bone-100/25 px-4 py-2 text-xs uppercase tracking-[0.25em] text-bone-100 transition-[background,border-color] duration-300 hover:border-ember-400 hover:bg-ember-500/10 md:inline-flex"
            >
              <span>Request brief</span>
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="h-3 w-3 transition-transform duration-300 ease-soft group-hover:translate-x-0.5"
              >
                <path d="M2 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
              className="relative h-10 w-10 md:hidden"
            >
              <span
                aria-hidden
                className={cn(
                  'absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-bone-100 transition-transform duration-400 ease-soft',
                  mobileOpen ? 'translate-y-0 rotate-45' : '-translate-y-1',
                )}
              />
              <span
                aria-hidden
                className={cn(
                  'absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-bone-100 transition-transform duration-400 ease-soft',
                  mobileOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1',
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        aria-hidden={!mobileOpen}
        className={cn(
          'fixed inset-0 z-40 md:hidden',
          'transition-[opacity,visibility] duration-500 ease-soft',
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <div
          className="absolute inset-0 bg-ink-950/85 backdrop-blur-xl"
          onClick={close}
          aria-hidden
        />
        <nav
          aria-label="Mobile primary"
          className="relative flex h-full flex-col justify-between px-6 pb-10 pt-28"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href} className="border-b border-[var(--line)]">
                <Link
                  href={link.href}
                  onClick={close}
                  className={cn(
                    'flex items-baseline justify-between py-5 font-display text-4xl italic transition-colors',
                    isActive(link.href) ? 'text-ember-400' : 'text-bone-100',
                  )}
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs not-italic text-bone-400">
                    0{i + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="space-y-4 pt-8">
            <Link
              href="/#contact"
              onClick={close}
              className="flex items-center justify-center rounded-full bg-ember-500 px-6 py-4 text-sm uppercase tracking-[0.28em] text-ink-950"
            >
              Request brief
            </Link>
            <p className="text-center font-mono text-[11px] uppercase tracking-superwide text-bone-400">
              desk@meridian.aero
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}