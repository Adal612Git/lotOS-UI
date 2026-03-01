import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../auth-options';
import { hasEntitlement, listUserPlans } from './entitlements';
import { isOwnerEmail, normalizeEmail } from './owner';
import type { CommercialPlan } from './plans';

export async function getSignedInEmail() {
  const session = await getServerSession(authOptions);
  return normalizeEmail(session?.user?.email);
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

  return {
    email,
    isOwner: owner,
    plans: owner ? (['launch_pack'] as CommercialPlan[]) : await listUserPlans(email),
  };
}

export async function requirePlanAccess(requiredPlan: CommercialPlan) {
  const email = await requireSignedInEmail();

  if (isOwnerEmail(email)) {
    return {
      email,
      isOwner: true,
    };
  }

  const allowed = await hasEntitlement(email, requiredPlan);

  if (!allowed) {
    redirect('/pricing');
  }

  return {
    email,
    isOwner: false,
  };
}
