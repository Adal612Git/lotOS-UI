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

const fallbackPreview = "/pricing#premium-preview";

const linkOrFallback = (value: string | undefined, fallback: string) => {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
};

export const salesLinks = {
  free: "/docs/installation",
  solo: linkOrFallback(process.env.LOTOS_SOLO_CHECKOUT_URL, fallbackContact),
  pro: linkOrFallback(process.env.LOTOS_PRO_CHECKOUT_URL, fallbackContact),
  launchPack: linkOrFallback(process.env.LOTOS_LAUNCH_PACK_URL, fallbackDemo),
  premiumPreview: linkOrFallback(process.env.LOTOS_PREMIUM_PREVIEW_URL, fallbackPreview),
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
    priceLabel: "$29",
    summary: "Commercial previews and light private access for a single operator.",
    audience: "Freelancers, indie builders, and solo technical founders.",
    features: [
      "Protected preview downloads",
      "Solo access to controlled evaluation assets",
      "Upgrade path into Pro and Launch",
    ],
    kind: "paid",
    ctaLabel: "Buy Solo",
    href: salesLinks.solo,
    external: true,
  },
  {
    id: "pro",
    name: "Pro License",
    priceLabel: "$79",
    summary: "Team-focused bundle with protected packs, layouts, and spreadsheet kits.",
    audience: "Agencies, startups, and internal platform teams.",
    features: [
      "Protected `packages/pro` delivery surface",
      "Industry kits, layouts, and Pro manifests",
      "Desktop template Pro surface and spreadsheet kits",
    ],
    kind: "paid",
    ctaLabel: "Buy Pro",
    href: salesLinks.pro,
    external: true,
  },
  {
    id: "launch-pack",
    name: "Launch Pack",
    priceLabel: "$149",
    summary: "Fastest path from payment to a private deliverable you can hand off to a client.",
    audience: "Customers who want a starter, not just access.",
    features: [
      "Everything in Pro",
      "Customer-specific starter or handoff packaging",
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
  "Premium Preview pack for pre-sale proof and internal QA",
  "Excel and OpenOffice spreadsheet upgrade kits",
];

export const premiumPreviewSurface = [
  "Evaluation-only preview bundle from the private pro surface",
  "Manifest, previews, and selected premium metadata without full private payload",
  "Internal QA proof so you can inspect exactly what a paid buyer would see first",
  "Useful as a pre-sale trust asset before delivering the full private ZIP",
  "Includes premium spreadsheet UI previews for Excel and OpenOffice modernization pitches",
];

export const premiumReasonsToPay = [
  "Paid buyers get private assets that are not distributed through the public MIT layer.",
  "The launch pack collapses time-to-delivery by bundling a curated private payload plus customer-specific starter output.",
  "You can prove the premium surface before purchase with a controlled preview, then deliver the full private release after payment.",
  "The free layer builds trust; the paid layer buys speed, polish, and private acceleration.",
];

export const checkoutEnvKeys = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "AUTH_SECRET",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "LEMON_WEBHOOK_SECRET",
  "LEMON_SOLO_VARIANT_ID",
  "LEMON_PRO_VARIANT_ID",
  "LEMON_LAUNCH_VARIANT_ID",
  "LOTOS_OWNER_EMAILS",
  "LOTOS_CONTACT_SALES_URL",
  "LOTOS_BOOKING_URL",
  "LOTOS_SOLO_CHECKOUT_URL",
  "LOTOS_PRO_CHECKOUT_URL",
  "LOTOS_LAUNCH_PACK_URL",
  "LOTOS_PREMIUM_PREVIEW_URL",
];
