import { env } from './env';
import { normalizeEmail } from './owner';
import { listAcceptedPlans, normalizePlan, type CommercialPlan } from './plans';

export interface EntitlementRow {
  id: number;
  user_email: string;
  plan: CommercialPlan;
  granted_at: string;
  source: string;
  metadata: Record<string, unknown> | null;
}

function ensureEmail(value: string): string {
  const normalized = normalizeEmail(value);

  if (!normalized) {
    throw new Error('A valid email is required to resolve entitlements.');
  }

  return normalized;
}

function requireSupabaseRestConfig() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Supabase service role configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  return {
    supabaseUrl: env.SUPABASE_URL,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

function buildEntitlementsEndpoint() {
  const { supabaseUrl } = requireSupabaseRestConfig();
  return new URL('/rest/v1/entitlements', supabaseUrl);
}

function buildHeaders(extraHeaders?: Record<string, string>) {
  const { serviceRoleKey } = requireSupabaseRestConfig();

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...(extraHeaders ?? {}),
  };
}

function coercePlanList(rows: Array<{ plan: string }>): CommercialPlan[] {
  const deduped = new Set<CommercialPlan>();

  for (const row of rows) {
    const normalized = normalizePlan(row.plan);
    if (normalized) {
      deduped.add(normalized);
    }
  }

  return [...deduped];
}

function normalizeEntitlementRow(row: Omit<EntitlementRow, 'plan'> & { plan: string }): EntitlementRow {
  const normalizedPlan = normalizePlan(row.plan);

  if (!normalizedPlan) {
    throw new Error(`Supabase returned an invalid plan value: ${String(row.plan)}`);
  }

  return {
    ...row,
    plan: normalizedPlan,
  };
}

async function parseErrorResponse(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string; error?: string };
    return payload.message || payload.error || `Supabase request failed with status ${response.status}.`;
  } catch {
    return `Supabase request failed with status ${response.status}.`;
  }
}

export async function listUserPlans(userEmail: string): Promise<CommercialPlan[]> {
  const normalizedEmail = ensureEmail(userEmail);

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  const endpoint = buildEntitlementsEndpoint();
  endpoint.searchParams.set('select', 'plan');
  endpoint.searchParams.set('user_email', `eq.${normalizedEmail}`);

  const response = await fetch(endpoint, {
    headers: buildHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const data = (await response.json()) as Array<{ plan: string }>;
  return coercePlanList(data ?? []);
}

export async function hasEntitlement(userEmail: string, requiredPlan: CommercialPlan): Promise<boolean> {
  const normalizedEmail = ensureEmail(userEmail);

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return false;
  }

  const endpoint = buildEntitlementsEndpoint();
  endpoint.searchParams.set('select', 'id');
  endpoint.searchParams.set('user_email', `eq.${normalizedEmail}`);
  endpoint.searchParams.set('plan', `in.(${listAcceptedPlans(requiredPlan).join(',')})`);
  endpoint.searchParams.set('limit', '1');

  const response = await fetch(endpoint, {
    headers: buildHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const data = (await response.json()) as Array<{ id?: number }>;
  return data.length > 0;
}

export async function upsertEntitlement(input: {
  userEmail: string;
  plan: CommercialPlan;
  source: string;
  metadata?: Record<string, unknown>;
}): Promise<EntitlementRow> {
  const normalizedEmail = ensureEmail(input.userEmail);
  const endpoint = buildEntitlementsEndpoint();
  endpoint.searchParams.set('on_conflict', 'user_email,plan');
  endpoint.searchParams.set('select', 'id,user_email,plan,granted_at,source,metadata');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: buildHeaders({
      Prefer: 'resolution=merge-duplicates,return=representation',
    }),
    body: JSON.stringify({
      user_email: normalizedEmail,
      plan: input.plan,
      source: input.source,
      metadata: input.metadata ?? {},
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const data = (await response.json()) as Array<
    Omit<EntitlementRow, 'plan'> & { plan: string }
  >;

  const row = data[0];

  if (!row) {
    throw new Error('Supabase upsert returned no entitlement row.');
  }

  return normalizeEntitlementRow(row);
}

export function formatEntitlementError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown entitlement error.';
}
