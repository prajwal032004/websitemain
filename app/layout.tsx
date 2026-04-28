import type { Metadata, Viewport } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import LenisProvider from '@/components/LenisProvider';
import LogoLoader from '@/components/LogoLoader';
import Navbar from '@/components/Navbar';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
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
  icons: {
    icon: [
      { url: '/xicon.ico', sizes: 'any' },
      { url: '/xicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/xicon.ico',
    apple: '/xicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/xicon.ico" sizes="any" />
      </head>
      <body className="antialiased">
        {/* Protection Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('contextmenu', (e) => e.preventDefault());
              document.addEventListener('keydown', (e) => {
                if (
                  e.key === 'F12' ||
                  (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                  (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S'))
                ) {
                  e.preventDefault();
                }
              });
            `,
          }}
        />
        <LenisProvider>
          <LogoLoader />
          <Navbar />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}