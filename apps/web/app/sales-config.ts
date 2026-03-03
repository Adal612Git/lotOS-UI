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
  checkoutHint: string;
  paymentActions: PaymentAction[];
};

export type PaymentAction = {
  label: string;
  href: string;
  external: boolean;
  tone: "primary" | "ghost" | "paypal";
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

function buildPaidActions(input: {
  checkoutUrl?: string;
  paypalUrl?: string;
  fallbackUrl: string;
  fallbackLabel: string;
}) {
  const checkoutUrl = input.checkoutUrl?.trim();
  const paypalUrl = input.paypalUrl?.trim();
  const paymentActions: PaymentAction[] = [];

  if (checkoutUrl) {
    paymentActions.push({
      label: "Activar acceso ahora",
      href: checkoutUrl,
      external: true,
      tone: "primary",
    });
  }

  if (paypalUrl) {
    paymentActions.push({
      label: "Pagar con PayPal",
      href: paypalUrl,
      external: true,
      tone: "paypal",
    });
  }

  if (paymentActions.length === 0) {
    paymentActions.push({
      label: input.fallbackLabel,
      href: input.fallbackUrl,
      external: true,
      tone: "ghost",
    });
  }

  const primaryAction = paymentActions[0]!;

  return {
    href: primaryAction.href,
    external: primaryAction.external,
    paymentActions,
    checkoutHint: checkoutUrl
      ? paypalUrl
        ? "Checkout principal listo para activar acceso. PayPal queda como respaldo."
        : "Checkout principal listo para activar acceso mensual."
      : paypalUrl
        ? "PayPal listo como via de cobro. Agrega un checkout principal cuando quieras."
        : "Sin checkout directo configurado. El flujo cae a contacto manual.",
  };
}

const soloCheckout = buildPaidActions({
  checkoutUrl: process.env.LOTOS_SOLO_CHECKOUT_URL,
  paypalUrl: process.env.LOTOS_SOLO_PAYPAL_URL,
  fallbackUrl: fallbackContact,
  fallbackLabel: "Contactar para cobrar Solo",
});

const proCheckout = buildPaidActions({
  checkoutUrl: process.env.LOTOS_PRO_CHECKOUT_URL,
  paypalUrl: process.env.LOTOS_PRO_PAYPAL_URL,
  fallbackUrl: fallbackContact,
  fallbackLabel: "Contactar para cobrar Pro",
});

const launchCheckout = buildPaidActions({
  checkoutUrl: process.env.LOTOS_LAUNCH_PACK_URL,
  paypalUrl: process.env.LOTOS_LAUNCH_PACK_PAYPAL_URL,
  fallbackUrl: fallbackDemo,
  fallbackLabel: "Agendar cierre manual",
});

export const salesLinks = {
  free: "/docs/installation",
  solo: soloCheckout.href,
  pro: proCheckout.href,
  launchPack: launchCheckout.href,
  premiumPreview: linkOrFallback(process.env.LOTOS_PREMIUM_PREVIEW_URL, fallbackPreview),
  contact: fallbackContact,
  demo: fallbackDemo,
};

export const salesPlans: SalesPlan[] = [
  {
    id: "free",
    name: "Free Surface",
    priceLabel: "$0",
    summary: "Public MIT layer for evaluation, trust-building, and technical validation.",
    audience: "Engineers validating the platform before moving into a paid acceleration tier.",
    features: [
      "@lotosui/core, claude-arm, cli, sentinel, and web-components",
      "Public docs, runtime guides, and desktop demos",
      "CLI scaffolding, contracts, and adoption-safe trust surface",
    ],
    kind: "free",
    ctaLabel: "Start Free",
    href: salesLinks.free,
    external: false,
    checkoutHint: "Free access. No payment required.",
    paymentActions: [
      {
        label: "Abrir gratis",
        href: salesLinks.free,
        external: false,
        tone: "ghost",
      },
    ],
  },
  {
    id: "solo",
    name: "Solo Access",
    priceLabel: "MX$29 / mes",
    summary: "A premium monthly entry tier for one operator who wants private proof, not just public docs.",
    audience: "Freelancers, indie builders, and solo founders who need fast premium validation assets.",
    features: [
      "Buyer-only vault access for one operator",
      "Premium previews, sales proof decks, and controlled evaluation assets",
      "Monthly access to private trust materials without opening the full Pro payload",
    ],
    kind: "paid",
    ctaLabel: "Start Solo",
    href: soloCheckout.href,
    external: soloCheckout.external,
    checkoutHint: soloCheckout.checkoutHint,
    paymentActions: soloCheckout.paymentActions,
  },
  {
    id: "pro",
    name: "Pro Studio",
    priceLabel: "MX$79 / mes",
    summary: "The core paid tier for teams that want the real private bundle, premium kits, and production-facing assets.",
    audience: "Agencies, startups, and internal platform teams that need reusable premium delivery assets.",
    features: [
      "Everything in Solo plus the real protected Pro asset surface",
      "Industry kits, signature layouts, Pro manifests, and spreadsheet modernization kits",
      "Pro-only desktop template catalog and higher-value private bundle unlocks",
    ],
    kind: "paid",
    ctaLabel: "Upgrade to Pro",
    href: proCheckout.href,
    external: proCheckout.external,
    checkoutHint: proCheckout.checkoutHint,
    paymentActions: proCheckout.paymentActions,
  },
  {
    id: "launch-pack",
    name: "Launch Signature",
    priceLabel: "MX$149 / mes",
    summary: "The top tier: a premium launch command room with founder-grade assets, handoff intelligence, and exclusive release polish.",
    audience: "Buyers who want the strongest private surface, launch-ready polish, and premium operator confidence.",
    features: [
      "Everything in Pro plus the private launch control surface",
      "Signature handoff playbooks, launch-room assets, and premium rollout materials",
      "Highest-priority commercial polish designed to feel exclusive from day one",
    ],
    kind: "paid",
    ctaLabel: "Enter Launch Signature",
    href: launchCheckout.href,
    external: launchCheckout.external,
    checkoutHint: launchCheckout.checkoutHint,
    paymentActions: launchCheckout.paymentActions,
  },
];

export const freeSurface = [
  "Public MIT packages for adoption and trust",
  "Docs, runtime guides, and public demos",
  "No exclusivity claim on open packages",
];

export const paidSurface = [
  "Private premium asset packs served behind authenticated vault access",
  "Three paid tiers with escalating monthly value from proof to production to launch polish",
  "Premium Preview pack for pre-sale proof and internal QA",
  "Exclusive layouts, industry kits, spreadsheet upgrades, and launch-grade control assets",
];

export const premiumPreviewSurface = [
  "Evaluation-only preview bundle from the private pro surface",
  "Manifest, previews, and selected premium metadata without full private payload",
  "Internal QA proof so you can inspect exactly what a paid buyer would see first",
  "Useful as a pre-sale trust asset before delivering the full private ZIP",
  "Includes premium spreadsheet UI previews for Excel and OpenOffice modernization pitches",
];

export const premiumReasonsToPay = [
  "Paid buyers unlock a private vault surface that does not ship through the public MIT layer.",
  "Solo buys confidence, Pro buys execution speed, and Launch Signature buys the highest commercial polish.",
  "You can show controlled proof before purchase, then unlock progressively richer premium surfaces after payment.",
  "The free layer earns trust; the paid tiers sell exclusivity, speed, presentation quality, and protected access.",
];

export const checkoutEnvKeys = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "AUTH_SECRET",
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "LOTOS_OWNER_EMAILS",
  "LOTOS_CONTACT_SALES_URL",
  "LOTOS_BOOKING_URL",
  "LOTOS_SOLO_CHECKOUT_URL",
  "LOTOS_SOLO_PAYPAL_URL",
  "LOTOS_PRO_CHECKOUT_URL",
  "LOTOS_PRO_PAYPAL_URL",
  "LOTOS_LAUNCH_PACK_URL",
  "LOTOS_LAUNCH_PACK_PAYPAL_URL",
  "LOTOS_PREMIUM_PREVIEW_URL",
];
