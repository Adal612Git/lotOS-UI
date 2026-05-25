import { env } from './env';
import { canAccessPremiumFromRows } from './entitlement-lifecycle';
import { listAcceptedPlans, type CommercialPlan } from './plans';
import { normalizeEmail } from './owner';

const legacySelect = 'id,user_email,plan,granted_at,source,metadata';
const lifecycleSelect = [
  legacySelect,
  'email_normalized',
  'provider',
  'provider_customer_id',
  'provider_subscription_id',
  'provider_order_id',
  'provider_event_id_last',
  'status',
  'trial_ends_at',
  'expires_at',
  'revoked_at',
  'revoked_by',
  'revoke_reason',
  'internal_note',
  'created_by_owner_email',
  'created_at',
  'updated_at',
].join(',');

export async function hasEntitlementViaRest(
  userEmail: string,
  requiredPlan: CommercialPlan
): Promise<boolean> {
  const normalizedEmail = normalizeEmail(userEmail);

  if (!normalizedEmail || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return false;
  }

  const acceptedPlans = listAcceptedPlans(requiredPlan).join(',');
  const endpoint = new URL('/rest/v1/entitlements', env.SUPABASE_URL);
  endpoint.searchParams.set('select', lifecycleSelect);
  endpoint.searchParams.set('user_email', `eq.${normalizedEmail}`);
  endpoint.searchParams.set('plan', `in.(${acceptedPlans})`);

  const response = await fetch(endpoint, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    cache: 'no-store',
  });

  let data: Array<{
    id?: number;
    plan?: string;
    source: string;
    status?: string | null;
    expires_at?: string | null;
    trial_ends_at?: string | null;
    revoked_at?: string | null;
    metadata: Record<string, unknown> | null;
  }>;

  if (response.ok) {
    data = (await response.json()) as typeof data;
  } else {
    const legacyEndpoint = new URL('/rest/v1/entitlements', env.SUPABASE_URL);
    legacyEndpoint.searchParams.set('select', legacySelect);
    legacyEndpoint.searchParams.set('user_email', `eq.${normalizedEmail}`);
    legacyEndpoint.searchParams.set('plan', `in.(${acceptedPlans})`);

    const legacyResponse = await fetch(legacyEndpoint, {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      cache: 'no-store',
    });

    if (!legacyResponse.ok) {
      console.error('LotOS entitlement middleware check failed', {
        status: legacyResponse.status,
        table: 'entitlements',
        requiredPlan,
      });
      return false;
    }

    data = (await legacyResponse.json()) as typeof data;
  }

  return canAccessPremiumFromRows(data, requiredPlan);
}
