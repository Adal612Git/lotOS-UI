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
import { listUserPromoGrantAccess, type PromoGrantAccessSummary } from './promo-grants';
import { getActiveTesterAccess, type TesterAccessGrant } from './tester-access';

export interface ResolvedAccess extends AccessDecision {
  allowed: boolean;
  entitlements: EntitlementAccessSummary[];
  isOwner: boolean;
  isTester: boolean;
  testerAccess: TesterAccessGrant | null;
  plans: CommercialPlan[];
  promoGrants: PromoGrantAccessSummary[];
}

const planRank: Record<CommercialPlan, number> = {
  free: 0,
  solo: 1,
  pro: 2,
  launch_pack: 3,
};

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

function pickHighestPromoGrant(grants: PromoGrantAccessSummary[]): PromoGrantAccessSummary | null {
  return grants.reduce<PromoGrantAccessSummary | null>((highest, grant) => {
    if (!highest) {
      return grant;
    }

    return planRank[grant.plan] > planRank[highest.plan] ? grant : highest;
  }, null);
}

export async function resolveCurrentAccess(requiredPlan?: CommercialPlan | null): Promise<ResolvedAccess> {
  let email: string | null = null;
  try {
    const session = await getServerSession(authOptions);
    email = normalizeEmail(session?.user?.email);
  } catch {
    email = null;
  }

  const owner = isOwnerEmail(email);
  const warnings: string[] = [];

  if (owner) {
    return withAllowed(
      buildAccessDecision({
        plan: 'launch_pack',
        source: 'owner_bypass',
        accessLevel: 'owner',
        email,
        label: 'Full Signature Owner',
        warnings,
      }),
      requiredPlan,
      {
        entitlements: [],
        isOwner: true,
        isTester: false,
        testerAccess: null,
        plans: ['launch_pack'],
        promoGrants: [],
      }
    );
  }

  const testerAccess = await getActiveTesterAccess(email);
  let plans: CommercialPlan[] = [];
  let entitlements: EntitlementAccessSummary[] = [];
  let promoGrants: PromoGrantAccessSummary[] = [];

  if (email) {
    const [entitlementResult, promoResult] = await Promise.allSettled([
      Promise.all([
        listUserPlans(email),
        listUserEntitlements(email),
      ]),
      listUserPromoGrantAccess(email),
    ]);

    if (entitlementResult.status === 'fulfilled') {
      [plans, entitlements] = entitlementResult.value;
    } else {
      const error = entitlementResult.reason;
      warnings.push(error instanceof Error ? error.message : 'Unable to resolve persistent entitlements.');
    }

    if (promoResult.status === 'fulfilled') {
      promoGrants = promoResult.value;
    } else {
      const error = promoResult.reason;
      warnings.push(error instanceof Error ? error.message : 'Unable to resolve promotional access.');
    }
  }

  const paidPlan = plans.length > 0 ? pickHighestPlan(plans) : null;
  const promoGrant = pickHighestPromoGrant(promoGrants);

  if (paidPlan && (!promoGrant || planRank[paidPlan] >= planRank[promoGrant.plan])) {
    return withAllowed(
      buildAccessDecision({
        plan: paidPlan,
        source: 'paid',
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
        promoGrants,
      }
    );
  }

  if (promoGrant) {
    return withAllowed(
      buildAccessDecision({
        plan: promoGrant.plan,
        source: 'promo_grant',
        email,
        expiresAt: promoGrant.expiresAt,
        label: promoGrant.label,
        grantLabel: promoGrant.label,
        isPromotional: true,
        isRevocable: true,
        warnings,
      }),
      requiredPlan,
      {
        entitlements,
        isOwner: false,
        isTester: false,
        testerAccess: null,
        plans: [...new Set([...plans, promoGrant.plan])],
        promoGrants,
      }
    );
  }

  if (testerAccess) {
    const qaEmail = email ?? testerAccess.email ?? 'team-qa-session@lotos.local';
    return withAllowed(
      buildAccessDecision({
        plan: testerAccess.plan,
        source: 'qa_phone',
        accessLevel: 'qa',
        email: qaEmail,
        label: 'QA Access',
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
        promoGrants,
      }
    );
  }

  return withAllowed(
    buildAccessDecision({
      plan: 'free',
      source: email ? 'free_default' : 'anonymous',
      accessLevel: email ? 'free' : 'public',
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
      promoGrants,
    }
  );
}
