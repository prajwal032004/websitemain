'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useGsap } from '@/hooks/useGsap';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/utils/cn';

import { SERVICES, Service } from '@/utils/servicesData';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
    'private-charter': (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 20 L16 8 L28 20" />
            <path d="M10 20 L10 26 L22 26 L22 20" />
            <path d="M8 14 L4 16 L4 20" />
            <path d="M24 14 L28 16 L28 20" />
            <path d="M16 8 L16 26" strokeDasharray="2 3" />
        </svg>
    ),
    'curated-expeditions': (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="16" cy="16" r="11" />
            <path d="M16 5 C16 5 20 10 20 16 C20 22 16 27 16 27" />
            <path d="M16 5 C16 5 12 10 12 16 C12 22 16 27 16 27" />
            <path d="M5 16 L27 16" />
            <path d="M6 11 L26 11" />
            <path d="M6 21 L26 21" />
        </svg>
    ),
    'desert-wind': (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 24 Q8 14 16 18 Q22 21 28 10" />
            <path d="M3 28 L29 28" />
            <circle cx="23" cy="8" r="4" />
            <path d="M16 8 L16 4" />
            <path d="M23 4 L23 2" />
            <path d="M29 8 L31 8" />
        </svg>
    ),
    'concierge': (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="10" width="22" height="16" rx="2" />
            <path d="M11 10 L11 7 Q11 4 16 4 Q21 4 21 7 L21 10" />
            <circle cx="16" cy="18" r="3" />
            <path d="M16 21 L16 24" />
        </svg>
    ),
    'film-production': (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="9" width="20" height="14" rx="2" />
            <path d="M23 13 L29 10 L29 22 L23 19" />
            <circle cx="10" cy="16" r="2.5" />
            <path d="M3 13 L23 13" />
        </svg>
    ),
    'membership': (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="16" cy="16" r="12" />
            <circle cx="16" cy="16" r="6" />
            <path d="M16 4 L16 10" />
            <path d="M16 22 L16 28" />
            <path d="M4 16 L10 16" />
            <path d="M22 16 L28 16" />
        </svg>
    ),
};

function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export default function ServicesSection() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

    useGsap(
        () => {
            gsap.registerPlugin(ScrollTrigger);

            // Eyebrow
            gsap.from('[data-svc-eyebrow]', {
                y: 20,
                opacity: 0,
                duration: 1.0,
                ease: 'expo.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
            });

            // Heading chars
            gsap.from('[data-svc-heading]', {
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: 'expo.out',
                stagger: 0.06,
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
                delay: 0.1,
            });

            // Cards stagger
            gsap.from('[data-svc-card]', {
                y: 50,
                opacity: 0,
                duration: 1.1,
                ease: 'expo.out',
                stagger: 0.08,
                scrollTrigger: { trigger: '[data-svc-grid]', start: 'top 82%', once: true },
            });

            // CTA
            gsap.from('[data-svc-cta]', {
                y: 20,
                opacity: 0,
                duration: 1.0,
                ease: 'expo.out',
                scrollTrigger: { trigger: '[data-svc-grid]', start: 'bottom 85%', once: true },
            });
        },
        [],
        sectionRef,
    );

    return (
        <section
            ref={sectionRef}
            id="services"
            aria-label="Services"
            className="relative overflow-hidden bg-ink-950 py-24 md:py-32 lg:py-40"
        >
            {/* ── Atmosphere ── */}
            <div aria-hidden className="grain pointer-events-none absolute inset-0 z-0" />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background:
                        'radial-gradient(ellipse 70% 50% at 0% 60%, rgba(230,207,68,0.06) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 100% 20%, rgba(138,123,22,0.05) 0%, transparent 50%)',
                }}
            />

            <div className="container-fluid relative z-10">

                {/* ── Header ── */}
                <div className="mb-16 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-3">
                            <span
                                data-svc-eyebrow
                                className="h-px w-8 origin-left bg-ember-400/60"
                            />
                            <p
                                data-svc-eyebrow
                                className="font-mono text-[10px] uppercase tracking-superwide text-ember-400/80"
                            >
                                § What we do
                            </p>
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="font-display text-[clamp(2.4rem,5.5vw,5rem)] italic leading-[1.05] tracking-tight text-bone-50">
                                <span data-svc-heading className="inline-block">The full</span>{' '}
                                <span data-svc-heading className="inline-block text-ember-400">spectrum</span>{' '}
                                <span data-svc-heading className="inline-block">of travel.</span>
                            </h2>
                        </div>
                    </div>

                    <p
                        data-svc-eyebrow
                        className="max-w-[34ch] font-mono text-[11px] leading-relaxed tracking-wide text-bone-300/55 md:text-right"
                    >
                        Six disciplines, one guiding principle — that every journey
                        should feel as though the world was arranged specifically for you.
                    </p>
                </div>

                {/* ── Cards grid ── */}
                <div
                    data-svc-grid
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {SERVICES.map((svc) => (
                        <ServiceCard
                            key={svc.slug}
                            svc={svc}
                            isHovered={hoveredSlug === svc.slug}
                            anyHovered={hoveredSlug !== null}
                            onEnter={() => setHoveredSlug(svc.slug)}
                            onLeave={() => setHoveredSlug(null)}
                        />
                    ))}
                </div>

                {/* ── Bottom CTA ── */}
                <div
                    data-svc-cta
                    className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                >
                    <Link
                        href="/services"
                        className={cn(
                            'group inline-flex items-center gap-3 rounded-full',
                            'border border-bone-100/20 bg-white/[0.03] px-6 py-3',
                            'font-mono text-[10px] uppercase tracking-superwide text-bone-100/80',
                            'transition-[background,border-color,box-shadow,color] duration-400',
                            'hover:border-ember-400/50 hover:bg-ember-500/10 hover:text-bone-50',
                            'hover:shadow-[0_0_24px_rgba(230,207,68,0.14)]',
                        )}
                    >
                        <span>Explore all services</span>
                        <span className="relative block h-4 w-px overflow-hidden bg-bone-100/20">
                            <span className="absolute inset-x-0 top-0 block h-2 w-px animate-[shimmer_2s_linear_infinite] bg-ember-400" />
                        </span>
                        <svg
                            viewBox="0 0 14 14"
                            className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                        >
                            <path d="M2 7h9M7 3l4 4-4 4" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}

