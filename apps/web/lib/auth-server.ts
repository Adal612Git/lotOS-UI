import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../auth-options';
import { resolveCurrentAccess } from './access-resolver';
import type { EntitlementAccessSummary } from './entitlements';
import { normalizeEmail } from './owner';
import type { CommercialPlan } from './plans';
import type { TesterAccessGrant } from './tester-access';

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
  const access = await resolveCurrentAccess();

  return {
    email: access.email ?? 'public-session@lotos.local',
    isOwner: access.isOwner,
    isTester: access.isTester,
    testerAccess: access.testerAccess,
    plans: access.plans,
    entitlements: access.entitlements,
    degraded: access.warnings.length > 0,
    warnings: access.warnings,
  } satisfies ViewerContext;
}

export async function requirePlanAccess(requiredPlan: CommercialPlan) {
  const access = await resolveCurrentAccess(requiredPlan);
  if (access.allowed) {
    return {
      email: access.email ?? 'public-session@lotos.local',
      isOwner: access.isOwner,
      isTester: access.isTester,
    };
  }

  if (access.source === 'public') {
    redirect('/team-access?state=qa-required');
  }

  if (access.warnings.length > 0) {
    redirect('/pricing?state=entitlement-check-failed');
  }

  redirect('/pricing?state=upgrade-required');
}
