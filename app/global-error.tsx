'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error in the browser console. A real app would ship this to
    // an observability endpoint (Sentry, Datadog, etc).
    console.error('[meridian] unexpected error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0A0807', color: '#F4ECD8' }}>
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '2rem',
            fontFamily:
              'ui-serif, Georgia, "Fraunces", "Iowan Old Style", serif',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: 520 }}>
            <p
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontSize: 12,
                color: '#B09A75',
                marginBottom: 24,
              }}
            >
              Meridian — Disruption
            </p>
            <h1
              style={{
                fontSize: '3rem',
                lineHeight: 1,
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              The signal was lost.
            </h1>
            <p
              style={{
                marginTop: 16,
                opacity: 0.8,
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                fontSize: 16,
              }}
            >
              Something unexpected happened while rendering this page. Try
              again — our systems usually recover on the next attempt.
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: 32,
                padding: '14px 24px',
                borderRadius: 999,
                background: '#E2893A',
                color: '#0A0807',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
