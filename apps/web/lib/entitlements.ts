import { env } from './env';
import {
  buildLifecycleMetadata,
  classifyEntitlementSource,
  getEntitlementExpiration,
  getEntitlementStatus,
  getEntitlementTrialEnd,
  isEntitlementActive,
  isRevoked,
  parseEntitlementMetadata,
  type EntitlementLifecycleRow,
  type EntitlementGrantMode,
  type EntitlementLifecycleStatus,
} from './entitlement-lifecycle';
import {
  decideEntitlementTransition,
  type EntitlementState,
  type EntitlementTransitionCause,
} from './entitlement-state-machine';
import { normalizeEmail } from './owner';
import { listAcceptedPlans, normalizePlan, type CommercialPlan } from './plans';

export interface EntitlementRow {
  id: number;
  user_email: string;
  email_normalized?: string | null;
  plan: CommercialPlan;
  granted_at: string;
  source: string;
  provider?: string | null;
  provider_customer_id?: string | null;
  provider_subscription_id?: string | null;
  provider_order_id?: string | null;
  provider_event_id_last?: string | null;
  status?: EntitlementLifecycleStatus | null;
  trial_ends_at?: string | null;
  expires_at?: string | null;
  revoked_at?: string | null;
  revoked_by?: string | null;
  revoke_reason?: string | null;
  internal_note?: string | null;
  created_by_owner_email?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  metadata: Record<string, unknown> | null;
}

export interface EntitlementAccessSummary {
  id: number;
  plan: CommercialPlan;
  source: string;
  kind: EntitlementGrantMode;
  status: EntitlementLifecycleStatus;
  active: boolean;
  grantedAt: string;
  expiresAt: string | null;
  trialEndsAt: string | null;
  revokedAt: string | null;
  provider: string | null;
}

