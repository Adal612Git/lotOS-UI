import type { EntitlementLifecycleStatus } from '../entitlement-lifecycle';
import { env } from '../env';
import type { CommercialPlan } from '../plans';

export type LemonWebhookAction =
  | 'grant_active'
  | 'mark_trialing'
  | 'mark_past_due'
  | 'mark_paused'
  | 'mark_active_recovered'
  | 'mark_cancelled'
  | 'mark_expired'
  | 'ignore_unknown'
  | 'reject_unmappable';

export interface LemonWebhookMapping {
  action: LemonWebhookAction;
  eventName: string;
  providerEventId: string | null;
  userEmail: string | null;
  plan: CommercialPlan | null;
  variantId: string | null;
  providerCustomerId: string | null;
  providerSubscriptionId: string | null;
  providerOrderId: string | null;
  status: EntitlementLifecycleStatus | null;
  reason: string;
}

type LemonWebhookPayload = {
  meta?: {
    event_name?: string;
    event_id?: string | number;
    custom_data?: Record<string, unknown>;
  };
  data?: {
    id?: string;
    attributes?: Record<string, unknown> & {
      user_email?: string;
      customer_id?: string | number;
      order_id?: string | number;
      subscription_id?: string | number;
      variant_id?: string | number;
      first_order_item?: {
        variant_id?: string | number;
      };
    };
    relationships?: Record<string, unknown>;
  };
};

const eventActionMap: Record<string, { action: LemonWebhookAction; status: EntitlementLifecycleStatus | null }> = {
  order_created: { action: 'grant_active', status: 'active' },
  subscription_created: { action: 'grant_active', status: 'active' },
  subscription_updated: { action: 'grant_active', status: 'active' },
  subscription_payment_success: { action: 'mark_active_recovered', status: 'active' },
  subscription_payment_recovered: { action: 'mark_active_recovered', status: 'active' },
  subscription_payment_failed: { action: 'mark_past_due', status: 'past_due' },
  subscription_paused: { action: 'mark_paused', status: 'paused' },
  subscription_resumed: { action: 'mark_active_recovered', status: 'active' },
  subscription_unpaused: { action: 'mark_active_recovered', status: 'active' },
  subscription_cancelled: { action: 'mark_cancelled', status: 'cancelled' },
  subscription_expired: { action: 'mark_expired', status: 'expired' },
};

function toStringOrNull(value: unknown): string | null {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return null;
}

function resolvePlanFromVariantId(variantId: string | null): CommercialPlan | null {
  if (!variantId) {
    return null;
  }

  if (variantId === env.LEMON_SOLO_VARIANT_ID) {
    return 'solo';
  }
  if (variantId === env.LEMON_PRO_VARIANT_ID) {
    return 'pro';
  }
  if (variantId === env.LEMON_LAUNCH_VARIANT_ID) {
    return 'launch_pack';
  }

  return null;
}

function readVariantId(payload: LemonWebhookPayload) {
  return toStringOrNull(payload.data?.attributes?.variant_id)
    ?? toStringOrNull(payload.data?.attributes?.first_order_item?.variant_id);
}

function readEmailCandidate(value: unknown): string | null {
  const candidate = toStringOrNull(value)?.toLowerCase();
  if (!candidate || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)) {
    return null;
  }
  return candidate;
}

function readUserEmail(payload: LemonWebhookPayload) {
  return readEmailCandidate(payload.data?.attributes?.user_email)
    ?? readEmailCandidate(payload.meta?.custom_data?.user_email);
}

function readProviderEventId(payload: LemonWebhookPayload, eventName: string) {
  return toStringOrNull(payload.meta?.event_id)
    ?? (payload.data?.id ? `${eventName}:${payload.data.id}` : null);
}

