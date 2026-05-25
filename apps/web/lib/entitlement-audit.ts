import { createHash } from 'node:crypto';
import { env } from './env';

export type EntitlementAuditActorType = 'owner' | 'webhook' | 'system';
export type EntitlementAuditAction =
  | 'manual_test_granted'
  | 'paid_recovery_granted'
  | 'entitlement_revoked'
  | 'webhook_received'
  | 'webhook_ignored'
  | 'webhook_applied'
  | 'webhook_failed'
  | 'entitlement_expired'
  | 'entitlement_status_changed';

export interface EntitlementAuditInput {
  entitlementId?: number | null;
  actorType: EntitlementAuditActorType;
  actorRef?: string | null;
  action: EntitlementAuditAction;
  reason?: string | null;
  provider?: string | null;
  providerEventId?: string | null;
  metadata?: Record<string, unknown>;
}

const forbiddenMetadataKey = /(email|secret|token|signature|raw|body|payload|authorization|cookie)/i;

function buildAuditEndpoint(path: string) {
  if (!env.SUPABASE_URL) {
    return null;
  }

  return new URL(path, env.SUPABASE_URL);
}

function buildHeaders(extraHeaders?: Record<string, string>) {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    ...(extraHeaders ?? {}),
  };
}

export function hashActorRef(actorRef: string | null | undefined): string | null {
  const normalized = actorRef?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const pepper = env.ENTITLEMENT_AUDIT_HASH_PEPPER ?? env.AUTH_SECRET ?? 'lotos-ui-local-audit-pepper';
  return createHash('sha256').update(`${pepper}:${normalized}`).digest('hex');
}

export function sanitizeAuditMetadata(metadata: Record<string, unknown> = {}) {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (forbiddenMetadataKey.test(key)) {
      continue;
    }

    if (
      value === null ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export async function recordEntitlementAuditEvent(input: EntitlementAuditInput): Promise<boolean> {
  const endpoint = buildAuditEndpoint('/rest/v1/entitlement_audit_events');
  const headers = buildHeaders({ Prefer: 'return=minimal' });

  if (!endpoint || !headers) {
    return false;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      entitlement_id: input.entitlementId ?? null,
      actor_type: input.actorType,
      actor_ref_hash: hashActorRef(input.actorRef),
      action: input.action,
      reason: input.reason ?? null,
      provider: input.provider ?? null,
      provider_event_id: input.providerEventId ?? null,
      metadata: sanitizeAuditMetadata(input.metadata),
    }),
    cache: 'no-store',
  });

  return response.ok;
}

export async function hasProcessedProviderEvent(provider: string, providerEventId: string): Promise<boolean> {
  const endpoint = buildAuditEndpoint('/rest/v1/entitlement_audit_events');
  const headers = buildHeaders();

  if (!endpoint || !headers) {
    return false;
  }

  endpoint.searchParams.set('select', 'id');
  endpoint.searchParams.set('provider', `eq.${provider}`);
  endpoint.searchParams.set('provider_event_id', `eq.${providerEventId}`);
  endpoint.searchParams.set('action', 'in.(webhook_applied,webhook_ignored)');
  endpoint.searchParams.set('limit', '1');

  const response = await fetch(endpoint, {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    return false;
  }

  const rows = (await response.json()) as Array<{ id: number }>;
  return rows.length > 0;
}
