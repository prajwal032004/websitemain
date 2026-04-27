export const SERVICES = [
    {
        slug: 'private-charter',
        index: '01',
        category: 'Aviation',
        title: 'Private Charter',
        tagline: 'The sky, entirely yours',
        description:
            'Bespoke point-to-point charter aboard ultra-long-range jets. Zero compromise on timing, routing, or onboard experience.',
        stat: '180+ aircraft',
        statLabel: 'managed fleet',
        accentHex: '#E2893A',
    },
    {
        slug: 'curated-expeditions',
        index: '02',
        category: 'Journeys',
        title: 'Curated Expeditions',
        tagline: 'Depth over distance',
        description:
            'Multi-week itineraries built around access: private cultural escorts, closed archaeological sites, and off-season sanctuaries.',
        stat: '60+ countries',
        statLabel: 'active routes',
        accentHex: '#7FADD9',
    },
    {
        slug: 'desert-wind',
        index: '03',
        category: 'Experiences',
        title: 'Desert Wind',
        tagline: 'Silence as a destination',
        description:
            'Remote desert camps designed for complete sensory surrender — no signal, no crowds, just open sky and ancient geology.',
        stat: '14 erg camps',
        statLabel: 'across 3 deserts',
        accentHex: '#C4804A',
    },
    {
        slug: 'concierge',
        index: '04',
        category: 'Ground',
        title: 'Concierge & Ground',
        tagline: 'Every detail, anticipated',
        description:
            'Twenty-four-hour dedicated travel managers. Immigration facilitation, armoured transfers, villa buyouts, and beyond.',
        stat: '24 / 7 / 365',
        statLabel: 'dedicated desk',
        accentHex: '#8FC4A2',
    },
    {
        slug: 'film-production',
        index: '05',
        category: 'Content',
        title: 'Film & Production',
        tagline: 'The world as your set',
        description:
            'End-to-end location production: permits, logistics, local crews, and aerial units — anywhere in the world, at any scale.',
        stat: '300+ shoots',
        statLabel: 'produced since 2018',
        accentHex: '#D4A4A4',
    },
    {
        slug: 'membership',
        index: '06',
        category: 'Access',
        title: 'Meridian Membership',
        tagline: 'A circle without tiers',
        description:
            'A single, highly selective membership. Annual retainer unlocks the full suite of services, priority routing, and confidential rates.',
        stat: '< 400 members',
        statLabel: 'globally',
        accentHex: '#A89AC4',
    },
] as const;

export type Service = (typeof SERVICES)[number];
