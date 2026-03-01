export interface SalesPlan {
  id: 'solo' | 'pro' | 'launch_pack';
  name: string;
  priceLabel: string;
  summary: string;
  features: string[];
  href: string;
}

const fallbackContact =
  process.env.LOTOS_CONTACT_SALES_URL?.trim() ||
  'https://github.com/Adal612Git/lotOS-UI/issues/new';

const fallbackDemo =
  process.env.LOTOS_BOOKING_URL?.trim() ||
  fallbackContact;

const normalizeLink = (value: string | undefined, fallback: string) => {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
};

export const salesLinks = {
  solo: normalizeLink(process.env.LOTOS_SOLO_CHECKOUT_URL, fallbackContact),
  pro: normalizeLink(process.env.LOTOS_PRO_CHECKOUT_URL, fallbackContact),
  launchPack: normalizeLink(process.env.LOTOS_LAUNCH_PACK_URL, fallbackDemo),
  contact: fallbackContact,
};

export const docsSalesPlans: readonly SalesPlan[] = [
  {
    id: 'solo',
    name: 'Solo',
    priceLabel: '$29',
    summary: 'For previews, evaluation assets, and first paid access.',
    features: [
      'Commercial preview downloads',
      'Evaluation-only protected materials',
      'Upgrade path into Pro',
    ],
    href: salesLinks.solo,
  },
  {
    id: 'pro',
    name: 'Pro',
    priceLabel: '$79',
    summary: 'For the real protected surface: kits, layouts, and premium delivery prep.',
    features: [
      'Protected kits and premium assets',
      'Excel and OpenOffice pro kits',
      'Desktop template pro access',
    ],
    href: salesLinks.pro,
  },
  {
    id: 'launch_pack',
    name: 'Launch Pack',
    priceLabel: '$149',
    summary: 'For the fastest client-ready handoff with curated premium delivery.',
    features: [
      'Everything in Pro',
      'Launch-ready handoff path',
      'Private delivery and starter packaging',
    ],
    href: salesLinks.launchPack,
  },
];
