import { createHash } from 'crypto';
import { env } from './env';
import { normalizeEmail } from './owner';
import { normalizePlan, planSatisfies, type CommercialPlan } from './plans';

export type PromoGrantType = 'FREE_FOUNDATION' | 'PRO_TRIAL' | 'PRO_GIFT' | 'FULL_GIFT' | 'QA_ACCESS';
export type PromoClaimStatus =
  | 'success'
  | 'invalid'
  | 'expired'
  | 'revoked'
  | 'already_claimed'
  | 'max_claims_reached'
  | 'login_required'
  | 'configuration_required';

export interface PromoGrantRow {
  id: string;
  code_hash: string;
  label: string;
  campaign_name: string | null;
  grant_type: PromoGrantType;
  plan_key: string;
  capabilities: string[] | null;
  max_claims: number | null;
  claim_count: number;
  starts_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  notes: string | null;
}

export interface PromoGrantClaimRow {
  id: string;
  grant_id: string;
  email_normalized: string;
  claimed_at: string;
  expires_at: string | null;
  revoked_at: string | null;
  notes: string | null;
}

export interface PromoGrantAccessSummary {
  id: string;
  grantId: string;
  label: string;
  campaignName: string | null;
  grantType: PromoGrantType;
  plan: CommercialPlan;
  capabilities: string[];
  claimedAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
  source: 'promo_grant';
  isRevocable: true;
  active: boolean;
}

export interface SanitizedPromoGrant {
  id: string;
  label: string;
  campaignName: string | null;
  grantType: PromoGrantType;
  plan: CommercialPlan;
  capabilities: string[];
  maxClaims: number | null;
  claimCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
}

export interface PromoClaimResult {
  status: PromoClaimStatus;
  grant: PromoGrantAccessSummary | null;
}

const promoGrantTypes: PromoGrantType[] = ['FREE_FOUNDATION', 'PRO_TRIAL', 'PRO_GIFT', 'FULL_GIFT', 'QA_ACCESS'];

function requireSupabaseRestConfig() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return {
    supabaseUrl: env.SUPABASE_URL,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

function buildHeaders(extraHeaders?: Record<string, string>) {
  const config = requireSupabaseRestConfig();

  if (!config) {
    throw new Error('Promotional access storage is not configured.');
  }

  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...(extraHeaders ?? {}),
  };
}

function buildEndpoint(table: 'access_grants' | 'access_grant_claims') {
  const config = requireSupabaseRestConfig();

  if (!config) {
    throw new Error('Promotional access storage is not configured.');
  }

  return new URL(`/rest/v1/${table}`, config.supabaseUrl);
}

async function parseErrorResponse(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string; error?: string };
    return payload.message || payload.error || `Supabase request failed with status ${response.status}.`;
  } catch {
    return `Supabase request failed with status ${response.status}.`;
  }
}

export function normalizePromoCode(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toUpperCase().replace(/\s+/g, '');
  return normalized.length >= 4 && normalized.length <= 96 ? normalized : null;
}

export function hashPromoCode(value: string): string {
  const normalized = normalizePromoCode(value);

  if (!normalized) {
    throw new Error('A valid promotional code is required.');
  }

  return createHash('sha256').update(normalized).digest('hex');
}

function parsePromoGrantType(value: unknown): PromoGrantType | null {
  return typeof value === 'string' && promoGrantTypes.includes(value as PromoGrantType)
    ? (value as PromoGrantType)
    : null;
}

function inferPlanForGrant(grantType: PromoGrantType, explicitPlan?: string | null): CommercialPlan {
  const explicit =
    explicitPlan === 'full'
      ? 'launch_pack'
      : explicitPlan === 'foundation'
        ? 'free'
        : normalizePlan(explicitPlan ?? undefined);

  if (explicit) {
    return explicit;
  }

  if (grantType === 'FULL_GIFT') {
    return 'launch_pack';
  }
  if (grantType === 'FREE_FOUNDATION') {
    return 'free';
  }
  return 'pro';
}

