import { env } from './env';
import { listAcceptedPlans, type CommercialPlan } from './plans';
import { normalizeEmail } from './owner';

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
  endpoint.searchParams.set('select', 'id');
  endpoint.searchParams.set('user_email', `eq.${normalizedEmail}`);
  endpoint.searchParams.set('plan', `in.(${acceptedPlans})`);
  endpoint.searchParams.set('limit', '1');

  const response = await fetch(endpoint, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('LotOS entitlement middleware check failed', {
      status: response.status,
      path: endpoint.toString(),
    });
    return false;
  }

  const data = (await response.json()) as Array<{ id?: number }>;
  return data.length > 0;
}