export interface AdminEntitlementSummary extends EntitlementAccessSummary {
  revokedBy: string | null;
  revokeReason: string | null;
  internalNote: string | null;
  createdByOwnerEmail: string | null;
  providerSubscriptionId: string | null;
  providerOrderId: string | null;
  providerEventIdLast: string | null;
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

function buildEntitlementSelect(includeLifecycleColumns: boolean) {
  const legacyColumns = ['id', 'user_email', 'plan', 'granted_at', 'source', 'metadata'];
  const lifecycleColumns = [
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
  ];

  return includeLifecycleColumns
    ? [...legacyColumns, ...lifecycleColumns].join(',')
    : legacyColumns.join(',');
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

function coercePlanList(rows: Array<EntitlementLifecycleRow & { plan: string }>): CommercialPlan[] {
  const deduped = new Set<CommercialPlan>();

  for (const row of rows) {
    if (!isEntitlementActive(row)) {
      continue;
    }
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

async function fetchEntitlementRows(endpoint: URL): Promise<Array<Omit<EntitlementRow, 'plan'> & { plan: string }>> {
  const withLifecycle = new URL(endpoint);
  withLifecycle.searchParams.set('select', buildEntitlementSelect(true));

  const lifecycleResponse = await fetch(withLifecycle, {
    headers: buildHeaders(),
    cache: 'no-store',
  });

  if (lifecycleResponse.ok) {
    return (await lifecycleResponse.json()) as Array<Omit<EntitlementRow, 'plan'> & { plan: string }>;
  }

  const legacy = new URL(endpoint);
  legacy.searchParams.set('select', buildEntitlementSelect(false));
  const legacyResponse = await fetch(legacy, {
    headers: buildHeaders(),
    cache: 'no-store',
  });

  if (!legacyResponse.ok) {
    throw new Error(await parseErrorResponse(legacyResponse));
  }

  return (await legacyResponse.json()) as Array<Omit<EntitlementRow, 'plan'> & { plan: string }>;
}

async function fetchExistingEntitlement(userEmail: string, plan: CommercialPlan): Promise<EntitlementRow | null> {
  const endpoint = buildEntitlementsEndpoint();
  endpoint.searchParams.set('user_email', `eq.${userEmail}`);
  endpoint.searchParams.set('plan', `eq.${plan}`);
  endpoint.searchParams.set('limit', '1');

  const rows = await fetchEntitlementRows(endpoint);
  return rows[0] ? normalizeEntitlementRow(rows[0]) : null;
}

async function parseErrorResponse(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string; error?: string };
    return payload.message || payload.error || `Supabase request failed with status ${response.status}.`;
  } catch {
    return `Supabase request failed with status ${response.status}.`;
  }
}

function inferTargetStatus(input: {
  source: string;
  status?: EntitlementLifecycleStatus | null;
}): EntitlementLifecycleStatus {
  if (input.status) {
    return input.status;
  }

  const sourceKind = classifyEntitlementSource(input.source);
  if (sourceKind === 'manual_test') {
    return 'trialing';
  }
  if (sourceKind === 'paid_recovery') {
    return 'manual_recovery';
  }

  return 'active';
}

function inferTransitionCause(input: {
  source: string;
  status?: EntitlementLifecycleStatus | null;
  metadata?: Record<string, unknown>;
}, existingStatus: EntitlementState): EntitlementTransitionCause {
  const sourceKind = classifyEntitlementSource(input.source);
  const targetStatus = inferTargetStatus(input);

  if (targetStatus === 'revoked') {
    return 'owner_revoke';
  }
  if (sourceKind === 'manual_test') {
    return 'owner_manual_test';
  }
  if (sourceKind === 'paid_recovery') {
    return 'owner_paid_recovery';
  }

  if (targetStatus === 'past_due') {
    return 'webhook_payment_failed';
  }
  if (targetStatus === 'paused') {
    return 'webhook_paused';
  }
  if (targetStatus === 'cancelled') {
    return 'webhook_cancelled';
  }
  if (targetStatus === 'expired') {
    return 'webhook_expired';
  }

  const providerAction = input.metadata?.providerAction;
  if (
    providerAction === 'mark_active_recovered' ||
    existingStatus === 'past_due' ||
    existingStatus === 'paused' ||
    existingStatus === 'cancelled'
  ) {
    return 'webhook_recovered';
  }

  return 'webhook_grant';
}

export async function listUserPlans(userEmail: string): Promise<CommercialPlan[]> {
  const normalizedEmail = ensureEmail(userEmail);

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  const endpoint = buildEntitlementsEndpoint();
  endpoint.searchParams.set('user_email', `eq.${normalizedEmail}`);

  const rows = await fetchEntitlementRows(endpoint);
  return coercePlanList(rows ?? []);
}

export async function listUserEntitlements(userEmail: string): Promise<EntitlementAccessSummary[]> {
  const normalizedEmail = ensureEmail(userEmail);

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  const endpoint = buildEntitlementsEndpoint();
  endpoint.searchParams.set('user_email', `eq.${normalizedEmail}`);
  endpoint.searchParams.set('order', 'granted_at.desc');

  const data = await fetchEntitlementRows(endpoint);

  return data
    .map(normalizeEntitlementRow)
    .map((row) => {
      const metadata = parseEntitlementMetadata(row.metadata);
      const expiresAt = getEntitlementExpiration(row);
      const trialEndsAt = getEntitlementTrialEnd(row);
      const revokedAt =
        typeof row.revoked_at === 'string'
          ? row.revoked_at
          : typeof metadata.revokedAt === 'string'
            ? metadata.revokedAt
            : null;

      return {
        id: row.id,
        plan: row.plan,
        source: row.source,
        kind: classifyEntitlementSource(row.source),
        status: getEntitlementStatus(row),
        active: isEntitlementActive(row),
        grantedAt: row.granted_at,
        expiresAt: expiresAt ? expiresAt.toISOString() : null,
        trialEndsAt: trialEndsAt ? trialEndsAt.toISOString() : null,
        revokedAt,
        provider: row.provider ?? (typeof metadata.provider === 'string' ? metadata.provider : null),
      } satisfies EntitlementAccessSummary;
    });
}

export async function listAdminEntitlementsByEmail(userEmail: string): Promise<AdminEntitlementSummary[]> {
  const normalizedEmail = ensureEmail(userEmail);

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  const endpoint = buildEntitlementsEndpoint();
  endpoint.searchParams.set('user_email', `eq.${normalizedEmail}`);
  endpoint.searchParams.set('order', 'granted_at.desc');

  const data = await fetchEntitlementRows(endpoint);

  return data.map(normalizeEntitlementRow).map((row) => {
    const metadata = parseEntitlementMetadata(row.metadata);
    const expiresAt = getEntitlementExpiration(row);
    const trialEndsAt = getEntitlementTrialEnd(row);
    const revokedAt =
      typeof row.revoked_at === 'string'
        ? row.revoked_at
        : typeof metadata.revokedAt === 'string'
          ? metadata.revokedAt
          : null;

    return {
      id: row.id,
      plan: row.plan,
      source: row.source,
      kind: classifyEntitlementSource(row.source),
      status: getEntitlementStatus(row),
      active: isEntitlementActive(row),
      grantedAt: row.granted_at,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
      trialEndsAt: trialEndsAt ? trialEndsAt.toISOString() : null,
      revokedAt,
      provider: row.provider ?? (typeof metadata.provider === 'string' ? metadata.provider : null),
      revokedBy: row.revoked_by ?? (typeof metadata.revokedBy === 'string' ? metadata.revokedBy : null),
      revokeReason: row.revoke_reason ?? (typeof metadata.revokeReason === 'string' ? metadata.revokeReason : null),
      internalNote: row.internal_note ?? (typeof metadata.internalNote === 'string' ? metadata.internalNote : null),
      createdByOwnerEmail:
        row.created_by_owner_email ??
        (typeof metadata.createdByOwnerEmail === 'string' ? metadata.createdByOwnerEmail : null),
      providerSubscriptionId:
        row.provider_subscription_id ??
        (typeof metadata.providerSubscriptionId === 'string' ? metadata.providerSubscriptionId : null),
      providerOrderId:
        row.provider_order_id ??
        (typeof metadata.providerOrderId === 'string' ? metadata.providerOrderId : null),
      providerEventIdLast:
        row.provider_event_id_last ??
        (typeof metadata.providerEventId === 'string' ? metadata.providerEventId : null),
    } satisfies AdminEntitlementSummary;
  });
}

export async function hasEntitlement(userEmail: string, requiredPlan: CommercialPlan): Promise<boolean> {
  const normalizedEmail = ensureEmail(userEmail);

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return false;
  }

  const endpoint = buildEntitlementsEndpoint();
  endpoint.searchParams.set('user_email', `eq.${normalizedEmail}`);
  endpoint.searchParams.set('plan', `in.(${listAcceptedPlans(requiredPlan).join(',')})`);

  const data = await fetchEntitlementRows(endpoint);
  return data.some((row) => isEntitlementActive(row));
}

export async function upsertEntitlement(input: {
  userEmail: string;
  plan: CommercialPlan;
  source: string;
  provider?: string;
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
  providerOrderId?: string | null;
  providerEventId?: string | null;
  status?: EntitlementLifecycleStatus | null;
  createdByOwnerEmail?: string;
  internalNote?: string | null;
  paymentReference?: string | null;
  recoveryReason?: string | null;
  trialDays?: number | null;
  expiresAt?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<EntitlementRow> {
  const normalizedEmail = ensureEmail(input.userEmail);
  const existing = await fetchExistingEntitlement(normalizedEmail, input.plan);
  const existingStatus: EntitlementState = existing ? getEntitlementStatus(existing) : 'none';
  const targetStatus = inferTargetStatus(input);
  const transitionCause = inferTransitionCause(input, existingStatus);
  const transition = decideEntitlementTransition(existingStatus, targetStatus, transitionCause, {
    recoveryReason: input.recoveryReason,
    evidenceReviewed: input.metadata?.evidenceReviewed === true,
  });

  if (existing && isRevoked(existing) && input.status !== 'revoked') {
    throw new Error('Revoked entitlements require an explicit owner reactivation workflow.');
  }
  if (!transition.ok) {
    throw new Error(`Entitlement lifecycle transition blocked: ${transition.code}.`);
  }

  const lifecycleMetadata = buildLifecycleMetadata({
    source: input.source,
    plan: input.plan,
    provider: input.provider,
    providerCustomerId: input.providerCustomerId,
    providerSubscriptionId: input.providerSubscriptionId,
    providerOrderId: input.providerOrderId,
    providerEventId: input.providerEventId,
    status: input.status,
    createdByOwnerEmail: input.createdByOwnerEmail,
    internalNote: input.internalNote,
    paymentReference: input.paymentReference,
    recoveryReason: input.recoveryReason,
    trialDays: input.trialDays,
    expiresAt: input.expiresAt,
    metadata: {
      ...(existing?.metadata ?? {}),
      ...(input.metadata ?? {}),
      transitionCause,
      transitionFrom: existingStatus,
      transitionDecision: transition.kind,
    },
  });

  const endpoint = buildEntitlementsEndpoint();
  endpoint.searchParams.set('on_conflict', 'user_email,plan');
  endpoint.searchParams.set('select', buildEntitlementSelect(true));
  const fullPayload = {
    user_email: normalizedEmail,
    email_normalized: normalizedEmail,
    plan: input.plan,
    source: input.source,
    provider: input.provider ?? lifecycleMetadata.provider ?? null,
    provider_customer_id: input.providerCustomerId ?? lifecycleMetadata.providerCustomerId ?? null,
    provider_subscription_id: input.providerSubscriptionId ?? lifecycleMetadata.providerSubscriptionId ?? null,
    provider_order_id: input.providerOrderId ?? lifecycleMetadata.providerOrderId ?? null,
    provider_event_id_last: input.providerEventId ?? lifecycleMetadata.providerEventId ?? null,
    status: lifecycleMetadata.status ?? 'active',
    trial_ends_at: lifecycleMetadata.trialEndsAt ?? null,
    expires_at: lifecycleMetadata.expiresAt ?? null,
    revoked_at: lifecycleMetadata.revokedAt ?? null,
    revoked_by: lifecycleMetadata.revokedBy ?? null,
    revoke_reason: lifecycleMetadata.revokeReason ?? null,
    internal_note: lifecycleMetadata.internalNote ?? null,
    created_by_owner_email: lifecycleMetadata.createdByOwnerEmail ?? null,
    metadata: lifecycleMetadata,
  };
  const legacyPayload = {
    user_email: normalizedEmail,
    plan: input.plan,
    source: input.source,
    metadata: lifecycleMetadata,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: buildHeaders({
      Prefer: 'resolution=merge-duplicates,return=representation',
    }),
    body: JSON.stringify(fullPayload),
    cache: 'no-store',
  });

  let data: Array<Omit<EntitlementRow, 'plan'> & { plan: string }>;

  if (response.ok) {
    data = (await response.json()) as Array<
      Omit<EntitlementRow, 'plan'> & { plan: string }
    >;
  } else {
    const legacyEndpoint = buildEntitlementsEndpoint();
    legacyEndpoint.searchParams.set('on_conflict', 'user_email,plan');
    legacyEndpoint.searchParams.set('select', buildEntitlementSelect(false));
    const legacyResponse = await fetch(legacyEndpoint, {
      method: 'POST',
      headers: buildHeaders({
        Prefer: 'resolution=merge-duplicates,return=representation',
      }),
      body: JSON.stringify(legacyPayload),
      cache: 'no-store',
    });

    if (!legacyResponse.ok) {
      throw new Error(await parseErrorResponse(legacyResponse));
    }

    data = (await legacyResponse.json()) as Array<
      Omit<EntitlementRow, 'plan'> & { plan: string }
    >;
  }

  const row = data[0];

  if (!row) {
    throw new Error('Supabase upsert returned no entitlement row.');
  }

  return normalizeEntitlementRow(row);
}

export async function revokeEntitlement(input: {
  userEmail: string;
  plan?: CommercialPlan | null;
  revokedBy: string;
  revokeReason: string;
  internalNote?: string | null;
}): Promise<EntitlementRow[]> {
  const normalizedEmail = ensureEmail(input.userEmail);
  const endpoint = buildEntitlementsEndpoint();
  endpoint.searchParams.set('user_email', `eq.${normalizedEmail}`);

  if (input.plan) {
    endpoint.searchParams.set('plan', `eq.${input.plan}`);
  } else {
    endpoint.searchParams.set('plan', 'neq.free');
  }

  const rows = await fetchEntitlementRows(endpoint);
  const nowIso = new Date().toISOString();
  const updatedRows: EntitlementRow[] = [];

  for (const row of rows.map(normalizeEntitlementRow)) {
    const transition = decideEntitlementTransition(getEntitlementStatus(row), 'revoked', 'owner_revoke');
    if (transition.kind === 'noop') {
      continue;
    }
    if (!transition.ok) {
      throw new Error(`Entitlement lifecycle transition blocked: ${transition.code}.`);
    }

    const updateEndpoint = buildEntitlementsEndpoint();
    updateEndpoint.searchParams.set('id', `eq.${row.id}`);
    updateEndpoint.searchParams.set('select', buildEntitlementSelect(true));

    const metadata = {
      ...parseEntitlementMetadata(row.metadata),
      status: 'revoked',
      updatedAt: nowIso,
      revokedAt: nowIso,
      revokedBy: input.revokedBy,
      revokeReason: input.revokeReason,
      internalNote: input.internalNote ?? parseEntitlementMetadata(row.metadata).internalNote ?? null,
      revocationSource: 'manual_owner_revoke',
    };

    const updateResponse = await fetch(updateEndpoint, {
      method: 'PATCH',
      headers: buildHeaders({
        Prefer: 'return=representation',
      }),
      body: JSON.stringify({
        status: 'revoked',
        revoked_at: nowIso,
        revoked_by: input.revokedBy,
        revoke_reason: input.revokeReason,
        internal_note: input.internalNote ?? parseEntitlementMetadata(row.metadata).internalNote ?? null,
        metadata,
      }),
      cache: 'no-store',
    });

    let updated: Array<Omit<EntitlementRow, 'plan'> & { plan: string }>;
    if (updateResponse.ok) {
      updated = (await updateResponse.json()) as Array<Omit<EntitlementRow, 'plan'> & { plan: string }>;
    } else {
      const legacyEndpoint = buildEntitlementsEndpoint();
      legacyEndpoint.searchParams.set('id', `eq.${row.id}`);
      legacyEndpoint.searchParams.set('select', buildEntitlementSelect(false));
      const legacyResponse = await fetch(legacyEndpoint, {
        method: 'PATCH',
        headers: buildHeaders({
          Prefer: 'return=representation',
        }),
        body: JSON.stringify({ metadata }),
        cache: 'no-store',
      });

      if (!legacyResponse.ok) {
        throw new Error(await parseErrorResponse(legacyResponse));
      }

      updated = (await legacyResponse.json()) as Array<Omit<EntitlementRow, 'plan'> & { plan: string }>;
    }

    if (updated[0]) {
      updatedRows.push(normalizeEntitlementRow(updated[0]));
    }
  }

  return updatedRows;
}

export function formatEntitlementError(error: unknown): string {
  return error instanceof Error
    ? 'Entitlement service request failed.'
    : 'Unknown entitlement error.';
}

export function formatEntitlementLogError(error: unknown): string {
  return error instanceof Error ? error.name : 'UnknownError';
}
