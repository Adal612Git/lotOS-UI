import { normalizePlan, type CommercialPlan } from './plans';
import { normalizeEmail } from './owner';

export async function listUserPlans(userEmail: string): Promise<CommercialPlan[]> {
  try {
    const normalizedEmail = normalizeEmail(userEmail);
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!normalizedEmail || !supabaseUrl || !serviceRoleKey) {
      return [];
    }

    const endpoint = new URL('/rest/v1/entitlements', supabaseUrl);
    endpoint.searchParams.set('select', 'plan');
    endpoint.searchParams.set('user_email', `eq.${normalizedEmail}`);

    const response = await fetch(endpoint, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('LotOS docs vault failed to load entitlements', {
        status: response.status,
        email: normalizedEmail,
      });
      return [];
    }

    const rows = (await response.json()) as Array<{ plan?: string }>;
    const deduped = new Set<CommercialPlan>();

    for (const row of rows) {
      const normalizedPlan = normalizePlan(row.plan);
      if (normalizedPlan) {
        deduped.add(normalizedPlan);
      }
    }

    return [...deduped];
  } catch (error) {
    console.error('LotOS docs vault entitlement lookup crashed', {
      reason: error instanceof Error ? error.message : 'unknown',
      email: normalizeEmail(userEmail),
    });
    return [];
  }
}
