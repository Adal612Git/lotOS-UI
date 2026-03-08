import { env } from './env';

export type CommercialLink = {
  href: string;
  label: string;
  external?: boolean;
};

function configuredOrPlaceholder(value: string | undefined, label: string) {
  return value?.trim() || `Pendiente de configurar: ${label}.`;
}

function toMailto(email: string | undefined) {
  return email?.trim() ? `mailto:${email.trim()}` : null;
}

export const commercialRoutes = {
  terms: '/terms',
  privacy: '/privacy',
  refunds: '/refunds',
  cancellations: '/cancellations',
  support: '/support',
  provider: '/provider',
  afterPurchase: '/after-purchase',
  manageSubscription: '/manage-subscription',
} as const;

const supportEmail = env.LOTOS_SUPPORT_EMAIL ?? env.LOTOS_PROVIDER_EMAIL;
const providerEmail = env.LOTOS_PROVIDER_EMAIL ?? supportEmail;

export const commercialSite = {
  brandName: 'LotOS UI',
  providerLegalName: configuredOrPlaceholder(env.LOTOS_PROVIDER_LEGAL_NAME, 'razon social'),
  providerRfc: configuredOrPlaceholder(env.LOTOS_PROVIDER_RFC, 'RFC'),
  providerAddress: configuredOrPlaceholder(env.LOTOS_PROVIDER_ADDRESS, 'domicilio fiscal'),
  providerEmail: configuredOrPlaceholder(providerEmail, 'correo del proveedor'),
  supportEmail: configuredOrPlaceholder(supportEmail, 'correo de soporte'),
  supportHours: configuredOrPlaceholder(env.LOTOS_SUPPORT_HOURS, 'horario de soporte'),
  supportMailto: toMailto(supportEmail),
  providerMailto: toMailto(providerEmail),
  subscriptionPortalUrl: env.LOTOS_SUBSCRIPTION_PORTAL_URL?.trim() || null,
  subscriptionPortalConfigured: Boolean(env.LOTOS_SUBSCRIPTION_PORTAL_URL?.trim()),
  salesContactUrl: env.LOTOS_CONTACT_SALES_URL?.trim() || toMailto(supportEmail) || commercialRoutes.support,
  bookingUrl: env.LOTOS_BOOKING_URL?.trim() || commercialRoutes.support,
};

export const commercialPrimaryLinks: CommercialLink[] = [
  { href: '/', label: 'Inicio' },
  { href: '/docs', label: 'Docs' },
  { href: '/pricing', label: 'Precios' },
  { href: commercialRoutes.afterPurchase, label: 'Despues de comprar' },
  { href: commercialRoutes.support, label: 'Soporte' },
];

export const commercialFooterGroups: Array<{
  title: string;
  links: CommercialLink[];
}> = [
  {
    title: 'Compra',
    links: [
      { href: '/pricing', label: 'Precios' },
      { href: commercialRoutes.afterPurchase, label: 'Despues de comprar' },
      { href: commercialRoutes.manageSubscription, label: 'Administrar suscripcion' },
      { href: commercialRoutes.cancellations, label: 'Cancelaciones' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: commercialRoutes.terms, label: 'Terminos' },
      { href: commercialRoutes.privacy, label: 'Privacidad' },
      { href: commercialRoutes.refunds, label: 'Reembolsos' },
      { href: commercialRoutes.provider, label: 'Proveedor' },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { href: commercialRoutes.support, label: 'Soporte' },
      {
        href: commercialSite.subscriptionPortalUrl ?? commercialRoutes.manageSubscription,
        label: 'Portal de suscripcion',
        external: Boolean(commercialSite.subscriptionPortalUrl),
      },
      {
        href: commercialSite.salesContactUrl,
        label: 'Contacto comercial',
        external: commercialSite.salesContactUrl.startsWith('http') || commercialSite.salesContactUrl.startsWith('mailto:'),
      },
    ],
  },
];

export const customerAccessRules = [
  'Usa el mismo correo con el que pagaste para iniciar sesion y abrir el vault.',
  'Si el plan se activa automaticamente, el acceso depende del email capturado en checkout.',
  'Si hubo un error de desbloqueo, soporte revisa el pago y corrige el entitlement manualmente.',
];

export const subscriptionRules = [
  'Los planes mensuales mantienen acceso mientras la suscripcion este activa.',
  'Cancelar evita cobros futuros, pero no revierte automaticamente cargos ya procesados.',
  'Si tu plan requiere activacion guiada o soporte de handoff, eso se explica antes de cobrar.',
];
