import type { PostgrestError } from '@supabase/supabase-js';
import { listAcceptedPlans, normalizePlan, type CommercialPlan } from './plans';
import { normalizeEmail } from './owner';
import { createServiceRoleClient } from './supabase';

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

function requireClient() {
  const client = createServiceRoleClient();

  if (!client) {
    throw new Error(
      'Supabase service role configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  return client;
}

export async function listUserPlans(userEmail: string): Promise<CommercialPlan[]> {
  const client = createServiceRoleClient();
  const normalizedEmail = ensureEmail(userEmail);

  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from('entitlements')
    .select('plan')
    .eq('user_email', normalizedEmail);

  if (error) {
    throw error;
  }

  return coercePlanList((data ?? []) as Array<{ plan: string }>);
}

export async function hasEntitlement(userEmail: string, requiredPlan: CommercialPlan): Promise<boolean> {
  const client = createServiceRoleClient();
  const normalizedEmail = ensureEmail(userEmail);

  if (!client) {
    return false;
  }

  const { count, error } = await client
    .from('entitlements')
    .select('id', { head: true, count: 'exact' })
    .eq('user_email', normalizedEmail)
    .in('plan', listAcceptedPlans(requiredPlan));

  if (error) {
    throw error;
  }

  return Boolean(count && count > 0);
}

export async function upsertEntitlement(input: {
  userEmail: string;
  plan: CommercialPlan;
  source: string;
  metadata?: Record<string, unknown>;
}): Promise<EntitlementRow> {
  const client = requireClient();
  const normalizedEmail = ensureEmail(input.userEmail);

  const { data, error } = await client
    .from('entitlements')
    .upsert(
      {
        user_email: normalizedEmail,
        plan: input.plan,
        source: input.source,
        metadata: input.metadata ?? {},
      },
      {
        onConflict: 'user_email,plan',
      }
    )
    .select('id, user_email, plan, granted_at, source, metadata')
    .single();

  if (error) {
    throw error;
  }

  const normalizedPlan = normalizePlan(data.plan);

  if (!normalizedPlan) {
    throw new Error(`Supabase returned an invalid plan value: ${String(data.plan)}`);
  }

  return {
    ...(data as Omit<EntitlementRow, 'plan'>),
    plan: normalizedPlan,
  };
}

export function formatEntitlementError(error: unknown): string {
  const postgrestError = error as PostgrestError | undefined;

  if (postgrestError?.message) {
    return postgrestError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown entitlement error.';
}
