import { env } from './env';
import type { CommercialPlan } from './plans';

const lemonVariantByPlan: Partial<Record<CommercialPlan, string | undefined>> = {
  solo: env.LEMON_SOLO_VARIANT_ID,
  pro: env.LEMON_PRO_VARIANT_ID,
  launch_pack: env.LEMON_LAUNCH_VARIANT_ID,
};

const checkoutUrlByPlan: Partial<Record<CommercialPlan, string | undefined>> = {
  solo: env.LOTOS_SOLO_CHECKOUT_URL,
  pro: env.LOTOS_PRO_CHECKOUT_URL,
  launch_pack: env.LOTOS_LAUNCH_PACK_URL,
};

export type CheckoutConfiguration = {
  state: 'managed_lemon' | 'direct_lemon' | 'unsupported_external' | 'unconfigured';
  directUrl: string | null;
};

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

function getLemonBaseCheckoutUrl(plan: CommercialPlan): string | null {
  const directCheckoutUrl = checkoutUrlByPlan[plan]?.trim();

  if (isLemonCheckoutUrl(directCheckoutUrl)) {
    return directCheckoutUrl!;
  }

  const storeSlug = env.LEMON_STORE_SLUG?.trim();
  const variantId = lemonVariantByPlan[plan]?.trim();

  if (!storeSlug || !variantId) {
    return null;
  }

  return `https://${storeSlug}.lemonsqueezy.com/checkout/buy/${variantId}`;
}

export function getCheckoutConfiguration(plan: CommercialPlan): CheckoutConfiguration {
  const directCheckoutUrl = checkoutUrlByPlan[plan]?.trim() || null;

  if (directCheckoutUrl && isLemonCheckoutUrl(directCheckoutUrl)) {
    return {
      state: 'direct_lemon',
      directUrl: directCheckoutUrl,
    };
  }

  const storeSlug = env.LEMON_STORE_SLUG?.trim();
  const variantId = lemonVariantByPlan[plan]?.trim();

  if (storeSlug && variantId) {
    return {
      state: 'managed_lemon',
      directUrl: null,
    };
  }

  if (directCheckoutUrl) {
    return {
      state: 'unsupported_external',
      directUrl: directCheckoutUrl,
    };
  }

  return {
    state: 'unconfigured',
    directUrl: null,
  };
}

export function hasAutomaticCheckoutForPlan(plan: CommercialPlan): boolean {
  const configuration = getCheckoutConfiguration(plan);
  return configuration.state === 'managed_lemon' || configuration.state === 'direct_lemon';
}

export function buildLemonCheckoutUrl(input: {
  plan: CommercialPlan;
  email: string;
}): string | null {
  const baseUrl = getLemonBaseCheckoutUrl(input.plan);

  if (!baseUrl) {
    return null;
  }

  const checkoutUrl = new URL(baseUrl);
  checkoutUrl.searchParams.set('checkout[email]', input.email);
  checkoutUrl.searchParams.set('checkout[custom][user_email]', input.email);
  checkoutUrl.searchParams.set('checkout[custom][plan]', input.plan);

  return checkoutUrl.toString();
}

export function buildManagedCheckoutPath(plan: CommercialPlan): string {
  return `/checkout/${plan.replace('_', '-')}`;
}

export function usesNonLemonCheckoutFallback(plan: CommercialPlan): boolean {
  return getCheckoutConfiguration(plan).state === 'unsupported_external';
}
