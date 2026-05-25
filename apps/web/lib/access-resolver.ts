import { getServerSession } from 'next-auth';
import { authOptions } from '../auth-options';
import {
  accessSatisfies,
  buildAccessDecision,
  pickHighestPlan,
  type AccessDecision,
} from './access-policy';
import { listUserEntitlements, listUserPlans, type EntitlementAccessSummary } from './entitlements';
import { isOwnerEmail, normalizeEmail } from './owner';
import type { CommercialPlan } from './plans';
import { getActiveTesterAccess, type TesterAccessGrant } from './tester-access';

export interface ResolvedAccess extends AccessDecision {
  allowed: boolean;
  entitlements: EntitlementAccessSummary[];
  isOwner: boolean;
  isTester: boolean;
  testerAccess: TesterAccessGrant | null;
  plans: CommercialPlan[];
}

function withAllowed(
  decision: AccessDecision,
  requiredPlan: CommercialPlan | null | undefined,
  extra: Omit<ResolvedAccess, keyof AccessDecision | 'allowed'>
): ResolvedAccess {
  return {
    ...decision,
    allowed: requiredPlan ? accessSatisfies(decision, requiredPlan) : decision.capabilities.vault,
    ...extra,
  };
}

export async function resolveCurrentAccess(requiredPlan?: CommercialPlan | null): Promise<ResolvedAccess> {
  let email: string | null = null;
  try {
    const session = await getServerSession(authOptions);
    email = normalizeEmail(session?.user?.email);
  } catch {
    email = null;
  }

  const testerAccess = await getActiveTesterAccess(email);
  const owner = isOwnerEmail(email);
  const warnings: string[] = [];

  if (email) {
    try {
      const [plans, entitlements] = await Promise.all([
        listUserPlans(email),
        listUserEntitlements(email),
      ]);

      if (plans.length > 0) {
        const plan = pickHighestPlan(plans);
        return withAllowed(
          buildAccessDecision({
            plan,
            source: 'purchase',
            email,
            warnings,
          }),
          requiredPlan,
          {
            entitlements,
            isOwner: false,
            isTester: false,
            testerAccess: null,
            plans,
          }
        );
      }
    } catch (error) {
      warnings.push(error instanceof Error ? error.message : 'Unable to resolve persistent entitlements.');
    }
  }

  if (testerAccess) {
    const qaEmail = email ?? testerAccess.email ?? 'team-qa-session@lotos.local';
    return withAllowed(
      buildAccessDecision({
        plan: testerAccess.plan,
        source: 'qa_phone',
        email: qaEmail,
        expiresAt: testerAccess.expiresAt,
        warnings,
      }),
      requiredPlan,
      {
        entitlements: [
          {
            id: 0,
            plan: testerAccess.plan,
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
        isOwner: false,
        isTester: true,
        testerAccess,
        plans: [testerAccess.plan],
      }
    );
  }

  if (owner) {
    return withAllowed(
      buildAccessDecision({
        plan: 'launch_pack',
        source: 'owner',
        email,
        warnings,
      }),
      requiredPlan,
      {
        entitlements: [],
        isOwner: true,
        isTester: false,
        testerAccess: null,
        plans: ['launch_pack'],
      }
    );
  }

  return withAllowed(
    buildAccessDecision({
      plan: 'free',
      source: email ? 'session' : 'public',
      email,
      warnings,
    }),
    requiredPlan,
    {
      entitlements: [],
      isOwner: false,
      isTester: false,
      testerAccess: null,
      plans: [],
    }
  );
}
