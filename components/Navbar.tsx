'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { isLoaderComplete } from '@/utils/loader-state';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/works', label: 'Works' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
];

const CONTACT_EMAIL = 'business@5feet4.co';
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;
const MOBILE_UA_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

/**
 * Opens the system mail client on mobile, Gmail compose tab on desktop.
 * Attach as onClick to any anchor that would otherwise use href="mailto:…"
 */
function handleEmailClick(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  if (MOBILE_UA_REGEX.test(navigator.userAgent)) {
    window.location.href = `mailto:${CONTACT_EMAIL}`;
  } else {
    window.open(GMAIL_COMPOSE, '_blank', 'noopener,noreferrer');
  }
}

export default function Navbar() {
  const pathname = usePathname();

  const [hidden, setHidden] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  /**
   * navLogoReady: controls the PNG logo opacity in the navbar.
   *
   * • First visit  — starts false; flips true when the LogoLoader fires
   *   document.documentElement.setAttribute('data-nav-logo-ready', 'true')
   *   (i.e. the moment the flying PNG lands on the navbar).
   *
   * • Return visit — isLoaderComplete() is already true, so we start true
   *   and skip the whole reveal dance entirely.
   */
  const [navLogoReady, setNavLogoReady] = useState<boolean>(() => isLoaderComplete());

  const lastYRef = useRef(0);

  /* ── Watch for the loader's "logo landed" signal ── */
  useEffect(() => {
    // Already revealed (returning visitor or SSR fallback)
    if (navLogoReady) return;

    // Check in case the attribute was already set before this effect ran
    if (document.documentElement.hasAttribute('data-nav-logo-ready')) {
      setNavLogoReady(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (document.documentElement.hasAttribute('data-nav-logo-ready')) {
        setNavLogoReady(true);
        observer.disconnect();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-nav-logo-ready'],
    });

    return () => observer.disconnect();
  }, [navLogoReady]);

  /* ── Scroll behaviour ── */
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

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  /* ── Close drawer on route change ── */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const close = useCallback(() => setMobileOpen(false), []);
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* ──────────────────────────── HEADER ──────────────────────────── */}
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50',
          'transition-[transform] duration-500 ease-out',
          hidden ? '-translate-y-full' : 'translate-y-0',
          condensed ? 'px-4 pt-2' : 'px-4 pt-3',
        )}
      >
        {/*
         * Glass pill ─────────────────────────────────────────────────────
         * Full glassmorphism: backdrop-blur + saturate + rgba bg
         * Top shimmer highlight, ember bottom glow, conic border ring
         */}
        <div
          className={cn(
            'relative rounded-[20px] overflow-hidden',
            'bg-[rgba(10,8,7,0.55)]',
            'backdrop-blur-[28px] backdrop-saturate-150',
            'border border-white/[0.09]',
            'shadow-[0_0_0_0.5px_rgba(255,255,255,0.04)_inset,0_1px_0_rgba(255,255,255,0.06)_inset,0_24px_64px_rgba(0,0,0,0.5),0_4px_16px_rgba(0,0,0,0.3),0_0_80px_rgba(226,137,58,0.04)]',
            'transition-all duration-500 ease-out',
          )}
        >
          {/* Top shimmer line */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[20%] right-[20%] top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/[0.18] to-transparent"
          />
          {/* Bottom ember line */}
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-px left-[30%] right-[30%] h-px rounded-full bg-gradient-to-r from-transparent via-ember-400/35 to-transparent"
          />

          <div className="flex items-center justify-between gap-4 px-5 py-2.5">

            {/* ── Logo ── */}
            <Link
              href="/"
              aria-label="Synkyn Studios — home"
              className="group/logo flex shrink-0 items-center"
            >
              {/*
               * [data-nav-logo] ← LogoLoader.tsx queries this element to
               * calculate the FLIP target rect for the logo travel animation.
               *
               * Opacity starts at 0 on first visit and transitions to 1 when
               * the logo PNG "lands" here (navLogoReady = true). On return
               * visits it's immediately 1.
               */}
              <div
                data-nav-logo
                className="relative flex items-center justify-center"
                style={{
                  opacity: navLogoReady ? 1 : 0,
                  transition: 'opacity 0.25s ease-out',
                  // Prevent the invisible placeholder from affecting layout
                  willChange: 'opacity',
                }}
              >
                {/* Ember hover glow that bleeds slightly beyond the logo */}
                <span
                  aria-hidden
                  className={cn(
                    'pointer-events-none absolute -inset-3 rounded-xl',
                    'bg-ember-400/0 group-hover/logo:bg-ember-400/[0.06]',
                    'transition-colors duration-400',
                  )}
                />

                {/*
                 * The PNG is the same file the loader animates from center screen.
                 * h-[34px] keeps it consistent with the original icon tile height.
                 * The loader's FLIP scale is: navLogoWidth / loaderLogoWidth.
                 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/synkyn-logo.png"
                  alt="Synkyn Studios"
                  className={cn(
                    'relative h-[34px] w-auto select-none',
                    'transition-opacity duration-300 group-hover/logo:opacity-75',
                  )}
                  draggable={false}
                />
              </div>

              {/* Separator dot — visible when condensed on desktop */}
              <span
                aria-hidden
                className={cn(
                  'ml-3 hidden h-1 w-1 shrink-0 rounded-full bg-ember-400 shadow-[0_0_8px_rgba(226,137,58,0.8)] md:block',
                  'transition-opacity duration-300',
                  condensed ? 'opacity-100' : 'opacity-0',
                )}
              />
            </Link>

            {/* ── Desktop nav links ── */}
            <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'group/nl relative overflow-hidden rounded-full px-3.5 py-[7px]',
                      'font-mono text-[10px] font-normal uppercase tracking-[0.12em]',
                      'transition-colors duration-300',
                      active ? 'text-bone-50' : 'text-bone-300/65 hover:text-bone-100',
                    )}
                  >
                    {/* Hover / active pill */}
                    <span
                      aria-hidden
                      className={cn(
                        'absolute inset-0 rounded-full bg-white/[0.08] transition-[opacity,transform] duration-300 ease-out',
                        active
                          ? 'scale-100 opacity-100'
                          : 'scale-90 opacity-0 group-hover/nl:scale-100 group-hover/nl:opacity-100 bg-white/[0.05]',
                      )}
                    />
                    <span className="relative z-10">{link.label}</span>
                    {/* Active ember dot */}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute bottom-[4px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-ember-400 shadow-[0_0_6px_rgba(226,137,58,0.9)]"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-2.5">
              {/* Divider */}
              <span
                aria-hidden
                className={cn(
                  'hidden h-3.5 w-px bg-white/10 transition-opacity duration-300 md:block',
                  condensed ? 'opacity-100' : 'opacity-0',
                )}
              />

              {/*
               * Contact CTA — desktop only.
               * handleEmailClick: mobile → system mail, desktop → Gmail compose tab.
               */}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                onClick={handleEmailClick}
                className={cn(
                  'group/cta relative hidden overflow-hidden rounded-full md:inline-flex items-center gap-1.5',
                  'border border-bone-100/22 px-4 py-2',
                  'font-mono text-[9.5px] font-normal uppercase tracking-[0.20em] text-bone-100/80',
                  'transition-[border-color,color,box-shadow,transform] duration-300 ease-out',
                  'hover:border-ember-400/55 hover:text-bone-50 hover:-translate-y-px',
                  'hover:shadow-[0_0_20px_rgba(226,137,58,0.15),0_0_40px_rgba(226,137,58,0.06)]',
                )}
              >
                {/* Hover bg fill */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-ember-400/12 to-ember-500/6 opacity-0 transition-opacity duration-300 group-hover/cta:opacity-100"
                />
                <span className="relative z-10">Contact</span>
                <svg
                  aria-hidden
                  viewBox="0 0 14 14"
                  className="relative z-10 h-2.5 w-2.5 transition-transform duration-300 group-hover/cta:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 7h9M7 3l4 4-4 4" />
                </svg>
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle menu"
                className={cn(
                  'group/ham relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full md:hidden',
                  'border border-white/10 bg-white/[0.04]',
                  'transition-[border-color,background] duration-300',
                  'hover:border-ember-400/30 hover:bg-ember-400/[0.08]',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'absolute h-px w-[16px] bg-bone-100 transition-transform duration-350 ease-out',
                    mobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-[5px]',
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    'absolute h-px bg-bone-100 transition-[width,opacity] duration-350 ease-out',
                    mobileOpen ? 'w-0 opacity-0' : 'w-[16px] opacity-100',
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    'absolute h-px w-[16px] bg-bone-100 transition-transform duration-350 ease-out',
                    mobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-[5px]',
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ──────────────────────────── MOBILE DRAWER ──────────────────── */}
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
          className="absolute inset-0 bg-ink-950/88 backdrop-blur-2xl"
          onClick={close}
          aria-hidden
        />

        {/* Top ember ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 35% at 50% 0%, rgba(226,137,58,0.09) 0%, transparent 55%)',
          }}
        />

        {/* Grain texture */}
        <div aria-hidden className="grain pointer-events-none absolute inset-0 z-0 opacity-40" />

        <nav
          aria-label="Mobile primary"
          className="relative z-10 flex h-full flex-col justify-between px-8 pb-12 pt-24"
        >
          {/* Nav links */}
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, i) => {
              const active = isActive(link.href);
              return (
                <li
                  key={link.href}
                  className="border-b border-white/[0.06]"
                  style={{
                    opacity: mobileOpen ? 1 : 0,
                    transform: mobileOpen ? 'none' : 'translateY(14px)',
                    transition: `opacity 0.5s ease ${i * 0.06 + 0.08}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06 + 0.08}s`,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={close}
                    className={cn(
                      'flex items-baseline justify-between py-[22px]',
                      'font-display text-[clamp(2.2rem,9vw,3rem)] font-light italic',
                      'transition-colors duration-200',
                      active ? 'text-ember-300' : 'text-bone-100',
                    )}
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-[10px] not-italic tracking-[0.4em] text-bone-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Bottom CTA */}
          <div
            className="flex flex-col gap-3"
            style={{
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'none' : 'translateY(12px)',
              transition: 'opacity 0.5s ease 0.36s, transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.36s',
            }}
          >
            {/*
             * Mobile CTA — same smart handleEmailClick:
             * opens system mail on mobile, Gmail compose on desktop
             * (in case someone opens the drawer on a wide-screen device).
             */}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={(e) => { handleEmailClick(e); close(); }}
              className={cn(
                'flex items-center justify-center rounded-full',
                'bg-ember-500 px-6 py-[14px]',
                'font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-ink-950',
                'transition-[background,box-shadow] duration-300',
                'hover:bg-ember-400 hover:shadow-[0_0_30px_rgba(226,137,58,0.30)]',
              )}
            >
              Mail us
            </a>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-bone-400">
              {CONTACT_EMAIL}
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}