function defaultCapabilities(plan: CommercialPlan): string[] {
  const capabilities = ['components.view', 'demos.view', 'foundation.view'];

  if (planSatisfies(plan, 'pro')) {
    capabilities.push('pro.assets.view', 'pro.download', 'reports.view');
  }
  if (planSatisfies(plan, 'launch_pack')) {
    capabilities.push('full.assets.view', 'full.download', 'vault.view');
  }

  return capabilities;
}

function isPast(value: string | null | undefined, now = new Date()) {
  if (!value) {
    return false;
  }

  const time = Date.parse(value);
  return Number.isFinite(time) && time <= now.getTime();
}

function isFuture(value: string | null | undefined, now = new Date()) {
  if (!value) {
    return false;
  }

  const time = Date.parse(value);
  return Number.isFinite(time) && time > now.getTime();
}

function earlierIso(left: string | null, right: string | null) {
  if (!left) {
    return right;
  }
  if (!right) {
    return left;
  }
  return Date.parse(left) <= Date.parse(right) ? left : right;
}

function evaluateGrant(row: PromoGrantRow): PromoClaimStatus | 'valid' {
  if (row.revoked_at) {
    return 'revoked';
  }
  if (isFuture(row.starts_at)) {
    return 'invalid';
  }
  if (isPast(row.expires_at)) {
    return 'expired';
  }
  return 'valid';
}

function sanitizeGrant(row: PromoGrantRow): SanitizedPromoGrant {
  const grantType = parsePromoGrantType(row.grant_type) ?? 'FREE_FOUNDATION';
  const plan = inferPlanForGrant(grantType, row.plan_key);
  const capabilities = Array.isArray(row.capabilities) && row.capabilities.length > 0
    ? row.capabilities
    : defaultCapabilities(plan);

  return {
    id: row.id,
    label: row.label,
    campaignName: row.campaign_name,
    grantType,
    plan,
    capabilities,
    maxClaims: row.max_claims,
    claimCount: row.claim_count ?? 0,
    startsAt: row.starts_at,
    expiresAt: row.expires_at,
    revokedAt: row.revoked_at,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: row.notes,
  };
}

function toAccessSummary(row: PromoGrantRow, claim: PromoGrantClaimRow): PromoGrantAccessSummary {
  const sanitized = sanitizeGrant(row);
  const expiresAt = earlierIso(claim.expires_at, sanitized.expiresAt);

  return {
    id: claim.id,
    grantId: row.id,
    label: sanitized.label,
    campaignName: sanitized.campaignName,
    grantType: sanitized.grantType,
    plan: sanitized.plan,
    capabilities: sanitized.capabilities,
    claimedAt: claim.claimed_at,
    expiresAt,
    revokedAt: claim.revoked_at ?? sanitized.revokedAt,
    source: 'promo_grant',
    isRevocable: true,
    active: !claim.revoked_at && !sanitized.revokedAt && !isPast(expiresAt),
  };
}

