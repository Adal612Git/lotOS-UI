import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../auth-options';
import { hasEntitlement, listUserPlans } from './entitlements';
import { isOwnerEmail, normalizeEmail } from './owner';
import type { CommercialPlan } from './plans';

export type ViewerContext = {
  email: string;
  isOwner: boolean;
  plans: CommercialPlan[];
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
  const email = await requireSignedInEmail();
  const owner = isOwnerEmail(email);
  const warnings: string[] = [];

  if (owner) {
    return {
      email,
      isOwner: true,
      plans: ['launch_pack'] as CommercialPlan[],
      degraded: false,
      warnings,
    } satisfies ViewerContext;
  }

  try {
    const plans = await listUserPlans(email);

    return {
      email,
      isOwner: false,
      plans,
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
      plans: [],
      degraded: true,
      warnings,
    } satisfies ViewerContext;
  }
}

export async function requirePlanAccess(requiredPlan: CommercialPlan) {
  const email = await requireSignedInEmail();

  if (isOwnerEmail(email)) {
    return {
      email,
      isOwner: true,
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
  };
}
