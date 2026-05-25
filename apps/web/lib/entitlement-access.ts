import { isOwnerBypass, mapEntitlementForVault, type EntitlementAccessStatus } from './entitlement-lifecycle';
import { hasEntitlement, listUserEntitlements, type EntitlementAccessSummary } from './entitlements';
import { normalizeEmail as normalizeOwnerEmail } from './owner';
import type { CommercialPlan } from './plans';

export { isExpired, isRevoked, getEntitlementStatus, mapEntitlementForVault } from './entitlement-lifecycle';
export type { EntitlementAccessStatus, VaultEntitlementView } from './entitlement-lifecycle';
export { normalizeOwnerEmail as normalizeEmail };

export interface EntitlementAccessExplanation {
  email: string;
  ownerBypass: boolean;
  status: EntitlementAccessStatus;
  allowed: boolean;
  entitlements: EntitlementAccessSummary[];
}

export function normalizeEntitlementEmail(value: string | null | undefined): string | null {
  return normalizeOwnerEmail(value);
}

export function isOwnerEntitlementBypass(value: string | null | undefined): boolean {
  return isOwnerBypass(value);
}

export async function canAccessPremium(email: string, requiredPlan: CommercialPlan): Promise<boolean> {
  if (isOwnerBypass(email)) {
    return true;
  }

  return hasEntitlement(email, requiredPlan);
}

export async function explainEntitlementAccess(
  email: string,
  requiredPlan?: CommercialPlan
): Promise<EntitlementAccessExplanation> {
  const normalizedEmail = normalizeOwnerEmail(email);

  if (!normalizedEmail) {
    return {
      email: '',
      ownerBypass: false,
      status: 'none',
      allowed: false,
      entitlements: [],
    };
  }

  if (isOwnerBypass(normalizedEmail)) {
    return {
      email: normalizedEmail,
      ownerBypass: true,
      status: 'owner_bypass',
      allowed: true,
      entitlements: [],
    };
  }

  const entitlements = await listUserEntitlements(normalizedEmail);
  const active = requiredPlan
    ? await hasEntitlement(normalizedEmail, requiredPlan)
    : entitlements.some((entry) => entry.active);
  const firstStatus = entitlements[0]?.status ?? 'none';

  return {
    email: normalizedEmail,
    ownerBypass: false,
    status: active ? firstStatus : firstStatus === 'none' ? 'none' : firstStatus,
    allowed: active,
    entitlements,
  };
}

export function mapSummaryForVault(entry: EntitlementAccessSummary) {
  return mapEntitlementForVault({
    id: entry.id,
    plan: entry.plan,
    status: entry.status,
    source: entry.source,
    provider: entry.provider,
    trial_ends_at: entry.trialEndsAt,
    expires_at: entry.expiresAt,
    revoked_at: entry.revokedAt,
    granted_at: entry.grantedAt,
    metadata: null,
  });
}
