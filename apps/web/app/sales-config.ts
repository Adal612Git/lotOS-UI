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

export const foundersOffer = {
  label: "Founders price",
  limitLabel: "First 20 customers",
  summary: "Phase 1 launch pricing stays locked only for the first 20 customers.",
};

export const salesVerificationMarkers = ["Buy Solo", "Buy Pro", "Book Launch Pack"];

export const salesPlans: SalesPlan[] = [
  {
    id: "free",
    name: "Free Surface",
    priceLabel: "$0",
    summary: "A richer public foundation for serious evaluation, trust-building, and adoption before buyers move into the private tiers.",
    audience: "Engineers, founders, and technical evaluators who need real public value before they commit to a paid acceleration tier.",
    features: [
      "@lotosui/core, claude-arm, cli, sentinel, and web-components in the public MIT layer",
      "Public docs, runtime guides, design references, and desktop demos for broader technical validation",
      "CLI scaffolding, contracts, and adoption-safe trust surface for serious first evaluation",
      "A complete no-payment entry point that still feels like a real product surface instead of a teaser only",
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
    priceLabel: "MX$59 / mes",
    summary: "A premium monthly entry tier for one operator who wants private proof, not just public docs.",
    audience: "Freelancers, indie builders, and solo founders who need fast premium validation assets.",
    features: [
      "Founders launch pricing locked for one of the first 20 customers",
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
    priceLabel: "MX$129 / mes",
    summary: "The serious operating tier for teams that need a private product surface they can actually deploy, present, and reuse.",
    audience: "Agencies, startups, and internal platform teams that need premium assets with real implementation weight.",
    features: [
      "Founders launch pricing locked for one of the first 20 customers",
      "Everything in Solo plus the real protected Pro bundle instead of preview-only proof",
      "Industry kits, signature layouts, Pro manifests, and spreadsheet modernization kits for recurring delivery",
      "Pro-only desktop template catalog, reusable implementation packs, and stronger private vault unlocks",
      "Built to feel like a complete paid product instead of a simple gated add-on",
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
    name: "Full Signature",
    priceLabel: "MX$249 / mes",
    summary: "The complete premium suite: an executive-grade operator package with the richest launch surfaces, delivery polish, and commercial presence.",
    audience: "Buyers who want the most complete end-to-end product feeling, with exclusive surfaces that go beyond the Pro layer.",
    features: [
      "Founders launch pricing locked for one of the first 20 customers",
      "Everything in Pro plus six full-suite-only surfaces that do not exist in the Pro tier",
      "Google Sheets, Microsoft 365 Excel Web, and Outlook command surfaces for premium modernization offers",
      "Executive boardroom, Power BI visual pack, and Figma token sync assets reserved for the highest tier",
      "Highest-priority commercial polish designed to feel complete, exclusive, and boardroom-ready from day one",
    ],
    kind: "paid",
    ctaLabel: "Enter Full Signature",
    href: launchCheckout.href,
    external: launchCheckout.external,
    checkoutHint: launchCheckout.checkoutHint,
    paymentActions: launchCheckout.paymentActions,
  },
];

export const freeSurface = [
  "Public MIT packages for adoption and trust, with enough real utility to validate fit before buying",
  "Docs, runtime guides, design references, and public demos that make the platform easier to understand quickly",
  "CLI scaffolding and schema-backed contracts available in the public layer for serious technical evaluation",
  "A richer trust layer that helps paid tiers feel more credible because the buyer can clearly inspect the public baseline first",
  "No exclusivity claim on open packages, keeping the line between public value and premium delivery clear",
];

export const paidSurface = [
  "Private premium asset packs served behind authenticated vault access",
  "Three paid tiers in a founders launch window reserved for the first 20 customers",
  "Premium Preview pack for pre-sale proof and internal QA",
  "Exclusive layouts, industry kits, spreadsheet upgrades, and Full Signature operator surfaces",
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
  "Solo buys confidence, Pro buys implementation speed, and Full Signature buys the most complete premium experience.",
  "Phase 1 founders pricing is intentionally limited to the first 20 customers who lock in early.",
  "Full Signature reserves integrated premium surfaces for Sheets, Microsoft 365, Outlook, Power BI, and Figma that are not included in Pro.",
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
