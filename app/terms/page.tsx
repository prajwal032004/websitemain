import type { Metadata } from 'next';
import Link from 'next/link';
import EmailLink from '@/components/EmailLink';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions governing your engagement with Meridian Private Expeditions.',
};

const SECTIONS = [
  {
    index: '01',
    title: 'Engagement & acceptance',
    body: [
      'By submitting an expedition brief, making any payment, or boarding any aircraft operated by or on behalf of Meridian Aviation SA ("Meridian"), you agree to be bound by these Terms of Service in their entirety. If you are engaging on behalf of a corporate entity, you represent that you have authority to bind that entity.',
      "These terms form the complete agreement between you and Meridian and supersede any prior correspondence, term sheet, or verbal understanding. Meridian reserves the right to amend these terms with thirty days' written notice to registered clients.",
    ],
  },
  {
    index: '02',
    title: 'Services & scope',
    body: [
      'Meridian provides private aviation charter, expedition planning, concierge logistics, and ancillary services as agreed in each individual flight brief. All services are rendered on a bespoke basis; no two engagements are identical, and no precedent is implied by prior service.',
      'Meridian operates a single Gulfstream G650ER registration HB-MRD under Swiss Air-Operator Certificate CH-AOC-148. Any sub-charter, wet-lease, or third-party operator arrangement will be disclosed in writing and is subject to separate operator terms.',
      'Meridian does not guarantee availability. Permanent standby is a commercial commitment and operational aspiration — force majeure events, regulatory groundings, and mandatory maintenance may affect scheduled departures.',
    ],
  },
  {
    index: '03',
    title: 'Pricing & payment',
    body: [
      'All pricing is quoted in Swiss Francs (CHF) unless expressly agreed otherwise. Quotes are valid for seventy-two hours from issue and are subject to fuel-price adjustment beyond that window.',
      'A non-refundable booking deposit of fifty percent (50%) of the total charter fee is required to hold a departure slot. The remaining balance is due no later than seventy-two hours before wheels-up. Fuel surcharges, permit fees, and extraordinary handling costs are invoiced separately within fifteen days of the return leg.',
      'Late payment beyond seven days of the invoice due date accrues interest at five percent per annum above the Swiss National Bank reference rate.',
    ],
  },
  {
    index: '04',
    title: 'Cancellation & changes',
    body: [
      'Cancellations made more than fourteen days before the scheduled departure receive a refund of the balance less the booking deposit. Cancellations within fourteen days of departure are non-refundable.',
      'Date and routing changes are accommodated subject to availability and may incur re-quoting of fuel, overflight, and crew positioning costs. Meridian will always seek the most cost-efficient alternative and present options in writing before charging.',
      'In the event Meridian cancels a confirmed departure for operational reasons within our control, clients receive a full refund of all monies paid, including the booking deposit.',
    ],
  },
  {
    index: '05',
    title: 'Passenger obligations',
    body: [
      'Passengers are responsible for holding valid travel documents — passports, visas, and any applicable health declarations — for all territories in the flight plan. Meridians concierge team will advise on requirements but cannot be held liable for denied entry arising from incomplete documentation.',
      'No controlled substances, prohibited firearms, or items violating IATA dangerous goods regulations may be carried. Meridian reserves the right to refuse carriage to any passenger or cargo deemed a safety or legal risk, without refund.',
      'Passengers travelling with animals must provide current veterinary health certificates. Up to four animals are permitted on board with prior written approval.',
    ],
  },
  {
    index: '06',
    title: 'Liability & indemnity',
    body: [
      "Meridian's liability for personal injury or death arising from flight operations is governed by the Montreal Convention (1999) and is subject to its limits and conditions. For non-aviation services — ground transport, hotel provisioning, expedition logistics — liability is limited to the value of the specific service charged.",
      'Meridian is not liable for indirect, consequential, or economic losses including but not limited to missed connections, business opportunity losses, or reputational harm arising from any delay or service failure.',
      'You agree to indemnify and hold Meridian harmless from any claims, costs, and damages arising from your breach of these terms or your conduct on board.',
    ],
  },
  {
    index: '07',
    title: 'Confidentiality',
    body: [
      'Meridian treats all client engagement as strictly confidential. We do not disclose client identities, routes, or manifests to any third party except as required by law, aviation regulation, or border authority.',
      "Clients agree to maintain the confidentiality of any pricing, crew information, or operational methods disclosed during the engagement. Media inquiries relating to a specific flight require Meridian's prior written consent.",
    ],
  },
  {
    index: '08',
    title: 'Governing law & disputes',
    body: [
      'These terms are governed by Swiss law, without regard to conflict-of-law principles. Any dispute arising from or relating to these terms shall first be submitted to good-faith mediation under the Swiss Chamber of Commerce rules.',
      'If mediation fails, disputes shall be resolved by arbitration before a sole arbitrator in Geneva, Switzerland. The language of proceedings shall be English. Judgment on any arbitral award may be entered in any court of competent jurisdiction.',
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="relative min-h-screen bg-ink-950 text-bone-100">
      {/* Header */}
      <div className="container-fluid pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="border-t border-[var(--line)] pt-6">
          <div className="flex items-end justify-between mb-12 md:mb-20">
            <p className="eyebrow">§ Legal — Terms</p>
            <p className="eyebrow hidden md:block">Effective 1 January 2025</p>
          </div>
          <h1 className="font-display text-[13vw] italic leading-[0.90] tracking-tighter text-balance md:text-[8vw]">
            Terms of<br />
            <span className="text-ember-400">Service.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-bone-200/75 md:text-lg">
            Meridian Aviation SA is registered in Geneva, Switzerland. These terms
            govern every engagement — from your first brief to your last touchdown.
            Please read them. They are written to be understood.
          </p>
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
              <div className="space-y-5 md:col-span-7 md:col-start-6">
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
              For questions regarding these terms, contact our legal desk at{' '}
              <EmailLink email="legal@meridian.aero" className="text-bone-100 hover:text-ember-400 transition-colors">
                legal@meridian.aero
              </EmailLink>.
            </p>
            <div className="flex flex-wrap gap-6 pt-4 border-t border-[var(--line)]">
              <Link href="/privacy" className="eyebrow hover:text-bone-100 transition-colors">
                Privacy Policy →
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