export type CommercialPlan = 'free' | 'solo' | 'pro' | 'launch_pack';

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
