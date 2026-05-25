import { isOwnerEmail, normalizeEmail as normalizeOwnerEmail } from './owner';
import { normalizePlan, planSatisfies, type CommercialPlan } from './plans';

export type EntitlementGrantMode = 'paid' | 'manual_test' | 'paid_recovery' | 'unknown';
export type EntitlementLifecycleStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'paused'
  | 'cancelled'
  | 'expired'
  | 'revoked'
  | 'manual_recovery';

export type EntitlementAccessStatus = EntitlementLifecycleStatus | 'none' | 'owner_bypass';

export interface EntitlementLifecycleMetadata {
  grantMode?: 'test' | 'paid_recovery' | 'lemon';
  provider?: string | null;
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
  providerOrderId?: string | null;
  providerEventId?: string | null;
  plan?: CommercialPlan;
  status?: EntitlementLifecycleStatus | null;
  createdByOwnerEmail?: string | null;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string | null;
  trialEndsAt?: string | null;
  revokedAt?: string | null;
  revokedBy?: string | null;
  revokeReason?: string | null;
  internalNote?: string | null;
  paymentReference?: string | null;
  recoveryReason?: string | null;
  [key: string]: unknown;
}

export interface EntitlementLifecycleRow {
  id?: number | string;
  user_email?: string | null;
  email_normalized?: string | null;
  plan?: string | null;
  status?: string | null;
  source?: string | null;
  provider?: string | null;
  provider_customer_id?: string | null;
  provider_subscription_id?: string | null;
  provider_order_id?: string | null;
  provider_event_id_last?: string | null;
  trial_ends_at?: string | null;
  expires_at?: string | null;
  revoked_at?: string | null;
  revoked_by?: string | null;
  revoke_reason?: string | null;
  internal_note?: string | null;
  created_by_owner_email?: string | null;
  granted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  metadata: Record<string, unknown> | null;
}

export interface VaultEntitlementView {
  plan: CommercialPlan;
  status: EntitlementLifecycleStatus;
  kind: EntitlementGrantMode;
  label: string;
  body: string;
  tone: string;
  ctaHref: string;
  ctaLabel: string;
  expiresAt: string | null;
  trialEndsAt: string | null;
}

const activeStatuses = new Set<EntitlementLifecycleStatus>(['active', 'trialing', 'manual_recovery']);
const lifecycleStatuses = new Set<EntitlementLifecycleStatus>([
  'active',
  'trialing',
  'past_due',
  'paused',
  'cancelled',
  'expired',
  'revoked',
  'manual_recovery',
]);

export function normalizeEmail(value: string | null | undefined): string | null {
  return normalizeOwnerEmail(value);
}

export function isOwnerBypass(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email);
  return Boolean(normalized && isOwnerEmail(normalized));
}

export function parseEntitlementMetadata(
  metadata: Record<string, unknown> | null | undefined
): EntitlementLifecycleMetadata {
  return (metadata ?? {}) as EntitlementLifecycleMetadata;
}

export function normalizeEntitlementStatus(value: unknown): EntitlementLifecycleStatus | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase().replaceAll('-', '_');
  return lifecycleStatuses.has(normalized as EntitlementLifecycleStatus)
    ? (normalized as EntitlementLifecycleStatus)
    : null;
}

