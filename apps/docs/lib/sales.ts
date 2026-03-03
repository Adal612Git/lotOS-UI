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
      ? paypalUrl
        ? 'Checkout principal listo para activar acceso. PayPal queda como respaldo.'
        : 'Checkout principal listo para activar acceso mensual.'
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
    priceLabel: 'MX$29 / mes',
    summary: 'Premium entry tier for private proof, evaluation assets, and buyer-only monthly access.',
    features: [
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
    priceLabel: 'MX$79 / mes',
    summary: 'The main premium tier: protected kits, layouts, and private production-facing assets.',
    features: [
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
    name: 'Launch Signature',
    priceLabel: 'MX$149 / mes',
    summary: 'Top-tier commercial polish with elite-feeling launch assets and the strongest private positioning.',
    features: [
      'Everything in Pro plus signature launch-room materials',
      'Highest-polish commercial positioning and premium rollout framing',
      'The most exclusive-feeling recurring tier in the current ladder',
    ],
    href: launchCheckout.href,
    checkoutHint: launchCheckout.checkoutHint,
    paymentActions: launchCheckout.paymentActions,
  },
];
