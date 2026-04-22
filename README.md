# Meridian — Immersive Scroll Experience

A production-grade, cinematic, scroll-driven website built with **Next.js 14 (App Router)**, **GSAP ScrollTrigger**, **Lenis**, and **Tailwind CSS**.

The centerpiece is a pinned, canvas-based frame-by-frame sequence (151 pre-rendered WebPs) that scrubs with the scroll position — Apple-product-page style — wrapped in an editorial layout with side-by-side hero videos, a premium loader, a glass navbar, and several content sections.

---

## Quickstart

```bash
# 1. Install
npm install

# 2. Run the dev server
npm run dev
# → open http://localhost:3000

# 3. Production build
npm run build
npm run start
```

> Requires **Node.js 18.17+** (Node 20 LTS recommended).

Other useful scripts:

```bash
npm run lint       # Next/ESLint
npm run typecheck  # tsc --noEmit
```

---

## Folder structure

```
meridian/
├── app/
│   ├── globals.css           # Tailwind + design tokens + grain + resets
│   ├── layout.tsx            # Fonts (Fraunces / Manrope / JetBrains Mono), metadata
│   ├── page.tsx              # Composition root (renders <PageShell />)
│   ├── global-error.tsx      # Route-level error boundary
│   └── not-found.tsx         # 404
│
├── components/
│   ├── PageShell.tsx         # Client shell — orchestrates loader + sections
│   ├── Loader.tsx            # Premium loading screen with preload progress
│   ├── Navbar.tsx            # Sticky blur nav + hide-on-scroll + mobile drawer
│   ├── HeroVideos.tsx        # Side-by-side hero videos, scroll parallax
│   ├── FrameScrollCanvas.tsx # Pinned canvas + GSAP frame-sequence scrub
│   ├── IntroSection.tsx      # Manifesto with word-by-word reveal
│   ├── StatsSection.tsx      # Counting-up stats grid
│   ├── FeaturesSection.tsx   # Aircraft specs + accessible accordion
│   ├── DestinationsMarquee.tsx
│   ├── Footer.tsx            # Contact form w/ validation + submit states
│   └── LenisProvider.tsx     # Smooth-scroll provider synced to GSAP ticker
│
├── hooks/
│   ├── useFramePreloader.ts  # Bounded-concurrency image preloader
│   ├── useGsap.ts            # gsap.context() cleanup hook
│   └── useMediaQuery.ts      # SSR-safe media query
│
├── utils/
│   ├── cn.ts                 # clsx wrapper
│   └── frames.ts             # Single source of truth for frame paths
│
├── public/
│   ├── frames/
│   │   ├── desktop/          # 0000.webp … 0150.webp  (1600w)
│   │   └── mobile/           # 0000.webp … 0150.webp  (900w)
│   └── videos/
│       ├── hero-1.mp4
│       ├── hero-1-poster.jpg
│       ├── hero-2.mp4
│       └── hero-2-poster.jpg
│
├── package.json
├── tsconfig.json
├── next.config.mjs           # Immutable caching for /frames and /videos
├── tailwind.config.ts        # Custom ink/bone/ember palette
├── postcss.config.mjs
├── .eslintrc.json
├── .gitignore
└── next-env.d.ts
```

---

## How the scroll sequence works

1. **`utils/frames.ts`** is the single source of truth — 151 frames, paths for `desktop` and `mobile` variants.
2. **`useMediaQuery`** picks the right variant at runtime.
3. **`useFramePreloader`** downloads all 151 URLs in parallel (configurable concurrency), uses `img.decode()` when available, tolerates a small fraction of failures, and fills any gaps with the nearest successful neighbour so the canvas draw loop never sees `undefined`.
4. **`Loader.tsx`** mirrors the preloader's `progress` value until it reaches 1, then plays its clip-path exit animation.
5. **`FrameScrollCanvas.tsx`** pins a 100svh stage inside a tall section. A single GSAP `ScrollTrigger` with `scrub: 0.4` maps the scroll progress to a frame index (`0 → 150`), and on every `onUpdate` we draw the corresponding `HTMLImageElement` into a `<canvas>` (retina-sized via `devicePixelRatio`, resized via `ResizeObserver`).
6. **`LenisProvider`** drives the scroll from GSAP's ticker so Lenis and ScrollTrigger stay in perfect sync — no double RAF, no desync.

---

## Performance notes

- **Aggressive asset caching.** `/frames/*` and `/videos/*` get `Cache-Control: public, max-age=31536000, immutable` via `next.config.mjs`.
- **Two frame sizes.** Desktop loads 1600w (~42 KB/frame), mobile loads 900w (~19 KB/frame). Total desktop payload for the sequence is ~6.3 MB, mobile ~2.9 MB.
- **Progressive hint.** First dozen frames are requested with `fetchpriority="high"`, the rest `"low"`.
- **Canvas, not `<img>` swap.** Avoids flicker and layout thrash that plague DOM-based sequence players.
- **Dynamic imports** for heavy sections (SSR-disabled) keep the first server response lean.
- **`prefers-reduced-motion`** disables Lenis and snaps all animations to their end state.

---

## Regenerating the frames

The 151 frames live in `public/frames/{desktop,mobile}/`. If you replace the source video, regenerate them with ffmpeg:

```bash
# 1. Extract all frames from your source
ffmpeg -i source.mp4 -q:v 2 raw/frame_%04d.jpg

# 2. Pick N evenly-spaced frames and resize to two WebP sizes.
#    Use the snippet under /scripts/generate-frames.py if you keep one,
#    or adapt the inline Python block from the project write-up.

# 3. Update TOTAL_FRAMES in utils/frames.ts to match the new count.
```

---

## Known caveats

- Autoplaying hero videos are `muted + playsInline` to satisfy iOS/Chrome policies. If playback still fails, the component gracefully falls back to the poster image.
- The frame sequence runs at `scrub: 0.4` (a small smoothing lag). Set `scrub: true` in `FrameScrollCanvas.tsx` for a 1:1 mapping, or raise it for a more cinematic drift.
- `prefers-reduced-motion` disables Lenis but does not disable the pinned scroll — ScrollTrigger still snaps frames to native scroll, which is correct per the WCAG motion guidance.

---

## License

This scaffold is provided as a starting point. All generated frames and videos are derived from the user-supplied source video.
