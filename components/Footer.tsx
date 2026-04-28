'use client';

import { useState, type FormEvent } from 'react';
import { cn } from '@/utils/cn';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function Footer() {
  const [status, setStatus] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);

    try {
      const data = new FormData(e.currentTarget);
      const payload = Object.fromEntries(data.entries());

      // Minimal client-side validation
      if (!payload.name || !payload.email) {
        throw new Error('Please include your name and email.');
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(payload.email))) {
        throw new Error('That email address does not look right.');
      }

      // Pretend network request — replace with your real endpoint.
      await new Promise((resolve) => setTimeout(resolve, 1100));

      setStatus('success');
      e.currentTarget.reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-ink-900 pt-24 pb-8 md:pt-32 md:pb-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, rgba(230,207,68,0.14) 0%, transparent 60%)',
        }}
      />

      <div className="container-fluid relative">
        <div className="mb-16 flex items-end justify-between border-t border-[var(--line)] pt-6">
          <p className="eyebrow">§ 06 — Enquire</p>
          <p className="eyebrow hidden md:block">By appointment only</p>
        </div>

        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="font-display text-6xl italic leading-[0.95] text-balance md:text-7xl">
              Where would you like to <span className="text-ember-400">disappear?</span>
            </h2>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-bone-200/80">
              Every brief is read by a human inside one working hour. Use as
              few words as you like — the less detail we receive, the more
              interesting the conversation tends to become.
            </p>

            <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-[var(--line)] pt-8 text-sm">
             <div>
  <dt className="eyebrow mb-2">India</dt>
  <dd>
    <a href="tel:+9119544325050" className="text-bone-100 hover:text-ember-400 transition-colors duration-300">
      +919 54 432 5050
    </a>
  </dd>
</div>
<div>
  <dt className="eyebrow mb-2">Email</dt>
  <dd>
    <a href="mailto:desk@meridian.aero" className="text-bone-100 hover:text-ember-400 transition-colors duration-300">
      desk@meridian.aero
    </a>
  </dd>
</div>
<div>
  <dt className="eyebrow mb-2">Operations</dt>
  <dd className="text-bone-100">24 / 7 / 365</dd>
</div>
            </dl>
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="md:col-span-5 md:col-start-8"
          >
            <fieldset
              disabled={status === 'submitting'}
              className="space-y-5 disabled:opacity-60"
            >
              <InputField label="Name" name="name" autoComplete="name" required />
              <InputField label="Email" name="email" type="email" autoComplete="email" required />
              <InputField label="Phone" name="phone" type="tel" autoComplete="tel" />
              <InputField label="Destination" name="destination" placeholder="City, country, or coordinates" />
              <div>
                <label className="eyebrow mb-2 block">Brief</label>
                <textarea
                  name="brief"
                  rows={4}
                  placeholder="As much or as little as you like."
                  className="w-full resize-none border border-[var(--line)] bg-transparent p-4 text-base leading-relaxed text-bone-100 placeholder:text-bone-400 focus:border-ember-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className={cn(
                  'group flex w-full items-center justify-between gap-4 rounded-full bg-bone-100 px-6 py-5 text-sm uppercase tracking-[0.28em] text-ink-950 transition-[background,color] duration-300',
                  'hover:bg-ember-500 hover:text-ink-950',
                )}
              >
                <span>
                  {status === 'submitting'
                    ? 'Sending…'
                    : status === 'success'
                      ? 'Sent — we will be in touch'
                      : 'Submit brief'}
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-4 w-4 transition-transform duration-500 ease-soft group-hover:translate-x-1"
                >
                  <path
                    d="M3 12h18M13 5l8 7-8 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>

              <p
                role="status"
                aria-live="polite"
                className={cn(
                  'min-h-[1.25rem] font-mono text-[11px] uppercase tracking-superwide',
                  status === 'error' ? 'text-ember-400' : 'text-bone-400',
                )}
              >
                {status === 'error'
                  ? (errorMessage ?? 'Something went wrong.')
                  : status === 'success'
                    ? 'Your brief has been received.'
                    : 'By submitting you agree to our privacy terms.'}
              </p>
            </fieldset>
          </form>
        </div>

        <div className="mt-24 flex flex-col gap-6 border-t border-[var(--line)] pt-8 text-xs text-bone-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Bengaluru India.
          </p>
          <ul className="flex items-center gap-6">
            <li>
              <a className="hover:text-bone-100 transition-colors" href="/privacy">
                Privacy
              </a>
            </li>
            <li>
              <a className="hover:text-bone-100 transition-colors" href="/terms">
                Terms
              </a>
            </li>
            <li>
              <a className="hover:text-bone-100 transition-colors" href="/security">
                Security
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div>
      <label className="eyebrow mb-2 block">{label}</label>
      <input
        {...props}
        className="w-full border-b border-[var(--line)] bg-transparent py-3 text-base text-bone-100 placeholder:text-bone-400 focus:border-ember-500 focus:outline-none"
      />
    </div>
  );
}
