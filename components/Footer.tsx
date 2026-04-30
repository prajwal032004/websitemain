'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { handleEmailClick } from '@/utils/email';

/* ════════════════════════════════════════════════════════════════════════
   MERIDIAN — CINEMATIC FOOTER · v3
   No headline. Calmer atmosphere. Fully responsive.
   ════════════════════════════════════════════════════════════════════════ */

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const INSTAGRAM_URL = 'https://instagram.com/meridian.studio';
const INSTAGRAM_HANDLE = '@meridian.studio';
const EMAIL = 'desk@meridian.aero';

const MARQUEE_TOP = ['Bengaluru', 'Films', 'Motion', 'Direction', 'Atmosphere', 'Storytelling'];
const MARQUEE_BOTTOM = ['Vol. 07', 'MMXXVI', 'Private Expeditions', 'Cinematic Studio', 'By Appointment'];

/* ════════════════════════════════════════════════════════════════════════
   CSS
   ════════════════════════════════════════════════════════════════════════ */
const FOOTER_CSS = `
.mfx {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: #0A0807;
  color: #f4efe6;
  display: flex;
  flex-direction: column;
  font-feature-settings: "kern" 1, "liga" 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ───────────── Atmospheric layers ───────────── */
.mfx-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

/* Base gradient (static — no jitter) */
.mfx-base-grad {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 100% 70% at 50% 100%, #100C09 0%, transparent 60%),
    linear-gradient(180deg, #0A0807 0%, #0E0B09 50%, #080605 100%);
}

/* Amber bloom — slower, subtler breathing */
.mfx-amber-bloom {
  position: absolute;
  top: -10%;
  left: 50%;
  width: 140%;
  height: 80%;
  margin-left: -70%;
  background: radial-gradient(ellipse 50% 60% at 50% 50%, rgba(230, 180, 95, 0.18) 0%, rgba(230, 180, 95, 0.06) 35%, transparent 70%);
  filter: blur(80px);
  transform: translateZ(0);
  will-change: opacity;
  animation: mfx-bloom 24s ease-in-out infinite alternate;
}

/* Side glows — gentler, no transform animation (just opacity) */
.mfx-side-glow-l {
  position: absolute;
  top: 30%;
  left: -10%;
  width: 50%;
  height: 60%;
  background: radial-gradient(circle, rgba(180, 130, 70, 0.10) 0%, transparent 60%);
  filter: blur(90px);
  transform: translateZ(0);
  will-change: opacity;
  animation: mfx-pulse 18s ease-in-out infinite;
}
.mfx-side-glow-r {
  position: absolute;
  bottom: 10%;
  right: -15%;
  width: 60%;
  height: 70%;
  background: radial-gradient(circle, rgba(180, 130, 70, 0.07) 0%, transparent 60%);
  filter: blur(110px);
  transform: translateZ(0);
  will-change: opacity;
  animation: mfx-pulse 22s ease-in-out infinite reverse;
}

/* Mesh — static (kills the drift jitter) */
.mfx-mesh {
  position: absolute;
  inset: -10%;
  background:
    radial-gradient(circle at 20% 30%, rgba(230, 180, 95, 0.05) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(180, 130, 70, 0.04) 0%, transparent 35%),
    radial-gradient(circle at 50% 50%, rgba(140, 100, 60, 0.03) 0%, transparent 40%);
  filter: blur(50px);
  opacity: 0.8;
}

/* Light streaks — pure opacity animation, no transform */
.mfx-streaks {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(105deg, transparent 30%, rgba(230, 180, 95, 0.04) 45%, rgba(230, 180, 95, 0.06) 50%, rgba(230, 180, 95, 0.04) 55%, transparent 70%);
  mix-blend-mode: screen;
  opacity: 0.5;
  will-change: opacity;
  animation: mfx-shimmer 12s ease-in-out infinite;
}

/* Fine grid — static */
.mfx-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(244, 239, 230, 0.018) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(244, 239, 230, 0.018) 1px, transparent 1px);
  background-size: 100px 100px;
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 0%, transparent 80%);
  mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 0%, transparent 80%);
}

/* Grain — STATIC. Animated grain causes the jitter you saw. */
.mfx-grain {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' seed='5' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 320px 320px;
  pointer-events: none;
}

/* Vignette */
.mfx-vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.5) 90%, rgba(0, 0, 0, 0.85) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, transparent 15%, transparent 85%, rgba(0, 0, 0, 0.5) 100%);
}

/* Floating dust */
.mfx-dust {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
.mfx-dust-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(230, 200, 150, 0.6);
  pointer-events: none;
  will-change: transform;
}

/* Mouse-follow orb */
.mfx-cursor-orb {
  position: absolute;
  top: 0;
  left: 0;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(230, 180, 95, 0.16) 0%, rgba(230, 180, 95, 0.05) 35%, transparent 70%);
  filter: blur(60px);
  transform: translate3d(-50%, -50%, 0);
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: screen;
  will-change: transform;
  opacity: 0;
  transition: opacity 1.2s ease;
}
.mfx.is-mouse-active .mfx-cursor-orb { opacity: 1; }
@media (max-width: 900px) {
  .mfx-cursor-orb { display: none; }
}

/* Animations — slowed, opacity-only where possible */
@keyframes mfx-bloom {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}
@keyframes mfx-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
@keyframes mfx-shimmer {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}
@keyframes mfx-rule-shimmer {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* ═════════════════════════════════════════════════════════════════════
   STAGE
   ═════════════════════════════════════════════════════════════════════ */
.mfx-stage {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  padding: clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 5rem) 0;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

/* ───────────── Top reel ───────────── */
.mfx-reel {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  margin-bottom: clamp(3rem, 6vw, 5rem);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.4);
}
.mfx-reel-l, .mfx-reel-r {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}
.mfx-reel-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(244, 239, 230, 0.15), transparent);
  position: relative;
  overflow: hidden;
  min-width: 40px;
}
.mfx-reel-line::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(230, 180, 95, 0.6), transparent);
  animation: mfx-rule-shimmer 5s ease-in-out infinite;
}
.mfx-reel-marker {
  color: rgba(230, 180, 95, 0.85);
  font-size: 13px;
}
.mfx-reel-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(230, 180, 95, 0.9);
  box-shadow: 0 0 8px rgba(230, 180, 95, 0.6);
  flex-shrink: 0;
}

@media (max-width: 700px) {
  .mfx-reel { font-size: 9px; letter-spacing: 0.25em; }
  .mfx-reel-r { display: none; }
}

/* ───────────── Subline (now centerpiece) ───────────── */
.mfx-sub-block {
  position: relative;
  z-index: 2;
  margin: clamp(2rem, 5vw, 4rem) auto clamp(4rem, 8vw, 6rem);
  max-width: 540px;
  padding: 0 clamp(1rem, 4vw, 2rem);
  text-align: center;
}
.mfx-sub-mark {
  display: inline-block;
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(230, 180, 95, 0.7), transparent);
  margin-bottom: 1.5rem;
}
.mfx-sub {
  margin: 0;
  font-family: 'Times New Roman', 'EB Garamond', Georgia, serif;
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  line-height: 1.7;
  color: rgba(244, 239, 230, 0.7);
  font-weight: 300;
  letter-spacing: 0.005em;
  font-style: italic;
}

/* ───────────── Dual CTA grid ───────────── */
.mfx-cta-grid {
  position: relative;
  z-index: 2;
  margin: 0 auto;
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
  padding: 0 clamp(1rem, 4vw, 4rem);
}
.mfx-cta-divider {
  width: 1px;
  height: 80px;
  background: linear-gradient(180deg, transparent, rgba(230, 180, 95, 0.3), transparent);
  position: relative;
  overflow: hidden;
}
.mfx-cta-divider::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, rgba(230, 180, 95, 0.85), transparent);
  animation: mfx-rule-shimmer 4s ease-in-out infinite;
}

/* Instagram */
.mfx-ig {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 0.85rem;
  color: #f4efe6;
  text-decoration: none;
  margin-left: auto;
  will-change: transform;
  position: relative;
}
.mfx-ig-label {
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.35);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.mfx-ig-label::before {
  content: '→';
  color: rgba(230, 180, 95, 0.7);
  font-size: 13px;
}
.mfx-ig-handle {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 0.5em;
  font-family: 'Times New Roman', 'EB Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1.75rem, 5vw, 3.5rem);
  line-height: 1;
  padding: 0.15em 0;
  color: #f4efe6;
  transition: color 0.6s cubic-bezier(0.22, 1, 0.36, 1), text-shadow 0.6s ease;
  white-space: nowrap;
}
.mfx-ig-icon {
  width: 0.6em;
  height: 0.6em;
  color: rgba(230, 180, 95, 0.85);
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease;
  flex-shrink: 0;
}
.mfx-ig-text {
  position: relative;
  display: inline-block;
}
.mfx-ig-underline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.1em;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(230, 180, 95, 0.95), transparent);
  transform: scaleX(0);
  transform-origin: 100% 50%;
  transition: transform 0.9s cubic-bezier(0.65, 0, 0.35, 1);
  box-shadow: 0 0 12px rgba(230, 180, 95, 0.5);
}
.mfx-ig:hover .mfx-ig-underline { transform: scaleX(1); transform-origin: 0% 50%; }
.mfx-ig:hover .mfx-ig-handle {
  color: rgba(230, 180, 95, 1);
  text-shadow: 0 0 30px rgba(230, 180, 95, 0.4), 0 0 60px rgba(230, 180, 95, 0.2);
}
.mfx-ig:hover .mfx-ig-icon { transform: rotate(-12deg) scale(1.15); }
.mfx-ig:focus-visible { outline: none; }

.mfx-ig-halo {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 120%;
  height: 200%;
  background: radial-gradient(circle, rgba(230, 180, 95, 0.18) 0%, transparent 50%);
  filter: blur(40px);
  opacity: 0;
  transition: opacity 0.8s ease;
  pointer-events: none;
  z-index: -1;
}
.mfx-ig:hover .mfx-ig-halo { opacity: 1; }

/* Email */
.mfx-email {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 0.85rem;
  color: #f4efe6;
  text-decoration: none;
  margin-right: auto;
  cursor: pointer;
  will-change: transform;
  position: relative;
}
.mfx-email-label {
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.35);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.mfx-email-label::after {
  content: '←';
  color: rgba(230, 180, 95, 0.7);
  font-size: 13px;
}
.mfx-email-addr {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 0.4em;
  font-family: 'Times New Roman', 'EB Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 300;
  font-size: clamp(1.25rem, 3vw, 2.25rem);
  line-height: 1;
  padding: 0.15em 0;
  color: rgba(244, 239, 230, 0.85);
  transition: color 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              letter-spacing 0.8s cubic-bezier(0.22, 1, 0.36, 1),
              text-shadow 0.6s ease;
  white-space: nowrap;
}
.mfx-email-arrow {
  width: 0.6em;
  height: 0.6em;
  color: rgba(230, 180, 95, 0.7);
  transform: translateX(0);
  transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease;
  opacity: 0.6;
  flex-shrink: 0;
}
.mfx-email-underline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.1em;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(230, 180, 95, 0.95), transparent);
  transform: scaleX(0);
  transform-origin: 0% 50%;
  transition: transform 0.9s cubic-bezier(0.65, 0, 0.35, 1);
  box-shadow: 0 0 12px rgba(230, 180, 95, 0.5);
}
.mfx-email:hover .mfx-email-addr {
  color: rgba(230, 180, 95, 1);
  letter-spacing: 0.02em;
  text-shadow: 0 0 30px rgba(230, 180, 95, 0.35), 0 0 60px rgba(230, 180, 95, 0.18);
}
.mfx-email:hover .mfx-email-arrow {
  transform: translateX(0.5em);
  opacity: 1;
  color: rgba(230, 180, 95, 1);
}
.mfx-email:hover .mfx-email-underline { transform: scaleX(1); }
.mfx-email:focus-visible { outline: none; }

.mfx-email-halo {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 120%;
  height: 200%;
  background: radial-gradient(circle, rgba(230, 180, 95, 0.18) 0%, transparent 50%);
  filter: blur(40px);
  opacity: 0;
  transition: opacity 0.8s ease;
  pointer-events: none;
  z-index: -1;
}
.mfx-email:hover .mfx-email-halo { opacity: 1; }

/* CTA grid responsive */
@media (max-width: 768px) {
  .mfx-cta-grid {
    grid-template-columns: 1fr;
    gap: clamp(2rem, 5vw, 2.5rem);
    text-align: center;
    padding: 0 1.25rem;
  }
  .mfx-cta-divider {
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(230, 180, 95, 0.3), transparent);
    margin: 0 auto;
    justify-self: center;
  }
  .mfx-cta-divider::after {
    background: linear-gradient(90deg, transparent, rgba(230, 180, 95, 0.85), transparent);
  }
  .mfx-ig, .mfx-email {
    align-items: center;
    text-align: center;
    margin: 0 auto;
  }
  .mfx-ig-handle, .mfx-email-addr {
    white-space: normal;
    justify-content: center;
  }
  .mfx-ig-label::before, .mfx-email-label::after {
    display: none;
  }
}

/* ═════════════════════════════════════════════════════════════════════
   DUAL MARQUEE
   ═════════════════════════════════════════════════════════════════════ */
.mfx-marquee-block {
  position: relative;
  z-index: 2;
  margin-top: clamp(5rem, 10vw, 8rem);
  border-top: 1px solid rgba(244, 239, 230, 0.06);
  border-bottom: 1px solid rgba(244, 239, 230, 0.06);
  padding: clamp(1.5rem, 3vw, 2.75rem) 0;
  overflow: hidden;
}
.mfx-marquee-block::before,
.mfx-marquee-block::after {
  content: '';
  position: absolute;
  top: 0;
  width: 12%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}
.mfx-marquee-block::before {
  left: 0;
  background: linear-gradient(90deg, #0A0807 30%, transparent);
}
.mfx-marquee-block::after {
  right: 0;
  background: linear-gradient(-90deg, #0A0807 30%, transparent);
}

.mfx-marquee-row {
  display: flex;
  width: max-content;
  will-change: transform;
}
.mfx-marquee-row + .mfx-marquee-row {
  margin-top: 1.25rem;
}
.mfx-marquee-row-2 {
  opacity: 0.45;
}

.mfx-marquee-set {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.mfx-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: clamp(1.5rem, 4vw, 3rem);
  padding: 0 clamp(1rem, 2.5vw, 2rem);
}
.mfx-marquee-word {
  font-family: 'Times New Roman', 'EB Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 300;
  font-size: clamp(1.4rem, 3.5vw, 2.5rem);
  color: rgba(244, 239, 230, 0.7);
  letter-spacing: 0.005em;
  white-space: nowrap;
}
.mfx-marquee-row-2 .mfx-marquee-word {
  font-size: clamp(0.85rem, 1.6vw, 1.25rem);
  font-style: normal;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: rgba(244, 239, 230, 0.5);
}
.mfx-marquee-sep {
  color: rgba(230, 180, 95, 0.85);
  font-size: clamp(0.85rem, 1.8vw, 1.25rem);
  text-shadow: 0 0 12px rgba(230, 180, 95, 0.4);
}
.mfx-marquee-row-2 .mfx-marquee-sep {
  font-size: clamp(0.55rem, 1vw, 0.8rem);
  color: rgba(230, 180, 95, 0.5);
  text-shadow: none;
}

@media (max-width: 600px) {
  .mfx-marquee-row + .mfx-marquee-row { margin-top: 0.85rem; }
}

/* ═════════════════════════════════════════════════════════════════════
   BASE BAR
   ═════════════════════════════════════════════════════════════════════ */
.mfx-base {
  position: relative;
  z-index: 2;
  max-width: 1600px;
  margin: 0 auto;
  padding: clamp(1.75rem, 4vw, 2.75rem) clamp(1.25rem, 5vw, 5rem);
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.4);
  flex-wrap: wrap;
  justify-content: center;
}
.mfx-base-mark {
  font-family: 'Times New Roman', Georgia, serif;
  font-style: italic;
  font-size: 18px;
  letter-spacing: 0;
  color: rgba(230, 180, 95, 0.95);
  font-weight: 400;
  text-shadow: 0 0 12px rgba(230, 180, 95, 0.4);
  flex-shrink: 0;
}
.mfx-base-copy {
  opacity: 0.85;
  font-size: 10px;
}
.mfx-base-spacer { flex: 1; min-width: 1rem; }
.mfx-base-coords {
  color: rgba(244, 239, 230, 0.3);
  font-size: 10px;
  letter-spacing: 0.2em;
}
.mfx-base-meta {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}
.mfx-base-meta a {
  color: rgba(244, 239, 230, 0.4);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.4s ease;
}
.mfx-base-meta a:hover { color: rgba(230, 180, 95, 1); }
.mfx-base-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(244, 239, 230, 0.3);
}

@media (min-width: 701px) {
  .mfx-base { justify-content: flex-start; flex-wrap: nowrap; }
}

@media (max-width: 700px) {
  .mfx-base {
    flex-direction: column;
    text-align: center;
    gap: 0.85rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  .mfx-base-spacer { display: none; }
  .mfx-base-coords { font-size: 9px; }
}

/* ───────────── Reduced motion ───────────── */
@media (prefers-reduced-motion: reduce) {
  .mfx *,
  .mfx *::before,
  .mfx *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
  .mfx-cursor-orb { display: none; }
}
`;