// ---------------------------------------------------------------------------
// ServiceCard
// ---------------------------------------------------------------------------

interface ServiceCardProps {
    svc: Service;
    isHovered: boolean;
    anyHovered: boolean;
    onEnter: () => void;
    onLeave: () => void;
}

function ServiceCard({ svc, isHovered, anyHovered, onEnter, onLeave }: ServiceCardProps) {
    const accentRgb = hexToRgb(svc.accentHex);

    return (
        <Link
            href={`/services/${svc.slug}`}
            data-svc-card
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            style={{ '--accent': accentRgb } as React.CSSProperties}
            className={cn(
                'group relative flex flex-col gap-6 overflow-hidden rounded-2xl p-6',
                'border transition-[background,border-color,opacity,box-shadow,transform] duration-500 ease-out',
                isHovered
                    ? 'border-[rgba(var(--accent),0.40)] bg-[rgba(var(--accent),0.06)] shadow-[0_0_0_1px_rgba(var(--accent),0.12),0_20px_60px_-16px_rgba(var(--accent),0.30)] -translate-y-0.5'
                    : anyHovered
                        ? 'border-white/[0.05] bg-white/[0.02] opacity-60'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.12]',
                'min-h-[220px]',
            )}
        >
            {/* Radial bleed */}
            <div
                aria-hidden
                className={cn(
                    'pointer-events-none absolute inset-0 transition-opacity duration-500',
                    isHovered ? 'opacity-100' : 'opacity-0',
                )}
                style={{
                    background: `radial-gradient(ellipse 80% 60% at 0% 100%, rgba(${accentRgb},0.10) 0%, transparent 60%)`,
                }}
            />

            {/* Top row: icon + index */}
            <div className="flex items-start justify-between">
                <div
                    className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        'border transition-[border-color,background,box-shadow,color] duration-500',
                        isHovered
                            ? `border-[rgba(${accentRgb},0.40)] bg-[rgba(${accentRgb},0.12)] text-[rgb(${accentRgb})] shadow-[0_0_12px_rgba(${accentRgb},0.20)]`
                            : 'border-white/10 bg-white/[0.04] text-bone-400',
                    )}
                    style={{ width: 40, height: 40 }}
                >
                    <span className="block h-5 w-5">{SERVICE_ICONS[svc.slug]}</span>
                </div>

                <span
                    className={cn(
                        'font-mono text-[10px] tracking-superwide transition-colors duration-300',
                        isHovered ? 'text-[rgb(var(--accent))]' : 'text-bone-400/40',
                    )}
                >
                    {svc.index}
                </span>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-2">
                <p
                    className={cn(
                        'font-mono text-[9px] uppercase tracking-superwide transition-colors duration-300',
                        isHovered ? 'text-[rgb(var(--accent))]' : 'text-bone-400/50',
                    )}
                >
                    {svc.category}
                </p>
                <h3 className="font-display text-[1.25rem] italic leading-tight tracking-tight text-bone-50">
                    {svc.title}
                </h3>
                <p
                    className={cn(
                        'text-[12px] leading-relaxed transition-[opacity,color] duration-400',
                        isHovered ? 'text-bone-200/75 opacity-100' : 'text-bone-300/45 opacity-80',
                    )}
                >
                    {svc.description}
                </p>
            </div>

            {/* Bottom stat + arrow */}
            <div className="flex items-end justify-between">
                <div>
                    <p
                        className={cn(
                            'font-display text-[1.05rem] italic leading-none transition-colors duration-300',
                            isHovered ? 'text-[rgb(var(--accent))]' : 'text-bone-300/60',
                        )}
                    >
                        {svc.stat}
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-superwide text-bone-400/40">
                        {svc.statLabel}
                    </p>
                </div>

                <span
                    className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full',
                        'border transition-[background,border-color,transform] duration-400',
                        isHovered
                            ? `border-[rgba(${accentRgb},0.45)] bg-[rgba(${accentRgb},0.15)] translate-x-0`
                            : 'border-white/10 bg-transparent',
                        'group-hover:translate-x-0.5',
                    )}
                >
                    <svg
                        viewBox="0 0 12 12"
                        className="h-3 w-3 text-bone-100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                    >
                        <path d="M2 6h8M6 2l4 4-4 4" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}