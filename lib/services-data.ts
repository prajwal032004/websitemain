import { framePath } from '@/utils/frames';

export type ServiceDetail = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  headline: string;
  description: string;
  longDescription: string;
  features: { label: string; detail: string }[];
  stats: { value: string; label: string }[];
  note: string;
  thumb: string;
  accentThumb: string;
  flip?: boolean;
  next: string; // slug of next service
};

export const SERVICES_DATA: ServiceDetail[] = [
  {
    slug: 'charter',
    index: '01',
    title: 'Private Charter',
    tagline: 'Your route. Your schedule.',
    headline: 'Wheels-up in seventy minutes.',
    description:
      'One call. A dedicated ops team confirms availability, files the flight plan, and arranges everything before you finish the sentence.',
    longDescription:
      'Private charter is not a luxury. It is a multiplier on everything else you do. When a meeting in Geneva runs late and you still need to be in Tokyo by morning, we have already started the paperwork. Our ops team operates in two time zones simultaneously, and the aircraft is positioned at your home base whenever possible — so the only thing between you and departure is a ten-minute drive.\n\nThere are no shared manifests, no standby lists, no negotiated routes. The aircraft is yours from briefing to block-off.',
    features: [
      { label: '70-minute commitment', detail: 'From first call to wheels-up, verified by our operations log.' },
      { label: 'Full aircraft', detail: '12 passengers + 1 dedicated cabin attendant. No shared manifest.' },
      { label: '24/7/365 operations', detail: 'Our desk has never been unmanned. Not once in thirteen years.' },
      { label: 'Global clearances', detail: 'Permits, overflights, customs, and slot requests — handled before you ask.' },
      { label: 'Pet manifest', detail: 'Full documentation for up to four animals. We have vet contacts in 40 countries.' },
    ],
    stats: [
      { value: '70 min', label: 'Response to departure' },
      { value: '174', label: 'Countries served' },
      { value: '5,243', label: 'Missions flown' },
    ],
    note: 'Available from Geneva and Dubai primary bases, with delivery positioning worldwide.',
    thumb: framePath(20),
    accentThumb: framePath(30),
    next: 'expeditions',
  },
  {
    slug: 'expeditions',
    index: '02',
    title: 'Bespoke Expeditions',
    tagline: 'Beyond the known world.',
    headline: 'We plan voyages that do not have brochures.',
    description:
      'From a 4 AM landing in the Atacama to a week camped on the edge of the Namib. We brief, plan, and fly.',
    longDescription:
      'An expedition is a brief that arrives as a feeling, not a destination. A client once sent us a photograph of a valley they had seen in a documentary and asked if we could land there. We could. We did.\n\nMeridian handles every dimension of the expedition: the route, the permissions, the ground logistics, the contingency planning, the medical kit, the satellite comms. We coordinate with local operators, government agencies, and field scientists when the mission requires it. The only thing you manage is the experience itself.\n\nWe have landed on unpaved strips in Kazakhstan, private beaches in Mozambique, a frozen lake in Lapland, and a government airfield in Western Sahara that officially did not accept foreign aircraft. We are not bragging. We are establishing a baseline.',
    features: [
      { label: 'End-to-end planning', detail: 'From your brief to your return, every detail is managed.' },
      { label: 'Remote clearances', detail: 'Off-charter strips, restricted airspace, government liaison.' },
      { label: '174-country network', detail: 'Ground partners, fixers, and local operators across six continents.' },
      { label: 'Medical contingency', detail: 'Medical kits, remote medic coordination, and evacuation protocols.' },
      { label: 'Documentary support', detail: 'Camera crew logistics, location permits, satellite uplinks.' },
    ],
    stats: [
      { value: '5 days', label: 'Average planning window' },
      { value: '18 hrs', label: 'Emergency activation' },
      { value: '6', label: 'Continents reached' },
    ],
    note: 'Every expedition is briefed, costed, and confirmed before we accept it. We do not take missions we cannot execute.',
    thumb: framePath(70),
    accentThumb: framePath(80),
    flip: true,
    next: 'cargo',
  },
  {
    slug: 'cargo',
    index: '03',
    title: 'Cargo & Air Logistics',
    tagline: 'When time is the cargo.',
    headline: 'Critical freight does not wait for commercial schedules.',
    description:
      'Pharmaceutical shipments, medical evacuations, confidential asset transfers. Speed and discretion.',
    longDescription:
      'The word "urgent" means something different on a commercial freight manifest than it does on ours. On ours, it means the aircraft is boarding now.\n\nWe handle cargo that cannot be delayed, cannot be misdirected, and cannot be discussed in an open channel. This includes pharmaceuticals requiring cold-chain continuity, organs for transplant, government-sensitive materials, and assets whose value makes commercial routing inadvisable.\n\nEvery cargo mission is managed by a named operations director who is the single point of contact from collection to delivery. No handoffs, no chain of custody gaps, no lost parcels.',
    features: [
      { label: 'Same-day dispatch', detail: 'Time-critical freight prioritised above all else.' },
      { label: 'Medical priority', detail: 'Organ transport, pharmaceutical cold-chain, humanitarian cargo.' },
      { label: 'DGR qualified', detail: 'IATA Dangerous Goods Regulations qualified for hazmat handling.' },
      { label: 'Cold-chain', detail: 'Temperature-controlled loading and continuous monitoring.' },
      { label: 'Diplomatic protocols', detail: 'Pouch handling, sealed container freight, government liaison.' },
    ],
    stats: [
      { value: 'Named', label: 'Ops director per mission' },
      { value: '0', label: 'Lost or misdirected shipments' },
      { value: '24/7', label: 'Cold-chain monitoring' },
    ],
    note: 'Cargo operations are quoted per-mission. No standard rate card. Enquire via private brief.',
    thumb: framePath(100),
    accentThumb: framePath(110),
    next: 'concierge',
  },
  {
    slug: 'concierge',
    index: '04',
    title: 'Air Concierge',
    tagline: 'Everything arranged. Nothing forgotten.',
    headline: 'Most clients stop thinking about logistics the moment they call us.',
    description:
      'Catering, ground transportation, hotel rooms, visas, pet paperwork, restaurant reservations. One team, one contact.',
    longDescription:
      'The flight is the simplest part. What happens before you board and after you land is where most private travel breaks down. Meridian\'s concierge team closes that gap entirely.\n\nWe have a standing relationship with fourteen restaurants worldwide that do not normally accept after-hours catering requests. We know which hotels in Doha will accommodate a last-minute suite change at 2 AM. We know which immigration lanes at which airports will process our clients first. None of this is magic. It is thirteen years of careful relationship management.\n\nFor Meridian Access members, concierge services are included at no additional cost and are activated automatically with every booking.',
    features: [
      { label: 'Ground logistics', detail: 'Transfers, helicopters, and ground transport at origin and destination.' },
      { label: 'Bespoke catering', detail: 'In-flight meals from your nominated restaurant or our chef network.' },
      { label: 'Visa & immigration', detail: 'Pre-clearance, expedited processing, documentation preparation.' },
      { label: 'Accommodation', detail: 'Hotel booking, suite upgrades, and property access worldwide.' },
      { label: 'Always-on support', detail: '24-hour ground coordination for anything that arises in transit.' },
    ],
    stats: [
      { value: '14+', label: 'Exclusive restaurant partners' },
      { value: '24 hrs', label: 'Concierge availability' },
      { value: 'Included', label: 'For Access members' },
    ],
    note: 'Concierge services are billed per-engagement for charter clients and included for Meridian Access members.',
    thumb: framePath(130),
    accentThumb: framePath(120),
    flip: true,
    next: 'access',
  },
  {
    slug: 'access',
    index: '05',
    title: 'Meridian Access',
    tagline: 'Permanent readiness. Priority always.',
    headline: 'An annual membership that places our aircraft in your permanent reserve.',
    description:
      'First-position reservation, dedicated account director, accelerated departure, unlimited concierge. No surprises.',
    longDescription:
      'Meridian Access is not a subscription. It is an operating arrangement. You retain first call on the aircraft for the duration of your membership year. Our team learns your preferences before you have to state them. Your account director is available on a direct line at any hour.\n\nThe economics are straightforward: members fly more, plan less, and pay less per hour than on-demand clients. The savings on ground logistics alone typically cover a significant portion of the annual fee. The rest is bought in something harder to quantify: the certainty that when you need the aircraft, it is there.\n\nAccess is offered by invitation. If you are considering it, you are almost certainly already eligible.',
    features: [
      { label: 'First-position guarantee', detail: 'The aircraft is yours before any other booking is confirmed.' },
      { label: 'Dedicated director', detail: 'One person, one direct number, thirteen years of institutional knowledge.' },
      { label: '50-minute departure', detail: 'Accelerated protocol for Access members — 20 minutes faster than standard.' },
      { label: 'Unlimited concierge', detail: 'All concierge services included, automatically activated with every booking.' },
      { label: 'Annual expedition credit', detail: 'One curated expedition route per year, planned and operated at cost.' },
    ],
    stats: [
      { value: '50 min', label: 'Guaranteed departure' },
      { value: '1', label: 'Dedicated director' },
      { value: 'Invitation', label: 'Only by application' },
    ],
    note: 'Meridian Access is offered by invitation and confirmed annually. Current availability: 2 positions.',
    thumb: framePath(145),
    accentThumb: framePath(140),
    next: 'charter',
  },
];

export function getService(slug: string): ServiceDetail | undefined {
  return SERVICES_DATA.find((s) => s.slug === slug);
}

export function getNextService(currentSlug: string): ServiceDetail | undefined {
  const current = getService(currentSlug);
  if (!current) return undefined;
  return getService(current.next);
}
