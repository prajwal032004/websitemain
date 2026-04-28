'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/hooks/useGsap';
import { useLoaderComplete } from '@/hooks/useLoaderComplete';
import { cn } from '@/utils/cn';
import type { ServiceDetail } from '@/lib/services-data';

interface Props {
  service: ServiceDetail;
}

export default function ServiceDetailShell({ service }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const active = useLoaderComplete();

  useGsap(() => {
    if (!active) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.from('[data-sd-hero]', {
      y: 60, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', delay: 0.1,
    });

    // Main image parallax
    gsap.to('[data-sd-img-inner]', {
      yPercent: -14, ease: 'none',
      scrollTrigger: {
        trigger: '[data-sd-img-wrap]',
        start: 'top bottom', end: 'bottom top', scrub: 0.8,
      },
    });

    // Feature rows reveal
    gsap.utils.toArray<HTMLElement>('[data-sd-feature]').forEach((el) => {
      gsap.fromTo(el, { y: 32, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    // Stat counters
    gsap.utils.toArray<HTMLElement>('[data-sd-stat]').forEach((el) => {
      gsap.fromTo(el, { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    // Line sweeps
    gsap.utils.toArray<HTMLElement>('[data-sd-line]').forEach((el) => {
      gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left center' }, {
        scaleX: 1, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });
  }, [active], ref);

  return (
    <div ref={ref} className="bg-ink-950 text-bone-100">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div className="relative flex min-h-[75svh] flex-col justify-between overflow-hidden pb-16 pt-32 md:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(65% 50% at 50% 0%, rgba(226,137,58,0.14) 0%, transparent 60%)' }}
        />

        <div className="container-fluid relative">
          <div className="flex items-end justify-between">
            <p data-sd-hero className="eyebrow">
              § {service.index} of 05 — {service.title}
            </p>
            <Link
              href="/services"
              data-sd-hero
              className="group hidden items-center gap-2 font-mono text-[10px] uppercase tracking-superwide text-bone-400 transition-colors hover:text-bone-100 md:flex"
            >
              <svg viewBox="0 0 14 14" className="h-2.5 w-2.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M12 7H3M7 3L3 7l4 4" />
              </svg>
              All services
            </Link>
          </div>

          <h1
            data-sd-hero
            className="mt-10 font-display text-[12vw] italic leading-[0.88] tracking-ultratight md:text-[7.5vw]"
          >
            {service.headline.split(' ').slice(0, 4).join(' ')}{' '}
            <span className="text-ember-400">
              {service.headline.split(' ').slice(4).join(' ')}
            </span>
          </h1>
        </div>

        <div className="container-fluid relative mt-10 grid gap-8 md:grid-cols-12">
          <p
            data-sd-hero
            className="text-base leading-relaxed text-bone-200/85 md:col-span-5 md:text-lg"
          >
            {service.description}
          </p>
          <div data-sd-hero className="flex items-center gap-4 md:col-span-4 md:col-start-9 md:justify-end">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 rounded-full bg-ember-500 px-6 py-3.5 text-[11px] uppercase tracking-[0.28em] text-ink-950 transition-[background] duration-300 hover:bg-ember-400"
            >
              Enquire
            </Link>
            <Link
              href="/services"
              className="glass inline-flex items-center gap-3 rounded-full border-white/15 bg-white/[0.04] px-6 py-3.5 text-[11px] uppercase tracking-[0.28em] text-bone-100 transition-[background,border-color] duration-300 hover:border-ember-400 hover:bg-ember-500/10"
            >
              All services
            </Link>
          </div>
        </div>
      </div>

      {/* ── Hero image ──────────────────────────────────────────────── */}
      <div data-sd-img-wrap className="container-fluid pb-0">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              data-sd-img-inner
              src={service.thumb}
              alt={service.title}
              fill
              priority
              sizes="(min-width: 768px) 90vw, 100vw"
              className="scale-[1.1] object-cover"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-ink-950/30"
            />
            {/* Index watermark */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-4 right-6 font-display text-[8rem] italic leading-none text-ember-400/15 md:text-[12rem]"
            >
              {service.index}
            </span>
          </div>
        </div>
      </div>

      {/* ── Body copy ───────────────────────────────────────────────── */}
      <div className="container-fluid py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <div data-sd-line className="mb-10 h-px w-full bg-[var(--line)]" />
            {service.longDescription.split('\n\n').map((para, i) => (
              <p key={i} className="mb-6 text-base leading-relaxed text-bone-200/85 md:text-lg last:mb-0">
                {para}
              </p>
            ))}
          </div>

          {/* Stats */}
          <div className="md:col-span-4 md:col-start-9">
            <div data-sd-line className="mb-10 h-px w-full bg-[var(--line)]" />
            <p className="eyebrow mb-6">By the numbers</p>
            <ul className="space-y-6">
              {service.stats.map((s) => (
                <li key={s.label} data-sd-stat className="flex flex-col gap-1">
                  <span className="font-display text-4xl italic text-bone-100 md:text-5xl">
                    {s.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-400">
                    {s.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Accent image ────────────────────────────────────────────── */}
      <div className="container-fluid pb-24 md:pb-32">
        <div className="grid gap-8 md:grid-cols-12 md:items-center">
          <div className={cn('md:col-span-5', service.flip && 'md:order-2 md:col-start-8')}>
            <div className="relative overflow-hidden rounded-2xl">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={service.accentThumb}
                  alt={service.title + ' detail'}
                  fill
                  sizes="(min-width: 768px) 42vw, 100vw"
                  className="object-cover"
                />
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-ink-950/30" />
              </div>
            </div>
          </div>

          {/* Features list */}
          <div className={cn('md:col-span-6', service.flip ? 'md:col-start-1 md:row-start-1' : 'md:col-start-7')}>
            <p className="eyebrow mb-6">What&apos;s included</p>
            <ul className="divide-y divide-[var(--line)]">
              {service.features.map((f) => (
                <li key={f.label} data-sd-feature className="grid gap-2 py-5 md:grid-cols-2 md:gap-6">
                  <div className="flex items-start gap-3">
                    <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-400" />
                    <span className="font-display italic text-bone-100 md:text-lg">{f.label}</span>
                  </div>
                  <p className="pl-4 text-sm leading-relaxed text-bone-200/75 md:pl-0">{f.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-superwide text-bone-400">
              {service.note}
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <div className="container-fluid py-24 md:py-32">
        <div data-sd-line className="mb-16 h-px w-full bg-[var(--line)]" />
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <p className="eyebrow mb-5">Ready to move?</p>
            <h2 className="font-display text-5xl italic leading-[0.92] md:text-6xl">
              Your coordinates.{' '}
              <span className="text-ember-400">Our aircraft.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-4 md:col-span-4 md:col-start-9">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full bg-ember-500 px-7 py-4 text-[11px] uppercase tracking-[0.28em] text-ink-950 transition-[background] duration-300 hover:bg-ember-400"
            >
              Open a brief
            </Link>
            <Link
              href={`/services/${service.next}`}
              className="glass inline-flex items-center justify-center gap-3 rounded-full border-white/15 bg-white/[0.04] px-7 py-4 text-[11px] uppercase tracking-[0.28em] text-bone-100 transition-[background,border-color] duration-300 hover:border-ember-400 hover:bg-ember-500/10"
            >
              Next service →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