export function classifyEntitlementSource(source: string | null | undefined): EntitlementGrantMode {
  if (!source) {
    return 'unknown';
  }
  if (source.startsWith('manual_owner_test:')) {
    return 'manual_test';
  }
  if (source.startsWith('manual_owner_paid_recovery:')) {
    return 'paid_recovery';
  }
  if (source === 'lemon' || source.startsWith('lemon:')) {
    return 'paid';
  }
  return 'unknown';
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function readDate(value: unknown): Date | null {
  const raw = readString(value);
  if (!raw) {
    return null;
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoDate(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function metadataStatus(row: EntitlementLifecycleRow): EntitlementLifecycleStatus | null {
  return normalizeEntitlementStatus(parseEntitlementMetadata(row.metadata).status);
}

export function getEntitlementExpiration(row: EntitlementLifecycleRow): Date | null {
  const metadata = parseEntitlementMetadata(row.metadata);
  return (
    readDate(row.expires_at) ??
    readDate(row.trial_ends_at) ??
    readDate(metadata.expiresAt) ??
    readDate(metadata.trialEndsAt)
  );
}

export function getEntitlementTrialEnd(row: EntitlementLifecycleRow): Date | null {
  const metadata = parseEntitlementMetadata(row.metadata);
  return readDate(row.trial_ends_at) ?? readDate(metadata.trialEndsAt);
}

export function isRevoked(row: EntitlementLifecycleRow): boolean {
  const metadata = parseEntitlementMetadata(row.metadata);
  return Boolean(readDate(row.revoked_at) ?? readDate(metadata.revokedAt));
}

export function isExpired(row: EntitlementLifecycleRow, now: Date = new Date()): boolean {
  const expiresAt = getEntitlementExpiration(row);
  return Boolean(expiresAt && expiresAt.getTime() <= now.getTime());
}

export function getEntitlementStatus(
  row: EntitlementLifecycleRow,
  now: Date = new Date()
): EntitlementLifecycleStatus {
  if (isRevoked(row)) {
    return 'revoked';
  }

  if (isExpired(row, now)) {
    return 'expired';
  }

  const explicitStatus = normalizeEntitlementStatus(row.status) ?? metadataStatus(row);
  if (explicitStatus) {
    return explicitStatus;
  }

  const kind = classifyEntitlementSource(row.source);
  if (kind === 'manual_test') {
    return 'trialing';
  }
  if (kind === 'paid_recovery') {
    return 'manual_recovery';
  }

  return 'active';
}

export function isEntitlementActive(row: EntitlementLifecycleRow, now: Date = new Date()): boolean {
  return activeStatuses.has(getEntitlementStatus(row, now));
}

export function entitlementSatisfiesPlan(row: EntitlementLifecycleRow, requiredPlan: CommercialPlan): boolean {
  const plan = normalizePlan(row.plan);
  return Boolean(plan && planSatisfies(plan, requiredPlan));
}

export function canAccessPremiumFromRows(
  rows: EntitlementLifecycleRow[],
  requiredPlan: CommercialPlan,
  now: Date = new Date()
): boolean {
  return rows.some((row) => entitlementSatisfiesPlan(row, requiredPlan) && isEntitlementActive(row, now));
}

export function buildLifecycleMetadata(input: {
  source: string;
  plan: CommercialPlan;
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
  now?: Date;
  metadata?: Record<string, unknown>;
}): EntitlementLifecycleMetadata {
  const now = input.now ?? new Date();
  const nowIso = now.toISOString();
  const existing = parseEntitlementMetadata(input.metadata);
  const sourceKind = classifyEntitlementSource(input.source);
  const explicitStatus = input.status ?? normalizeEntitlementStatus(existing.status);
  const trialEndsAt =
    sourceKind === 'manual_test' && input.trialDays
      ? new Date(now.getTime() + input.trialDays * 24 * 60 * 60 * 1000).toISOString()
      : null;
  const status =
    explicitStatus ??
    (sourceKind === 'manual_test'
      ? 'trialing'
      : sourceKind === 'paid_recovery'
        ? 'manual_recovery'
        : 'active');

  return {
    ...existing,
    grantMode:
      sourceKind === 'manual_test'
        ? 'test'
        : sourceKind === 'paid_recovery'
          ? 'paid_recovery'
          : sourceKind === 'paid'
            ? 'lemon'
            : existing.grantMode,
    provider: input.provider ?? existing.provider ?? null,
    providerCustomerId: input.providerCustomerId ?? existing.providerCustomerId ?? null,
    providerSubscriptionId: input.providerSubscriptionId ?? existing.providerSubscriptionId ?? null,
    providerOrderId: input.providerOrderId ?? existing.providerOrderId ?? null,
    providerEventId: input.providerEventId ?? existing.providerEventId ?? null,
    plan: input.plan,
    status,
    createdByOwnerEmail: input.createdByOwnerEmail ?? existing.createdByOwnerEmail ?? null,
    createdAt: existing.createdAt ?? nowIso,
    updatedAt: nowIso,
    expiresAt: input.expiresAt ?? trialEndsAt ?? existing.expiresAt ?? null,
    trialEndsAt: trialEndsAt ?? existing.trialEndsAt ?? null,
    revokedAt: status === 'revoked' ? existing.revokedAt ?? nowIso : existing.revokedAt ?? null,
    revokedBy: status === 'revoked' ? existing.revokedBy ?? null : existing.revokedBy ?? null,
    revokeReason: status === 'revoked' ? existing.revokeReason ?? null : existing.revokeReason ?? null,
    internalNote: input.internalNote ?? existing.internalNote ?? null,
    paymentReference: input.paymentReference ?? existing.paymentReference ?? null,
    recoveryReason: input.recoveryReason ?? existing.recoveryReason ?? null,
  };
}

export function mapEntitlementForVault(row: EntitlementLifecycleRow): VaultEntitlementView | null {
  const plan = normalizePlan(row.plan);
  if (!plan || plan === 'free') {
    return null;
  }

  const status = getEntitlementStatus(row);
  const kind = classifyEntitlementSource(row.source);
  const trialEndsAt = toIsoDate(getEntitlementTrialEnd(row));
  const expiresAt = toIsoDate(getEntitlementExpiration(row));
  const trialTarget = trialEndsAt ?? expiresAt;

  if (kind === 'manual_test' && status === 'trialing') {
    return {
      plan,
      status,
      kind,
      label: 'Prueba temporal activa',
      body: trialTarget
        ? `Acceso de evaluacion concedido por el owner. Termina el ${trialTarget}. No equivale a una compra.`
        : 'Acceso de evaluacion concedido por el owner. No equivale a una compra.',
      tone: 'manual accent-amber',
      ctaHref: '/pricing',
      ctaLabel: 'Ver pricing',
      expiresAt,
      trialEndsAt,
    };
  }

  if (kind === 'paid_recovery' && status === 'manual_recovery') {
    return {
      plan,
      status,
      kind,
      label: 'Acceso recuperado manualmente',
      body: 'Tu acceso fue restaurado tras una revision manual de pago. El flujo normal sigue siendo checkout y webhook.',
      tone: 'alt accent-cyan',
      ctaHref: '/vault',
      ctaLabel: 'Abrir vault',
      expiresAt,
      trialEndsAt,
    };
  }

  if (status === 'expired') {
    return {
      plan,
      status,
      kind,
      label: 'Acceso expirado',
      body: 'Este acceso ya no esta activo. Puedes continuar desde pricing o contactar soporte si esperabas acceso vigente.',
      tone: 'manual accent-amber',
      ctaHref: '/pricing',
      ctaLabel: 'Ver pricing',
      expiresAt,
      trialEndsAt,
    };
  }

  if (status === 'cancelled') {
    return {
      plan,
      status,
      kind,
      label: 'Suscripcion cancelada',
      body: 'La suscripcion asociada ya no mantiene acceso premium activo. Puedes volver a comprar o reactivar desde pricing.',
      tone: 'manual accent-rose',
      ctaHref: '/pricing',
      ctaLabel: 'Ver pricing',
      expiresAt,
      trialEndsAt,
    };
  }

  if (status === 'paused' || status === 'past_due') {
    return {
      plan,
      status,
      kind,
      label: 'Acceso requiere atencion',
      body: 'No podemos desbloquear premium en este momento por el estado de la suscripcion o del pago. Revisa el checkout o contacta soporte.',
      tone: 'manual accent-amber',
      ctaHref: '/pricing',
      ctaLabel: 'Ver pricing',
      expiresAt,
      trialEndsAt,
    };
  }

  if (status === 'revoked') {
    return {
      plan,
      status,
      kind,
      label: 'Acceso premium no disponible',
      body: 'Este acceso fue desactivado por el equipo. Contacta soporte si crees que es un error.',
      tone: 'manual accent-rose',
      ctaHref: '/support',
      ctaLabel: 'Contactar soporte',
      expiresAt,
      trialEndsAt,
    };
  }

  return {
    plan,
    status,
    kind,
    label: 'Acceso premium activo',
    body: 'Tu compra esta activa. Puedes acceder a los assets incluidos en este plan.',
    tone: 'ready accent-emerald',
    ctaHref: '/vault',
    ctaLabel: 'Abrir assets premium',
    expiresAt,
    trialEndsAt,
  };
}
