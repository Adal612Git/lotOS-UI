export type SalesPlan = {
  id: string;
  name: string;
  priceLabel: string;
  summary: string;
  audience: string;
  features: string[];
  kind: "free" | "paid";
  ctaLabel: string;
  href: string;
  external?: boolean;
};

const fallbackContact =
  process.env.LOTOS_CONTACT_SALES_URL?.trim() ||
  "https://github.com/Adal612Git/lotOS-UI/issues/new";

const fallbackDemo =
  process.env.LOTOS_BOOKING_URL?.trim() ||
  fallbackContact;

const linkOrFallback = (value: string | undefined, fallback: string) => {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
};

export const salesLinks = {
  free: "/docs/installation",
  solo: linkOrFallback(process.env.LOTOS_SOLO_CHECKOUT_URL, fallbackContact),
  pro: linkOrFallback(process.env.LOTOS_PRO_CHECKOUT_URL, fallbackContact),
  launchPack: linkOrFallback(process.env.LOTOS_LAUNCH_PACK_URL, fallbackDemo),
  contact: fallbackContact,
  demo: fallbackDemo,
};

export const salesPlans: SalesPlan[] = [
  {
    id: "free",
    name: "Free Surface",
    priceLabel: "$0",
    summary: "Public MIT layer for evaluation, adoption, and technical validation.",
    audience: "Engineers testing the platform before buying implementation velocity.",
    features: [
      "@lotosui/core, claude-arm, cli, sentinel, and web-components",
      "Public docs and desktop demos",
      "CLI scaffolding and contract validation",
    ],
    kind: "free",
    ctaLabel: "Start Free",
    href: salesLinks.free,
  },
  {
    id: "solo",
    name: "Solo License",
    priceLabel: "from $149",
    summary: "Private buyer tier for a single operator who wants proprietary acceleration.",
    audience: "Freelancers, indie builders, and solo technical founders.",
    features: [
      "Commercial use of proprietary starter packs",
      "Access to private pro bundle delivery",
      "First-step premium layouts and previews",
    ],
    kind: "paid",
    ctaLabel: "Buy Solo",
    href: salesLinks.solo,
    external: true,
  },
  {
    id: "pro",
    name: "Pro License",
    priceLabel: "custom / higher tier",
    summary: "Team-focused bundle with deeper private assets and faster delivery paths.",
    audience: "Agencies, startups, and internal platform teams.",
    features: [
      "Private pro bundle with premium assets",
      "Reusable layouts and industry packs",
      "Faster onboarding for repeated client delivery",
    ],
    kind: "paid",
    ctaLabel: "Buy Pro",
    href: salesLinks.pro,
    external: true,
  },
  {
    id: "launch-pack",
    name: "Launch Pack",
    priceLabel: "service + asset bundle",
    summary: "Fastest path from payment to a private deliverable you can ship to a client.",
    audience: "Customers who want a starter, not just access.",
    features: [
      "Curated pro bundle",
      "Customer-specific starter from stack-init or desktop-init",
      "Private ZIP or private repository delivery",
    ],
    kind: "paid",
    ctaLabel: "Book Launch Pack",
    href: salesLinks.launchPack,
    external: true,
  },
];

export const freeSurface = [
  "Public MIT packages for adoption and trust",
  "Docs, runtime guides, and public demos",
  "No exclusivity claim on open packages",
];

export const paidSurface = [
  "Private pro asset packs",
  "Launch Pack delivery flow",
  "Customer-specific starters and implementation acceleration",
];

export const checkoutEnvKeys = [
  "LOTOS_CONTACT_SALES_URL",
  "LOTOS_BOOKING_URL",
  "LOTOS_SOLO_CHECKOUT_URL",
  "LOTOS_PRO_CHECKOUT_URL",
  "LOTOS_LAUNCH_PACK_URL",
];
