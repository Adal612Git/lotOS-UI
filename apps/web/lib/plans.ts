export type CommercialPlan = 'free' | 'solo' | 'pro' | 'launch_pack';

const planRank: Record<CommercialPlan, number> = {
  free: 0,
  solo: 1,
  pro: 2,
  launch_pack: 3,
};

export function normalizePlan(value: string | null | undefined): CommercialPlan | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase().replaceAll('-', '_');

  if (
    normalized === 'free' ||
    normalized === 'solo' ||
    normalized === 'pro' ||
    normalized === 'launch_pack'
  ) {
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
