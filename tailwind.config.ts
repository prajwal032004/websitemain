import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm cinematic palette pulled from the footage
        ink: {
          950: '#0A0807',
          900: '#0E0B09',
          800: '#14100D',
          700: '#1D1713',
          600: '#2A211B',
          500: '#3A2E26',
        },
        bone: {
          50: '#FBF6EC',
          100: '#F4ECD8',
          200: '#E8DDC3',
          300: '#D6C7A6',
          400: '#B09A75',
        },
        ember: {
          400: '#F0A055',
          500: '#E2893A',
          600: '#C46B22',
          700: '#8E4A14',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-manrope)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        ultratight: '-0.04em',
        superwide: '0.32em',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
        silk: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s var(--ease-soft, cubic-bezier(0.22,1,0.36,1)) both',
        marquee: 'marquee 45s linear infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
