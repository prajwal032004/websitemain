import type { Metadata } from 'next';
import Link from 'next/link';
import EmailLink from '@/components/EmailLink';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Meridian collects, handles, and protects your personal information.',
};

const PRINCIPLES = [
  {
    number: '01',
    heading: 'Minimum collection',
    copy: 'We collect only what the expedition requires. No tracking pixels. No advertising networks. No third-party analytics with access to identifiable data.',
  },
  {
    number: '02',
    heading: 'Human access only',
    copy: 'Your file is accessible to the nine members of the operations desk and, where required, the flight crew. No automated profiling. No algorithmic scoring.',
  },
  {
    number: '03',
    heading: 'Your data is not a product',
    copy: 'Meridian has no advertising revenue. We do not sell, rent, or trade client data under any circumstances.',
  },
];

const SECTIONS = [
  {
    index: '01',
    title: 'Who we are',
    body: [
      'Meridian Aviation SA ("Meridian", "we", "our") is incorporated under Swiss law, registered in the Canton of Geneva (CHE-492.183.457). We are the data controller for all personal information processed under this policy.',
      "Meridian's operations desk is reachable at privacy@meridian.aero. We do not have a separate Data Protection Officer because our processing is neither large-scale nor systematic — it is deliberately narrow.",
    ],
  },
  {
    index: '02',
    title: 'What we collect',
    body: [
      'Identity data: full name, date of birth, nationality, and passport details as required for flight manifests and customs declarations.',
      'Contact data: email address, telephone number, and a mailing address if invoicing requires one.',
      'Travel data: origin and destination, preferred routing, dietary requirements, pet details, and any special handling instructions you provide.',
      'Payment data: we process payments through our banking partner. We do not store card numbers or banking credentials ourselves.',
      'Correspondence: emails, briefs, and notes from conversations with the operations desk, kept to ensure service continuity.',
    ],
  },
  {
    index: '03',
    title: 'Why we collect it',
    body: [
      'Contract performance: your identity and travel data are necessary to execute the charter agreement — without them, we cannot legally operate the flight.',
      'Legal compliance: aviation law across multiple jurisdictions requires us to hold and transmit passenger manifests to border authorities. We have no discretion in this.',
      'Legitimate interests: retaining correspondence and preferences allows the operations desk to serve returning clients efficiently and to resolve any post-flight disputes.',
      'We do not use your data for marketing without explicit, separately obtained consent. There is no opt-out because there is no opt-in.',
    ],
  },
  {
    index: '04',
    title: 'Who we share it with',
    body: [
      'Border control and immigration agencies in flight-plan countries, as mandated by law.',
      'Aircraft handling agents at departure and arrival airports, limited to manifest data required for ground operations.',
      'Our Swiss banking partner for payment processing. They are bound by FINMA regulation and Swiss banking secrecy.',
      'Legal advisers and auditors where required for regulatory compliance, under strict confidentiality.',
      'No marketing partners, data brokers, or analytics companies ever receive access to your data.',
    ],
  },
  {
    index: '05',
    title: 'International transfers',
    body: [
      'Flight operations by definition involve cross-border data sharing with aviation authorities in the relevant jurisdictions. These transfers are required by law and cannot be refused without cancelling the flight.',
      "All other international transfers — for example, to our banking partner's systems in Luxembourg — are protected by Swiss Federal Data Protection Act (nFADP) adequacy standards or equivalent contractual safeguards.",
    ],
  },
  {
    index: '06',
    title: 'Retention',
    body: [
      'Manifest data is retained for ten years as required by Swiss aviation regulation. Financial records are retained for eleven years under Swiss commercial law.',
      'Correspondence and preference data is retained for five years from the date of your last flight, after which it is deleted from our systems unless you request earlier deletion.',
      'You may request deletion of any data not subject to a statutory retention requirement. We will confirm the deletion in writing within thirty days.',
    ],
  },
  {
    index: '07',
    title: 'Your rights',
    body: [
      'Under the Swiss nFADP and, where applicable, the EU GDPR, you have the right to access your personal data, correct inaccuracies, request deletion subject to legal hold obligations, object to processing, and receive a portable copy of your data in a machine-readable format.',
      'To exercise any of these rights, write to privacy@meridian.aero from the email address on your client file. We respond within thirty calendar days. There is no charge for a first request in any twelve-month period.',
      'If you believe we have mishandled your data, you have the right to lodge a complaint with the Swiss Federal Data Protection and Information Commissioner (FDPIC).',
    ],
  },
  {
    index: '08',
    title: 'Cookies & this website',
    body: [
      'Meridian.aero does not use advertising cookies, social tracking pixels, or third-party analytics. We use one first-party session cookie to remember your language preference across visits. It expires at the end of your browser session.',
      'Our server logs retain IP addresses for seven days for security purposes. They are not used for analytics or profiling.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-ink-950 text-bone-100">
      {/* Header */}
      <div className="container-fluid pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="border-t border-[var(--line)] pt-6">
          <div className="flex items-end justify-between mb-12 md:mb-20">
            <p className="eyebrow">§ Legal — Privacy</p>
            <p className="eyebrow hidden md:block">Effective 1 January 2025</p>
          </div>
          <h1 className="font-display text-[13vw] italic leading-[0.90] tracking-tighter text-balance md:text-[8vw]">
            Privacy<br />
            <span className="text-ember-400">Policy.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-bone-200/75 md:text-lg">
            Your data exists because a flight is happening. Not because we want to sell you
            something. Here is what we hold, why we hold it, and the exact moment we delete it.
          </p>
        </div>
      </div>

      {/* Principles — three-up */}
      <div className="container-fluid pb-20 md:pb-28">
        <div className="grid gap-px bg-[var(--line)] border border-[var(--line)] md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.number} className="bg-ink-950 p-8 md:p-10 space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-400">
                {p.number}
              </span>
              <h2 className="font-display text-xl italic text-ember-400">
                {p.heading}
              </h2>
              <p className="text-sm leading-relaxed text-bone-200/75">{p.copy}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="container-fluid pb-32 md:pb-48">
        <div className="border-t border-[var(--line)]">
          {SECTIONS.map((s) => (
            <div
              key={s.index}
              className="grid gap-8 border-b border-[var(--line)] py-12 md:grid-cols-12 md:py-16"
            >
              <div className="md:col-span-4">
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-xs tabular-nums text-bone-400">{s.index}</span>
                  <h2 className="font-display text-2xl italic text-bone-100 leading-tight md:text-3xl">
                    {s.title}
                  </h2>
                </div>
              </div>
              <div className="space-y-4 md:col-span-7 md:col-start-6">
                {s.body.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-bone-200/80 md:text-base">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-20 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-6 space-y-6">
            <p className="text-sm leading-relaxed text-bone-400">
              Privacy enquiries:{' '}
              <EmailLink email="privacy@meridian.aero" className="text-bone-100 hover:text-ember-400 transition-colors">
                privacy@meridian.aero
              </EmailLink>
              {' '}— we respond in plain language, within thirty days.
            </p>
            <div className="flex flex-wrap gap-6 pt-4 border-t border-[var(--line)]">
              <Link href="/terms" className="eyebrow hover:text-bone-100 transition-colors">
                Terms of Service →
              </Link>
              <Link href="/security" className="eyebrow hover:text-bone-100 transition-colors">
                Security →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}