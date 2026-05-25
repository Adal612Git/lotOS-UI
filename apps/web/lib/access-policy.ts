import { planSatisfies, type CommercialPlan } from './plans';

export type AccessTier = 'free' | 'solo' | 'pro' | 'launch_pack';
export type AccessSource = 'purchase' | 'qa_phone' | 'owner' | 'session' | 'public';

export interface AccessCapabilities {
  vault: boolean;
  vaultSolo: boolean;
  vaultPro: boolean;
  vaultFull: boolean;
  downloads: boolean;
  playground: boolean;
  templates: boolean;
  componentCatalog: boolean;
  premiumAssets: boolean;
}

export interface AccessDecision {
  tier: AccessTier;
  source: AccessSource;
  label: string;
  email: string | null;
  expiresAt: string | null;
  capabilities: AccessCapabilities;
  warnings: string[];
}

const planLabels: Record<AccessTier, string> = {
  free: 'Free',
  solo: 'Solo',
  pro: 'Pro',
  launch_pack: 'Full Signature QA',
};

const planRank: Record<CommercialPlan, number> = {
  free: 0,
  solo: 1,
  pro: 2,
  launch_pack: 3,
};

export function getRequiredPlanForPath(pathname: string): CommercialPlan | null {
  if (pathname.startsWith('/vault/launch')) {
    return 'launch_pack';
  }
  if (pathname.startsWith('/vault/pro')) {
    return 'pro';
  }
  if (pathname.startsWith('/vault/solo')) {
    return 'solo';
  }
  if (pathname.startsWith('/vault')) {
    return 'free';
  }

  return null;
}

export function pickHighestPlan(plans: CommercialPlan[]): CommercialPlan {
  return plans.reduce<CommercialPlan>(
    (highest, plan) => (planRank[plan] > planRank[highest] ? plan : highest),
    'free'
  );
}

export function buildCapabilities(plan: CommercialPlan): AccessCapabilities {
  const hasSolo = planSatisfies(plan, 'solo');
  const hasPro = planSatisfies(plan, 'pro');
  const hasFull = planSatisfies(plan, 'launch_pack');

  return {
    vault: plan !== 'free',
    vaultSolo: hasSolo,
    vaultPro: hasPro,
    vaultFull: hasFull,
    downloads: hasSolo,
    playground: true,
    templates: true,
    componentCatalog: true,
    premiumAssets: hasSolo,
  };
}

export function buildAccessDecision(input: {
  plan?: CommercialPlan | null;
  source: AccessSource;
  email?: string | null;
  expiresAt?: string | null;
  warnings?: string[];
}): AccessDecision {
  const tier = input.plan ?? 'free';

  return {
    tier,
    source: input.source,
    label: planLabels[tier],
    email: input.email ?? null,
    expiresAt: input.expiresAt ?? null,
    capabilities: buildCapabilities(tier),
    warnings: input.warnings ?? [],
  };
}

export function accessSatisfies(decision: AccessDecision, requiredPlan: CommercialPlan): boolean {
  return planSatisfies(decision.tier, requiredPlan);
}