async function fetchGrantByCodeHash(codeHash: string): Promise<PromoGrantRow | null> {
  const endpoint = buildEndpoint('access_grants');
  endpoint.searchParams.set('code_hash', `eq.${codeHash}`);
  endpoint.searchParams.set('limit', '1');
  endpoint.searchParams.set('select', '*');

  const response = await fetch(endpoint, {
    headers: buildHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const rows = (await response.json()) as PromoGrantRow[];
  return rows[0] ?? null;
}

async function fetchGrantById(id: string): Promise<PromoGrantRow | null> {
  const endpoint = buildEndpoint('access_grants');
  endpoint.searchParams.set('id', `eq.${id}`);
  endpoint.searchParams.set('limit', '1');
  endpoint.searchParams.set('select', '*');

  const response = await fetch(endpoint, {
    headers: buildHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const rows = (await response.json()) as PromoGrantRow[];
  return rows[0] ?? null;
}

async function fetchClaimForUser(grantId: string, email: string): Promise<PromoGrantClaimRow | null> {
  const endpoint = buildEndpoint('access_grant_claims');
  endpoint.searchParams.set('grant_id', `eq.${grantId}`);
  endpoint.searchParams.set('email_normalized', `eq.${email}`);
  endpoint.searchParams.set('limit', '1');
  endpoint.searchParams.set('select', '*');

  const response = await fetch(endpoint, {
    headers: buildHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const rows = (await response.json()) as PromoGrantClaimRow[];
  return rows[0] ?? null;
}

async function countActiveClaims(grantId: string): Promise<number> {
  const endpoint = buildEndpoint('access_grant_claims');
  endpoint.searchParams.set('grant_id', `eq.${grantId}`);
  endpoint.searchParams.set('select', 'id,expires_at,revoked_at');

  const response = await fetch(endpoint, {
    headers: buildHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const rows = (await response.json()) as Array<Pick<PromoGrantClaimRow, 'expires_at' | 'revoked_at'>>;
  return rows.filter((row) => !row.revoked_at && !isPast(row.expires_at)).length;
}

async function patchClaimCount(grantId: string, claimCount: number) {
  const endpoint = buildEndpoint('access_grants');
  endpoint.searchParams.set('id', `eq.${grantId}`);

  const response = await fetch(endpoint, {
    method: 'PATCH',
    headers: buildHeaders({ Prefer: 'return=minimal' }),
    body: JSON.stringify({ claim_count: claimCount, updated_at: new Date().toISOString() }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }
}

export async function claimPromoCodeForEmail(input: {
  code: string;
  email: string | null | undefined;
}): Promise<PromoClaimResult> {
  const email = normalizeEmail(input.email);

  if (!email) {
    return { status: 'login_required', grant: null };
  }
  if (!requireSupabaseRestConfig()) {
    return { status: 'configuration_required', grant: null };
  }

  const normalizedCode = normalizePromoCode(input.code);

  if (!normalizedCode) {
    return { status: 'invalid', grant: null };
  }

  const grant = await fetchGrantByCodeHash(hashPromoCode(normalizedCode));

  if (!grant) {
    return { status: 'invalid', grant: null };
  }

  const grantStatus = evaluateGrant(grant);

  if (grantStatus !== 'valid') {
    return { status: grantStatus, grant: null };
  }

  const existingClaim = await fetchClaimForUser(grant.id, email);

  if (existingClaim) {
    const summary = toAccessSummary(grant, existingClaim);

    if (existingClaim.revoked_at || grant.revoked_at) {
      return { status: 'revoked', grant: summary };
    }
    if (summary.active) {
      return { status: 'already_claimed', grant: summary };
    }
    return { status: 'expired', grant: summary };
  }

  const activeClaimCount = await countActiveClaims(grant.id);

  if (grant.max_claims !== null && activeClaimCount >= grant.max_claims) {
    return { status: 'max_claims_reached', grant: null };
  }

  const endpoint = buildEndpoint('access_grant_claims');
  endpoint.searchParams.set('select', '*');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: buildHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify({
      grant_id: grant.id,
      email_normalized: email,
      expires_at: grant.expires_at,
    }),
    cache: 'no-store',
  });

  if (response.status === 409) {
    const claim = await fetchClaimForUser(grant.id, email);
    return { status: 'already_claimed', grant: claim ? toAccessSummary(grant, claim) : null };
  }
  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const rows = (await response.json()) as PromoGrantClaimRow[];
  const claim = rows[0];

  if (!claim) {
    throw new Error('Promotional claim returned no row.');
  }

  await patchClaimCount(grant.id, activeClaimCount + 1);

  return { status: 'success', grant: toAccessSummary(grant, claim) };
}

export async function listUserPromoGrantAccess(userEmail: string): Promise<PromoGrantAccessSummary[]> {
  const email = normalizeEmail(userEmail);

  if (!email || !requireSupabaseRestConfig()) {
    return [];
  }

  const endpoint = buildEndpoint('access_grant_claims');
  endpoint.searchParams.set('email_normalized', `eq.${email}`);
  endpoint.searchParams.set('order', 'claimed_at.desc');
  endpoint.searchParams.set('select', '*');

  const response = await fetch(endpoint, {
    headers: buildHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const claims = (await response.json()) as PromoGrantClaimRow[];
  const summaries: PromoGrantAccessSummary[] = [];

  for (const claim of claims) {
    if (claim.revoked_at || isPast(claim.expires_at)) {
      continue;
    }

    const grant = await fetchGrantById(claim.grant_id);

    if (!grant || evaluateGrant(grant) !== 'valid') {
      continue;
    }

    const summary = toAccessSummary(grant, claim);

    if (summary.active) {
      summaries.push(summary);
    }
  }

  return summaries;
}

export async function listPromoGrantsForOwner(): Promise<SanitizedPromoGrant[]> {
  if (!requireSupabaseRestConfig()) {
    return [];
  }

  const endpoint = buildEndpoint('access_grants');
  endpoint.searchParams.set('order', 'created_at.desc');
  endpoint.searchParams.set('select', '*');

  const response = await fetch(endpoint, {
    headers: buildHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const rows = (await response.json()) as PromoGrantRow[];
  return rows.map(sanitizeGrant);
}

export async function createPromoGrant(input: {
  code: string;
  label: string;
  campaignName?: string | null;
  grantType: PromoGrantType;
  planKey?: string | null;
  maxClaims?: number | null;
  startsAt?: string | null;
  expiresAt?: string | null;
  createdBy?: string | null;
  notes?: string | null;
}): Promise<SanitizedPromoGrant> {
  if (!requireSupabaseRestConfig()) {
    throw new Error('Promotional access storage is not configured.');
  }

  const grantType = parsePromoGrantType(input.grantType);

  if (!grantType) {
    throw new Error('Invalid promotional grant type.');
  }
  if (grantType === 'PRO_TRIAL' && !input.expiresAt) {
    throw new Error('Pro trials require an expiration date.');
  }

  const plan = inferPlanForGrant(grantType, input.planKey);
  const maxClaims = input.maxClaims ?? (grantType === 'FULL_GIFT' ? 1 : null);
  const endpoint = buildEndpoint('access_grants');
  endpoint.searchParams.set('select', '*');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: buildHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify({
      code_hash: hashPromoCode(input.code),
      label: input.label.trim(),
      campaign_name: input.campaignName?.trim() || null,
      grant_type: grantType,
      plan_key: plan,
      capabilities: defaultCapabilities(plan),
      max_claims: maxClaims,
      starts_at: input.startsAt || null,
      expires_at: input.expiresAt || null,
      created_by: normalizeEmail(input.createdBy) ?? null,
      notes: input.notes?.trim() || null,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const rows = (await response.json()) as PromoGrantRow[];
  const grant = rows[0];

  if (!grant) {
    throw new Error('Promotional grant creation returned no row.');
  }

  return sanitizeGrant(grant);
}

export async function revokePromoGrant(input: { id: string; revokedBy: string | null }): Promise<SanitizedPromoGrant> {
  if (!requireSupabaseRestConfig()) {
    throw new Error('Promotional access storage is not configured.');
  }

  const endpoint = buildEndpoint('access_grants');
  endpoint.searchParams.set('id', `eq.${input.id}`);
  endpoint.searchParams.set('select', '*');
  const nowIso = new Date().toISOString();

  const response = await fetch(endpoint, {
    method: 'PATCH',
    headers: buildHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify({
      revoked_at: nowIso,
      updated_at: nowIso,
      notes: `Revoked by ${normalizeEmail(input.revokedBy) ?? 'owner'} on ${nowIso}.`,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const rows = (await response.json()) as PromoGrantRow[];
  const grant = rows[0];

  if (!grant) {
    throw new Error('Promotional grant revocation returned no row.');
  }

  return sanitizeGrant(grant);
}
