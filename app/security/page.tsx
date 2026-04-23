import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security',
  description: 'How Meridian protects your data, your identity, and your operations.',
};

const PILLARS = [
  {
    number: '01',
    label: 'Infrastructure',
    heading: 'Swiss-hosted. Air-gapped operations.',
    copy: 'All client data is stored on servers physically located in Switzerland, subject to Swiss data-residency law. Our operations system is not accessible from the public internet.',
  },
  {
    number: '02',
    label: 'Transmission',
    heading: 'Encrypted end-to-end.',
    copy: 'All data in transit uses TLS 1.3. Emails containing manifest or payment data are PGP-encrypted by default. We will share our public key on request.',
  },
  {
    number: '03',
    label: 'Access',
    heading: 'Nine people. No exceptions.',
    copy: 'Meridian has nine permanent operations desk staff. Each holds a named account with hardware-key two-factor authentication. No shared credentials exist.',
  },
  {
    number: '04',
    label: 'Physical',
    heading: 'Aircraft secured at all times.',
    copy: 'HB-MRD is hangared at Geneva Cointrin under CCTV and access-controlled conditions when not operational. Ground crew are background-checked.',
  },
];

const SECTIONS = [
  {
    index: '01',
    title: 'Our security posture',
    body: [
      'Meridian operates a deliberately small attack surface. The operations system is a private network accessible only via hardware-key authenticated VPN from registered devices. There is no public API, no self-service portal, and no third-party login integration.',
      'We retain an independent Swiss penetration testing firm to conduct a full assessment annually. The last assessment was completed in October 2024 with zero critical findings. Our security posture is reviewed quarterly by the managing director.',
    ],
  },
  {
    index: '02',
    title: 'Data security',
    body: [
      'All client data at rest is encrypted with AES-256. Encryption keys are managed separately from the data they protect, held in a hardware security module that has never been connected to the internet.',
      'Database access is logged and audited. Any query returning client data generates an automatic entry in the audit log, reviewed weekly by the operations manager.',
      'Backups are taken daily, encrypted using the same key management infrastructure, and stored in a geographically separate Swiss data centre. Backup integrity is tested monthly.',
    ],
  },
  {
    index: '03',
    title: 'Communications security',
    body: [
      'The operations desk is contactable by phone and email. Email containing sensitive client information — manifests, passport data, medical details — is PGP-encrypted by default. To send us encrypted mail, request our public key at security@meridian.aero.',
      'Our phone system uses end-to-end encrypted VoIP for all international calls. Calls to and from clients are not recorded without explicit consent.',
      'We never request sensitive information by SMS or through any unencrypted channel. If you receive such a request purportedly from Meridian, treat it as fraudulent and contact the operations desk immediately.',
    ],
  },
  {
    index: '04',
    title: 'Identity & access management',
    body: [
      'Every Meridian staff member with access to client data holds an individually issued hardware security key (YubiKey 5 Series). Passwords alone cannot grant system access.',
      'Access permissions follow the principle of least privilege. Crew members see only the manifest for their assigned flight. Finance sees only billing records. Only the operations manager and managing director hold full-scope access.',
      'Former employees have their access revoked within one hour of departure. We run an automated daily reconciliation against our HR system to catch any discrepancy.',
    ],
  },
  {
    index: '05',
    title: 'Incident response',
    body: [
      'In the event of a confirmed data breach affecting client information, we will notify affected clients within seventy-two hours by phone and encrypted email, using language that is specific and honest about what was accessed.',
      'We will simultaneously notify the Swiss Federal Data Protection and Information Commissioner (FDPIC) and, where applicable, relevant EU supervisory authorities under Article 33 GDPR.',
      'Post-incident, we publish an anonymised incident report within thirty days, accessible at this URL, describing root cause, scope, and remediation steps. We do not issue vague "we take security seriously" statements.',
    ],
  },
  {
    index: '06',
    title: 'Aviation & operational security',
    body: [
      'Meridian complies with IS-BAO Stage III standards, the highest voluntary safety framework for business aviation. Our safety management system is audited every two years by an ICAO-accredited assessor.',
      'Passenger manifests are transmitted to border authorities via the APIS (Advance Passenger Information System) protocol. No additional copies are retained by third-party handling agents beyond their statutory obligation.',
      'All flight crew hold current EASA type ratings and undergo recurrent simulator training every six months at a certified CAE facility. Security background checks are conducted annually.',
    ],
  },
  {
    index: '07',
    title: 'Responsible disclosure',
    body: [
      "If you discover a security vulnerability affecting Meridian's systems or operations, we ask you to disclose it responsibly. Contact security@meridian.aero with a description of the issue. We will acknowledge receipt within twenty-four hours and respond substantively within seven days.",
      'We do not pursue legal action against good-faith security researchers. We will credit you by name in our incident log if you wish, and provide a reasonable reward for findings that lead to a meaningful security improvement.',
      'Please do not access, modify, or exfiltrate client data during your research. Limit testing to systems you own or have explicit permission to test.',
    ],
  },
];

export default function SecurityPage() {
  return (
    <main className="relative min-h-screen bg-ink-950 text-bone-100">
      {/* Header */}
      <div className="container-fluid pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="border-t border-[var(--line)] pt-6">
          <div className="flex items-end justify-between mb-12 md:mb-20">
            <p className="eyebrow">§ Legal — Security</p>
            <p className="eyebrow hidden md:block">IS-BAO Stage III — EASA compliant</p>
          </div>
          <h1 className="font-display text-[13vw] italic leading-[0.90] tracking-tighter text-balance md:text-[8vw]">
            Security &<br />
            <span className="text-ember-400">Trust.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-bone-200/75 md:text-lg">
            Our clients trust us with their names, their routes, and sometimes their lives.
            This page describes exactly what we do to justify that trust — technically, operationally,
            and in writing.
          </p>
        </div>
      </div>

      {/* Four pillars — grid */}
      <div className="container-fluid pb-20 md:pb-28">
        <div className="grid gap-px bg-[var(--line)] border border-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.number} className="bg-ink-950 p-8 md:p-10 space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-400">
                  {p.number}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-superwide text-ember-500/70">
                  {p.label}
                </span>
              </div>
              <h2 className="font-display text-xl italic text-bone-100 leading-tight">
                {p.heading}
              </h2>
              <p className="text-sm leading-relaxed text-bone-200/70">{p.copy}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="container-fluid pb-20">
        <div className="border border-[var(--line)] bg-ink-900 p-6 md:p-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#4ade80] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-superwide text-bone-100">
              All systems operational
            </span>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-10">
            {[
              ['Last pentest', 'Oct 2024'],
              ['Last backup test', 'Apr 2025'],
              ['IS-BAO audit', 'Mar 2024'],
              ['Incidents (12 mo)', 'Zero'],
            ].map(([label, val]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="font-mono text-[10px] uppercase tracking-superwide text-bone-400">
                  {label}
                </span>
                <span className="font-display text-base italic text-bone-100">{val}</span>
              </div>
            ))}
          </div>
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
              Security reports and responsible disclosure:{' '}
              <a
                href="mailto:security@meridian.aero"
                className="text-bone-100 hover:text-ember-400 transition-colors"
              >
                security@meridian.aero
              </a>
            </p>
            <div className="flex flex-wrap gap-6 pt-4 border-t border-[var(--line)]">
              <Link href="/terms" className="eyebrow hover:text-bone-100 transition-colors">
                Terms of Service →
              </Link>
              <Link href="/privacy" className="eyebrow hover:text-bone-100 transition-colors">
                Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}