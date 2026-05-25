import { lotosManifest } from '@lotosui/registry';

export type CommercialPlan = 'free' | 'solo' | 'pro' | 'launch_pack';

const planRank: Record<CommercialPlan, number> = {
  free: 0,
  solo: 1,
  pro: 2,
  launch_pack: 3,
};

function isCommercialPlanId(value: string): value is CommercialPlan {
  return value === 'free' || value === 'solo' || value === 'pro' || value === 'launch_pack';
}

const registryCommercialPlans = new Set<CommercialPlan>(
  lotosManifest.plans
    .map((plan) => plan.id)
    .filter(isCommercialPlanId)
);

export function normalizePlan(value: string | null | undefined): CommercialPlan | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase().replaceAll('-', '_');

  if (isCommercialPlanId(normalized) && registryCommercialPlans.has(normalized)) {
    return normalized;
  }

  return null;
}

export function planSatisfies(granted: CommercialPlan, required: CommercialPlan): boolean {
  return planRank[granted] >= planRank[required];
}

export function listAcceptedPlans(required: CommercialPlan): CommercialPlan[] {
  return (Object.keys(planRank) as CommercialPlan[]).filter((plan) => planSatisfies(plan, required));
}
