import { planSatisfies, type CommercialPlan } from './plans';

export type AccessTier = 'free' | 'solo' | 'pro' | 'launch_pack';
export type AccessLevel = 'public' | 'free' | 'pro' | 'full' | 'owner' | 'qa';
export type AccessSource =
  | 'anonymous'
  | 'free_default'
  | 'paid'
  | 'promo_grant'
  | 'qa_phone'
  | 'owner_bypass'
  | 'purchase'
  | 'owner'
  | 'session'
  | 'public';

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
  accessLevel: AccessLevel;
  source: AccessSource;
  label: string;
  planLabel: string;
  email: string | null;
  expiresAt: string | null;
  capabilities: AccessCapabilities;
  capabilityList: string[];
  isPromotional: boolean;
  isRevocable: boolean;
  upgradeRecommended: boolean;
  grantLabel: string | null;
  warnings: string[];
}

const planLabels: Record<AccessTier, string> = {
  free: 'Foundation',
  solo: 'Solo Studio',
  pro: 'Pro Studio',
  launch_pack: 'Full Signature',
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

function inferAccessLevel(plan: CommercialPlan, source: AccessSource): AccessLevel {
  if (source === 'owner_bypass' || source === 'owner') {
    return 'owner';
  }
  if (source === 'qa_phone') {
    return 'qa';
  }
  if (source === 'anonymous' || source === 'public') {
    return 'public';
  }
  if (plan === 'launch_pack') {
    return 'full';
  }
  if (plan === 'pro' || plan === 'solo') {
    return 'pro';
  }
  return 'free';
}

export function buildCapabilityList(plan: CommercialPlan, source?: AccessSource): string[] {
  const capabilities = ['components.view', 'demos.view', 'foundation.view'];

  if (source === 'owner_bypass' || source === 'owner' || source === 'qa_phone') {
    capabilities.push('team.access');
  }
  if (planSatisfies(plan, 'solo')) {
    capabilities.push('premium.assets.view', 'solo.assets.view', 'solo.download');
  }
  if (planSatisfies(plan, 'pro')) {
    capabilities.push('pro.assets.view', 'pro.download', 'reports.view');
  }
  if (planSatisfies(plan, 'launch_pack')) {
    capabilities.push('full.assets.view', 'full.download', 'vault.view');
  }

  return [...new Set(capabilities)];
}

export function buildAccessDecision(input: {
  plan?: CommercialPlan | null;
  source: AccessSource;
  accessLevel?: AccessLevel;
  email?: string | null;
  expiresAt?: string | null;
  label?: string | null;
  grantLabel?: string | null;
  isPromotional?: boolean;
  isRevocable?: boolean;
  warnings?: string[];
}): AccessDecision {
  const tier = input.plan ?? 'free';
  const accessLevel = input.accessLevel ?? inferAccessLevel(tier, input.source);
  const isPrivileged = tier !== 'free' || accessLevel === 'owner' || accessLevel === 'qa';

  return {
    tier,
    accessLevel,
    source: input.source,
    label: input.label ?? planLabels[tier],
    planLabel: planLabels[tier],
    email: input.email ?? null,
    expiresAt: input.expiresAt ?? null,
    capabilities: buildCapabilities(tier),
    capabilityList: buildCapabilityList(tier, input.source),
    isPromotional: input.isPromotional ?? input.source === 'promo_grant',
    isRevocable: input.isRevocable ?? input.source === 'promo_grant',
    upgradeRecommended: !isPrivileged || (tier !== 'launch_pack' && accessLevel !== 'owner'),
    grantLabel: input.grantLabel ?? null,
    warnings: input.warnings ?? [],
  };
}

export function accessSatisfies(decision: AccessDecision, requiredPlan: CommercialPlan): boolean {
  return planSatisfies(decision.tier, requiredPlan);
}
