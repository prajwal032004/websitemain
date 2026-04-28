'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { useLoaderComplete } from '@/hooks/useLoaderComplete';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/works', label: 'Works' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const loaderDone = useLoaderComplete();

  const [hidden, setHidden] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navRevealed, setNavRevealed] = useState(false);
  const lastYRef = useRef(0);

  // After the loader finishes, trigger navbar reveal with a short delay
  // so the logo FLIP animation has time to complete
  useEffect(() => {
    if (!loaderDone) return;
    const timer = setTimeout(() => setNavRevealed(true), 150);
    return () => clearTimeout(timer);
  }, [loaderDone]);

  const handleEmailClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile) {
      window.location.href = 'mailto:business@synkyn.co';
    } else {
      window.open(
        'https://mail.google.com/mail/?view=cm&fs=1&to=business@synkyn.co',
        '_blank'
      );
    }
  }, []);

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
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const close = useCallback(() => setMobileOpen(false), []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* ─────────────────────────── Header ─────────────────────────── */}
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50',
          'transition-[transform,padding,background,border-color,box-shadow] duration-500 ease-out',
          hidden ? '-translate-y-full' : 'translate-y-0',
          condensed
            ? [
              'py-2.5',
              'border-b border-white/[0.07]',
              'bg-[rgba(10,8,7,0.72)]',
              'backdrop-blur-2xl backdrop-saturate-150',
              'shadow-[0_1px_0_rgba(255,255,255,0.04),0_8px_40px_rgba(0,0,0,0.4)]',
            ].join(' ')
            : 'py-4 border-b border-transparent bg-transparent backdrop-blur-0',
        )}
      >
        <div className="container-fluid flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            href="/"
            aria-label="Meridian — home"
            className="group flex shrink-0 items-center gap-2.5 text-bone-100"
          >
            <span
              data-nav-logo
              className={cn(
                'inline-flex items-center leading-none',
                'transition-[opacity,transform] duration-700 ease-out',
                navRevealed
                  ? 'opacity-100 translate-y-0 group-hover:opacity-80'
                  : 'opacity-0 translate-y-2',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/synkyn-logo.png"
                alt="Synkyn Studios"
                className="h-[34px] w-auto select-none md:h-[40px]"
                draggable={false}
              />
            </span>
            {/* Wordmark separator dot */}
            <span
              aria-hidden
              className={cn(
                'hidden h-1 w-1 shrink-0 rounded-full bg-ember-400 shadow-[0_0_6px_rgba(226,137,58,0.7)]',
                'transition-opacity duration-300',
                condensed ? 'md:block' : 'md:hidden',
              )}
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            aria-label="Primary"
            className={cn(
              'hidden items-center gap-0.5 md:flex',
              'transition-[opacity,transform] duration-700 ease-out',
              navRevealed
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2',
            )}
            style={{ transitionDelay: navRevealed ? '0.1s' : '0s' }}
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'group relative rounded-full px-3.5 py-1.5',
                    'text-[12px] font-medium tracking-[0.06em] uppercase',
                    'transition-colors duration-300',
                    active ? 'text-bone-50' : 'text-bone-300/70 hover:text-bone-100',
                  )}
                >
                  {/* Hover / active pill */}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute inset-0 rounded-full transition-[opacity,transform] duration-300 ease-out',
                      active
                        ? 'scale-100 opacity-100 bg-white/[0.08]'
                        : 'scale-90 opacity-0 bg-white/[0.06] group-hover:scale-100 group-hover:opacity-100',
                    )}
                  />
                  <span className="relative z-10">{link.label}</span>

                  {/* Active ember dot */}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-ember-400 shadow-[0_0_6px_rgba(226,137,58,0.9)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right actions ── */}
          <div
            className={cn(
              'flex items-center gap-2.5',
              'transition-[opacity,transform] duration-700 ease-out',
              navRevealed
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2',
            )}
            style={{ transitionDelay: navRevealed ? '0.2s' : '0s' }}
          >
            {/* Subtle divider */}
            <span
              aria-hidden
              className={cn(
                'hidden h-3.5 w-px bg-white/10 transition-opacity duration-300 md:block',
                condensed ? 'opacity-100' : 'opacity-0',
              )}
            />

            <button
              onClick={handleEmailClick}
              className={cn(
                'group hidden items-center gap-1.5 rounded-full md:inline-flex',
                'border border-bone-100/20 px-3.5 py-1.5',
                'text-[11px] font-medium uppercase tracking-[0.18em] text-bone-100/80',
                'transition-[background,border-color,color,box-shadow] duration-300',
                'hover:border-ember-400/60 hover:bg-ember-500/10 hover:text-bone-50',
                'hover:shadow-[0_0_16px_rgba(226,137,58,0.12)]',
                'cursor-pointer',
              )}
            >
              <span>Contact</span>
              {/* Email icon */}
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="h-3 w-3 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
                <path d="M1.5 4.5L8 9l6.5-4.5" />
              </svg>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] md:hidden"
            >
              <span
                aria-hidden
                className={cn(
                  'absolute h-px w-[18px] bg-bone-100 transition-transform duration-350 ease-out',
                  mobileOpen ? 'rotate-45' : '-translate-y-[4px]',
                )}
              />
              <span
                aria-hidden
                className={cn(
                  'absolute h-px bg-bone-100 transition-[width,opacity,transform] duration-350 ease-out',
                  mobileOpen ? 'w-0 opacity-0' : 'w-[18px] opacity-100',
                )}
              />
              <span
                aria-hidden
                className={cn(
                  'absolute h-px w-[18px] bg-bone-100 transition-transform duration-350 ease-out',
                  mobileOpen ? '-rotate-45' : 'translate-y-[4px]',
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────── Mobile drawer ─────────────────────── */}
      <div
        id="mobile-menu"
        aria-hidden={!mobileOpen}
        className={cn(
          'fixed inset-0 z-40 md:hidden',
          'transition-[opacity,visibility] duration-500 ease-out',
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-ink-950/90 backdrop-blur-2xl"
          onClick={close}
          aria-hidden
        />

        {/* Grain overlay */}
        <div aria-hidden className="grain pointer-events-none absolute inset-0 z-0" />

        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 40% at 50% 0%, rgba(226,137,58,0.10) 0%, transparent 60%)',
          }}
        />

        <nav
          aria-label="Mobile primary"
          className="relative z-10 flex h-full flex-col justify-between px-6 pb-12 pt-24"
        >
          {/* Links */}
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, i) => {
              const active = isActive(link.href);
              return (
                <li
                  key={link.href}
                  className="border-b border-white/[0.06]"
                  style={{
                    opacity: mobileOpen ? 1 : 0,
                    transform: mobileOpen ? 'none' : 'translateY(12px)',
                    transition: `opacity 0.5s ease ${i * 0.06 + 0.15}s, transform 0.5s ease ${i * 0.06 + 0.15}s`,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={close}
                    className={cn(
                      'flex items-baseline justify-between py-5',
                      'font-display text-[clamp(2rem,8vw,2.75rem)] italic',
                      'transition-colors duration-200',
                      active ? 'text-ember-400' : 'text-bone-100',
                    )}
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-[10px] not-italic tracking-superwide text-bone-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Bottom CTA */}
          <div
            className="space-y-3"
            style={{
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'none' : 'translateY(12px)',
              transition: 'opacity 0.5s ease 0.42s, transform 0.5s ease 0.42s',
            }}
          >
            <button
              onClick={(e) => { close(); handleEmailClick(e); }}
              className={cn(
                'flex items-center justify-center gap-2 rounded-full',
                'bg-ember-500 px-6 py-3.5',
                'text-[11px] font-medium uppercase tracking-[0.28em] text-ink-950',
                'cursor-pointer',
              )}
            >
              <span>Contact Us</span>
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
                <path d="M1.5 4.5L8 9l6.5-4.5" />
              </svg>
            </button>
            <p className="text-center font-mono text-[10px] uppercase tracking-superwide text-bone-400">
              business@.co
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}