function resolveSubscriptionUpdatedConfig(payload: LemonWebhookPayload) {
  const providerStatus = toStringOrNull(payload.data?.attributes?.status)?.toLowerCase().replaceAll('-', '_');

  if (providerStatus === 'past_due' || providerStatus === 'unpaid') {
    return { action: 'mark_past_due', status: 'past_due' } satisfies {
      action: LemonWebhookAction;
      status: EntitlementLifecycleStatus;
    };
  }
  if (providerStatus === 'paused') {
    return { action: 'mark_paused', status: 'paused' } satisfies {
      action: LemonWebhookAction;
      status: EntitlementLifecycleStatus;
    };
  }
  if (providerStatus === 'cancelled' || providerStatus === 'canceled') {
    return { action: 'mark_cancelled', status: 'cancelled' } satisfies {
      action: LemonWebhookAction;
      status: EntitlementLifecycleStatus;
    };
  }
  if (providerStatus === 'expired') {
    return { action: 'mark_expired', status: 'expired' } satisfies {
      action: LemonWebhookAction;
      status: EntitlementLifecycleStatus;
    };
  }

  return eventActionMap.subscription_updated;
}

function resolveEventConfig(payload: LemonWebhookPayload, eventName: string) {
  if (eventName === 'subscription_updated') {
    return resolveSubscriptionUpdatedConfig(payload);
  }

  return eventActionMap[eventName];
}

function readProviderSubscriptionId(payload: LemonWebhookPayload, eventName: string) {
  const explicitSubscriptionId = toStringOrNull(payload.data?.attributes?.subscription_id);

  if (eventName.startsWith('subscription_payment_')) {
    return explicitSubscriptionId;
  }

  return explicitSubscriptionId
    ?? (eventName.startsWith('subscription_') ? toStringOrNull(payload.data?.id) : null);
}

export function mapLemonWebhookEvent(payload: LemonWebhookPayload): LemonWebhookMapping {
  const eventName = payload.meta?.event_name ?? 'unknown';
  const providerEventId = readProviderEventId(payload, eventName);
  const variantId = readVariantId(payload);
  const plan = resolvePlanFromVariantId(variantId);
  const userEmail = readUserEmail(payload);
  const eventConfig = resolveEventConfig(payload, eventName);
  const providerCustomerId = toStringOrNull(payload.data?.attributes?.customer_id);
  const providerSubscriptionId = readProviderSubscriptionId(payload, eventName);
  const providerOrderId = toStringOrNull(payload.data?.attributes?.order_id)
    ?? (eventName === 'order_created' ? toStringOrNull(payload.data?.id) : null);

  if (!eventConfig) {
    return {
      action: 'ignore_unknown',
      eventName,
      providerEventId,
      userEmail,
      plan,
      variantId,
      providerCustomerId,
      providerSubscriptionId,
      providerOrderId,
      status: null,
      reason: 'Unsupported Lemon event. Validate exact provider event names before live sales.',
    };
  }

  if (!providerEventId) {
    return {
      action: 'reject_unmappable',
      eventName,
      providerEventId,
      userEmail,
      plan,
      variantId,
      providerCustomerId,
      providerSubscriptionId,
      providerOrderId,
      status: null,
      reason: 'Missing provider event id for mutating webhook.',
    };
  }

  if (!userEmail || !plan) {
    return {
      action: 'reject_unmappable',
      eventName,
      providerEventId,
      userEmail,
      plan,
      variantId,
      providerCustomerId,
      providerSubscriptionId,
      providerOrderId,
      status: null,
      reason: 'Missing buyer email or known variant mapping.',
    };
  }

  if (eventName.startsWith('subscription_payment_') && !providerSubscriptionId) {
    return {
      action: 'reject_unmappable',
      eventName,
      providerEventId,
      userEmail,
      plan,
      variantId,
      providerCustomerId,
      providerSubscriptionId,
      providerOrderId,
      status: null,
      reason: 'Missing provider subscription id for subscription payment webhook.',
    };
  }

  return {
    action: eventConfig.action,
    eventName,
    providerEventId,
    userEmail,
    plan,
    variantId,
    providerCustomerId,
    providerSubscriptionId,
    providerOrderId,
    status: eventConfig.status,
    reason: 'Mapped Lemon event to internal entitlement lifecycle status.',
  };
}

export function listSupportedLemonWebhookEvents() {
  return Object.keys(eventActionMap);
}