/* ════════════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════════════ */
export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const igRef = useRef<HTMLAnchorElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const ctaDividerRef = useRef<HTMLDivElement>(null);
  const marqueeRow1Ref = useRef<HTMLDivElement>(null);
  const marqueeRow2Ref = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  /* Detect mobile */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  /* Floating dust — fewer, slower, single transform */
  useEffect(() => {
    if (!dustRef.current) return;
    const container = dustRef.current;
    const count = isMobile ? 8 : 18; // Reduced from 14/30
    const particles: HTMLElement[] = [];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'mfx-dust-particle';
      const size = Math.random() * 2 + 0.5;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.opacity = `${Math.random() * 0.5 + 0.1}`;
      p.style.boxShadow = `0 0 ${size * 4}px rgba(230, 180, 95, ${Math.random() * 0.3 + 0.15})`;
      container.appendChild(p);
      particles.push(p);

      gsap.to(p, {
        x: (Math.random() - 0.5) * 150,
        y: (Math.random() - 0.5) * 100,
        duration: Math.random() * 18 + 22, // Slower: 22-40s (was 14-26s)
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 8,
      });
    }

    return () => {
      particles.forEach((p) => {
        gsap.killTweensOf(p);
        p.remove();
      });
    };
  }, [isMobile]);

  /* Mouse-follow orb */
  useEffect(() => {
    if (isMobile || !orbRef.current || !rootRef.current) return;
    const orb = orbRef.current;
    const root = rootRef.current;

    const xTo = gsap.quickTo(orb, 'x', { duration: 1.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(orb, 'y', { duration: 1.4, ease: 'power3.out' });

    let active = false;
    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      if (e.clientY < rect.top - 300 || e.clientY > rect.bottom + 300) {
        if (active) {
          root.classList.remove('is-mouse-active');
          active = false;
        }
        return;
      }
      if (!active) {
        root.classList.add('is-mouse-active');
        active = true;
      }
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      root.classList.remove('is-mouse-active');
    };
  }, [isMobile]);

  /* Entrance animations + marquee */
  useEffect(() => {
    if (!stageRef.current) return;

    /* Initial states */
    gsap.set(reelRef.current?.children || [], { opacity: 0, y: 20 });
    gsap.set(subRef.current, { opacity: 0, y: 30 });
    gsap.set([igRef.current, emailRef.current], { opacity: 0, y: 30 });
    gsap.set(ctaDividerRef.current, { scaleY: 0, transformOrigin: '50% 50%' });
    gsap.set(baseRef.current, { opacity: 0, y: 20 });

    /* Timeline */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stageRef.current,
        start: 'top 80%',
        once: true,
      },
      defaults: { ease: 'expo.out' },
    });

    tl.to(reelRef.current?.children || [], {
      opacity: 1,
      y: 0,
      duration: 1.0,
      stagger: 0.08,
    }, 0)
      .to(subRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
      }, 0.2)
      .to(ctaDividerRef.current, {
        scaleY: 1,
        duration: 1.4,
        ease: 'expo.inOut',
      }, 0.4)
      .to(igRef.current, { opacity: 1, y: 0, duration: 1.0 }, 0.5)
      .to(emailRef.current, { opacity: 1, y: 0, duration: 1.0 }, 0.6)
      .to(baseRef.current, { opacity: 1, y: 0, duration: 1.0 }, 0.85);

    /* Dual marquee */
    let raf = 0;
    const speed1 = 24;
    const speed2 = 16;
    let x1 = 0;
    let x2 = 0;
    let last = performance.now();

    const setX1 = marqueeRow1Ref.current ? gsap.quickSetter(marqueeRow1Ref.current, 'x', 'px') : null;
    const setX2 = marqueeRow2Ref.current ? gsap.quickSetter(marqueeRow2Ref.current, 'x', 'px') : null;
    const half1 = () => marqueeRow1Ref.current ? marqueeRow1Ref.current.scrollWidth / 2 : 0;
    const half2 = () => marqueeRow2Ref.current ? marqueeRow2Ref.current.scrollWidth / 2 : 0;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      x1 -= speed1 * dt;
      x2 += speed2 * dt;
      const h1 = half1();
      const h2 = half2();
      if (h1 && x1 <= -h1) x1 += h1;
      if (h2 && x2 >= 0) x2 -= h2;
      if (setX1) setX1(x1);
      if (setX2) setX2(x2);
      raf = requestAnimationFrame(tick);
    };
    if (setX2) setX2(-half2());
    x2 = -half2();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  /* Magnetic hover */
  const magnetize = useCallback(
    (el: HTMLElement | null, e: React.MouseEvent, strength = 0.18) => {
      if (!el || isMobile) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      gsap.to(el, { x, y, duration: 0.7, ease: 'power3.out' });
    },
    [isMobile]
  );

  const demagnetize = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 1.0, ease: 'elastic.out(1, 0.4)' });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FOOTER_CSS }} />

      <footer
        ref={rootRef}
        id="contact"
        className="mfx"
      >
        {/* Atmosphere */}
        <div className="mfx-atmosphere" aria-hidden>
          <div className="mfx-base-grad" />
          <div className="mfx-amber-bloom" />
          <div className="mfx-side-glow-l" />
          <div className="mfx-side-glow-r" />
          <div className="mfx-mesh" />
          <div className="mfx-streaks" />
          <div className="mfx-grid" />
          <div className="mfx-grain" />
          <div className="mfx-vignette" />
        </div>

        {/* Floating dust */}
        <div ref={dustRef} className="mfx-dust" aria-hidden />

        {/* Cursor orb */}
        <div ref={orbRef} className="mfx-cursor-orb" aria-hidden />

        {/* Stage */}
        <div ref={stageRef} className="mfx-stage">
          {/* Top reel */}
          <div ref={reelRef} className="mfx-reel">
            <span className="mfx-reel-l">
              <span className="mfx-reel-marker">§</span>
              <span>End Reel</span>
              <span className="mfx-reel-dot" />
              <span>Vol. 07</span>
            </span>
            <span className="mfx-reel-line" />
            <span className="mfx-reel-r">
              <span>MMXXVI</span>
              <span className="mfx-reel-dot" />
              <span>12.965°N · 77.594°E</span>
            </span>
          </div>

          {/* Subline (centerpiece) */}
          <div ref={subRef} className="mfx-sub-block">
            <span className="mfx-sub-mark" aria-hidden />
            <p className="mfx-sub">
              Every frame an omission. Every silence a sentence. When the screen
              fades to black, the picture has only just begun to live.
            </p>
          </div>

          {/* Dual CTA */}
          <div className="mfx-cta-grid">
            <a
              ref={igRef}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram — ${INSTAGRAM_HANDLE}`}
              className="mfx-ig"
              onMouseMove={(e) => magnetize(igRef.current, e, 0.18)}
              onMouseLeave={() => demagnetize(igRef.current)}
            >
              <span className="mfx-ig-halo" aria-hidden />
              <span className="mfx-ig-label">Follow the journey</span>
              <span className="mfx-ig-handle">
                <span className="mfx-ig-text">
                  {INSTAGRAM_HANDLE}
                  <span className="mfx-ig-underline" aria-hidden />
                </span>
                <svg className="mfx-ig-icon" viewBox="0 0 24 24" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
                </svg>
              </span>
            </a>

            <div ref={ctaDividerRef} className="mfx-cta-divider" aria-hidden />

            <a
              ref={emailRef}
              href={`mailto:${EMAIL}`}
              onClick={(e) => handleEmailClick(e, EMAIL)}
              className="mfx-email"
              onMouseMove={(e) => magnetize(emailRef.current, e, 0.14)}
              onMouseLeave={() => demagnetize(emailRef.current)}
            >
              <span className="mfx-email-halo" aria-hidden />
              <span className="mfx-email-label">Begin the conversation</span>
              <span className="mfx-email-addr">
                {EMAIL}
                <span className="mfx-email-underline" aria-hidden />
                <svg className="mfx-email-arrow" viewBox="0 0 24 24" aria-hidden>
                  <path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </a>
          </div>
        </div>

        {/* Dual marquee */}
        <div className="mfx-marquee-block" aria-hidden>
          <div ref={marqueeRow1Ref} className="mfx-marquee-row">
            {[0, 1].map((set) => (
              <div className="mfx-marquee-set" key={`r1-${set}`}>
                {MARQUEE_TOP.map((w, i) => (
                  <span className="mfx-marquee-item" key={`r1-${set}-${i}`}>
                    <span className="mfx-marquee-word">{w}</span>
                    <span className="mfx-marquee-sep">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div ref={marqueeRow2Ref} className="mfx-marquee-row mfx-marquee-row-2">
            {[0, 1].map((set) => (
              <div className="mfx-marquee-set" key={`r2-${set}`}>
                {MARQUEE_BOTTOM.map((w, i) => (
                  <span className="mfx-marquee-item" key={`r2-${set}-${i}`}>
                    <span className="mfx-marquee-word">{w}</span>
                    <span className="mfx-marquee-sep">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Base */}
        <div ref={baseRef} className="mfx-base">
          <span className="mfx-base-mark">M</span>
          <span className="mfx-base-copy">
            © {new Date().getFullYear()} Meridian — Private Expeditions
          </span>
          <span className="mfx-base-spacer" />
          <span className="mfx-base-coords">N 12.965° / E 77.594°</span>
          <span className="mfx-base-meta">
            <a href="/privacy">Privacy</a>
            <span className="mfx-base-dot" />
            <a href="/terms">Terms</a>
            <span className="mfx-base-dot" />
            <a href="/security">Security</a>
          </span>
        </div>
      </footer>
    </>
  );
}