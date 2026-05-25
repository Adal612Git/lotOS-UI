import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../auth-options';
import { hasEntitlement, listUserEntitlements, listUserPlans, type EntitlementAccessSummary } from './entitlements';
import { isOwnerEmail, normalizeEmail } from './owner';
import type { CommercialPlan } from './plans';
import { getActiveTesterAccess, hasTesterPlanAccess, type TesterAccessGrant } from './tester-access';

export type ViewerContext = {
  email: string;
  isOwner: boolean;
  isTester: boolean;
  testerAccess: TesterAccessGrant | null;
  plans: CommercialPlan[];
  entitlements: EntitlementAccessSummary[];
  degraded: boolean;
  warnings: string[];
};

export async function getSignedInEmail() {
  try {
    const session = await getServerSession(authOptions);
    return normalizeEmail(session?.user?.email);
  } catch {
    return null;
  }
}

export async function requireSignedInEmail() {
  const email = await getSignedInEmail();

  if (!email) {
    redirect('/login?callbackUrl=/vault');
  }

  return email;
}

export async function getViewerContext() {
  const email = await getSignedInEmail();
  const testerAccess = await getActiveTesterAccess(email);
  const viewerEmail = email ?? testerAccess?.email ?? 'team-qa-session@lotos.local';
  const owner = isOwnerEmail(email);
  const warnings: string[] = [];

  if (owner) {
    return {
      email: viewerEmail,
      isOwner: true,
      isTester: false,
      testerAccess: null,
      plans: ['launch_pack'] as CommercialPlan[],
      entitlements: [],
      degraded: false,
      warnings,
    } satisfies ViewerContext;
  }

  if (testerAccess) {
    return {
      email: viewerEmail,
      isOwner: false,
      isTester: true,
      testerAccess,
      plans: ['launch_pack'] as CommercialPlan[],
      entitlements: [
        {
          id: 0,
          plan: 'launch_pack',
          source: testerAccess.source,
          kind: 'manual_test',
          status: 'trialing',
          active: true,
          grantedAt: testerAccess.issuedAt,
          expiresAt: testerAccess.expiresAt,
          trialEndsAt: testerAccess.expiresAt,
          revokedAt: null,
          provider: 'team_qa_phone',
        },
      ],
      degraded: false,
      warnings,
    } satisfies ViewerContext;
  }

  if (!email) {
    redirect('/login?callbackUrl=/vault');
  }

  try {
    const [plans, entitlements] = await Promise.all([
      listUserPlans(email),
      listUserEntitlements(email),
    ]);

    return {
      email,
      isOwner: false,
      isTester: false,
      testerAccess: null,
      plans,
      entitlements,
      degraded: false,
      warnings,
    } satisfies ViewerContext;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to resolve entitlements right now.';

    warnings.push(message);

    return {
      email,
      isOwner: false,
      isTester: false,
      testerAccess: null,
      plans: [],
      entitlements: [],
      degraded: true,
      warnings,
    } satisfies ViewerContext;
  }
}

export async function requirePlanAccess(requiredPlan: CommercialPlan) {
  const testerAccess = await getActiveTesterAccess(null);

  if (testerAccess) {
    return {
      email: testerAccess.email ?? 'team-qa-session@lotos.local',
      isOwner: false,
      isTester: true,
    };
  }

  const email = await requireSignedInEmail();

  if (isOwnerEmail(email)) {
    return {
      email,
      isOwner: true,
      isTester: false,
    };
  }

  if (await hasTesterPlanAccess(email, requiredPlan)) {
    return {
      email,
      isOwner: false,
      isTester: true,
    };
  }

  let allowed = false;

  try {
    allowed = await hasEntitlement(email, requiredPlan);
  } catch {
    redirect('/pricing?state=entitlement-check-failed');
  }

  if (!allowed) {
    redirect('/pricing?state=upgrade-required');
  }

  return {
    email,
    isOwner: false,
    isTester: false,
  };
}
