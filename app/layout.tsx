import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope, JetBrains_Mono } from 'next/font/google';
import LenisProvider from '@/components/LenisProvider';
import LogoLoader from '@/components/LogoLoader';
import Navbar from '@/components/Navbar';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
  style: ['normal', 'italic'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
});

export const viewport: Viewport = {
  themeColor: '#0A0807',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://meridian.example.com'),
  title: {
    default: 'Meridian — Private Expeditions',
    template: '%s / Meridian',
  },
  description:
    'Meridian operates a single Gulfstream G650ER on permanent standby. Private, human-led expeditions to the places that do not fit on itineraries.',
  keywords: [
    'private jet',
    'private aviation',
    'bespoke travel',
    'Gulfstream G650ER',
    'expedition',
  ],
  openGraph: {
    title: 'Meridian — Private Expeditions',
    description: 'A single aircraft. A crew of eleven. The horizon you choose.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meridian — Private Expeditions',
    description: 'A single aircraft. A crew of eleven. The horizon you choose.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        <LenisProvider>
          <LogoLoader />
          <Navbar />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}