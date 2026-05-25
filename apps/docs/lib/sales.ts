export interface SalesPlan {
  id: 'solo' | 'pro' | 'launch_pack';
  name: string;
  priceLabel: string;
  summary: string;
  features: string[];
  href: string;
  checkoutHint: string;
  paymentActions: PaymentAction[];
}

export interface PaymentAction {
  label: string;
  href: string;
  tone: 'primary' | 'ghost' | 'paypal';
}

const fallbackContact =
  process.env.LOTOS_CONTACT_SALES_URL?.trim() ||
  'https://github.com/Adal612Git/lotOS-UI/issues/new';

const fallbackDemo =
  process.env.LOTOS_BOOKING_URL?.trim() ||
  fallbackContact;

function isLemonCheckoutUrl(value: string | undefined): boolean {
  const normalized = value?.trim();

  if (!normalized) {
    return false;
  }

  try {
    const url = new URL(normalized);
    return /(^|\.)lemonsqueezy\.com$/i.test(url.hostname);
  } catch {
    return false;
  }
}

function buildPaidActions(input: {
  checkoutUrl?: string;
  paypalUrl?: string;
  fallbackUrl: string;
  fallbackLabel: string;
}) {
  const checkoutUrl = input.checkoutUrl?.trim();
  const paypalUrl = input.paypalUrl?.trim();
  const automaticUnlockSupportedForCheckout =
    Boolean(checkoutUrl) &&
    Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY)) &&
    Boolean(
      process.env.LEMON_WEBHOOK_SECRET &&
      process.env.LEMON_SOLO_VARIANT_ID &&
      process.env.LEMON_PRO_VARIANT_ID &&
      process.env.LEMON_LAUNCH_VARIANT_ID
    ) &&
    isLemonCheckoutUrl(checkoutUrl);
  const paymentActions: PaymentAction[] = [];

  if (checkoutUrl) {
    paymentActions.push({
      label: 'Activar acceso ahora',
      href: checkoutUrl,
      tone: 'primary',
    });
  }

  if (paypalUrl) {
    paymentActions.push({
      label: 'Pagar con PayPal',
      href: paypalUrl,
      tone: 'paypal',
    });
  }

  if (paymentActions.length === 0) {
    paymentActions.push({
      label: input.fallbackLabel,
      href: input.fallbackUrl,
      tone: 'ghost',
    });
  }

  const primaryAction = paymentActions[0]!;

  return {
    href: primaryAction.href,
    paymentActions,
    checkoutHint: checkoutUrl
      ? automaticUnlockSupportedForCheckout
        ? paypalUrl
          ? 'Checkout principal listo. El acceso se activa automaticamente despues del pago; PayPal queda como respaldo.'
          : 'Checkout principal listo. El acceso se activa automaticamente despues del pago.'
        : paypalUrl
          ? 'Checkout principal listo, pero este proveedor no desbloquea acceso automatico todavia. PayPal queda como respaldo.'
          : 'Checkout principal listo, pero este proveedor no desbloquea acceso automatico todavia.'
      : paypalUrl
        ? 'PayPal listo como via de cobro. El checkout principal sigue opcional.'
        : 'Sin checkout directo configurado. El flujo cae a contacto manual.',
  };
}

const soloCheckout = buildPaidActions({
  checkoutUrl: process.env.LOTOS_SOLO_CHECKOUT_URL,
  paypalUrl: process.env.LOTOS_SOLO_PAYPAL_URL,
  fallbackUrl: fallbackContact,
  fallbackLabel: 'Contactar para cobrar Solo',
});

const proCheckout = buildPaidActions({
  checkoutUrl: process.env.LOTOS_PRO_CHECKOUT_URL,
  paypalUrl: process.env.LOTOS_PRO_PAYPAL_URL,
  fallbackUrl: fallbackContact,
  fallbackLabel: 'Contactar para cobrar Pro',
});

const launchCheckout = buildPaidActions({
  checkoutUrl: process.env.LOTOS_LAUNCH_PACK_URL,
  paypalUrl: process.env.LOTOS_LAUNCH_PACK_PAYPAL_URL,
  fallbackUrl: fallbackDemo,
  fallbackLabel: 'Agendar cierre manual',
});

export const salesLinks = {
  solo: soloCheckout.href,
  pro: proCheckout.href,
  launchPack: launchCheckout.href,
  contact: fallbackContact,
};

export const docsSalesPlans: readonly SalesPlan[] = [
  {
    id: 'solo',
    name: 'Solo Access',
    priceLabel: 'MX$59 / mes (placeholder)',
    summary: 'Founders launch entry tier for private proof, evaluation assets, and buyer-only monthly access.',
    features: [
      'Founders launch pricing locked for one of the first 20 customers',
      'Buyer-only vault access for one operator',
      'Commercial preview downloads and evaluation-only protected materials',
      'The lightest paid tier before stepping into Pro',
    ],
    href: soloCheckout.href,
    checkoutHint: soloCheckout.checkoutHint,
    paymentActions: soloCheckout.paymentActions,
  },
  {
    id: 'pro',
    name: 'Pro Studio',
    priceLabel: 'MX$129 / mes (placeholder)',
    summary: 'The main founders tier: protected kits, layouts, and private production-facing assets.',
    features: [
      'Founders launch pricing locked for one of the first 20 customers',
      'Protected kits, layouts, and the real premium asset surface',
      'Excel and OpenOffice Pro kits',
      'Desktop template Pro access and richer monthly value',
    ],
    href: proCheckout.href,
    checkoutHint: proCheckout.checkoutHint,
    paymentActions: proCheckout.paymentActions,
  },
  {
    id: 'launch_pack',
    name: 'Full Signature',
    priceLabel: 'MX$249 / mes (placeholder)',
    summary: 'Top-tier founders pricing with full-only operator surfaces and the strongest private positioning.',
    features: [
      'Founders launch pricing locked for one of the first 20 customers',
      'Everything in Pro plus six full-only surfaces that do not ship in Pro',
      'Google Sheets, Microsoft 365 Excel Web, and Outlook premium command surfaces',
      'Executive boardroom, Power BI visual pack, and Figma token sync reserved for the top tier',
      'The most exclusive-feeling recurring tier in the current ladder',
    ],
    href: launchCheckout.href,
    checkoutHint: launchCheckout.checkoutHint,
    paymentActions: launchCheckout.paymentActions,
  },
];
