import type { CommercialPlan } from './plans';

export const TESTER_ACCESS_COOKIE = 'lotos_tester_access';
export const TESTER_ACCESS_PLAN: CommercialPlan = 'launch_pack';
export const TESTER_ACCESS_SOURCE = 'manual_owner_test:team_phone';

export const testerAccessMaxAgeSeconds = 14 * 24 * 60 * 60;

export const bundledTesterPhoneHashes = [
  'e91fb357689946b6d11ef4fe1cd323a85b4f6e928eadae4c9f710d8b366082ed',
  'e81544a50cca0c69bd09e5ba7fe30def53cf40f9824acea2f270f95747fb7cc2',
] as const;

export function normalizeTesterPhone(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const digits = value.replace(/\D/g, '');
  const normalized = digits.startsWith('00') ? digits.slice(2) : digits;

  if (normalized.length < 10 || normalized.length > 15) {
    return null;
  }

  return normalized;
}

export function getTesterPhoneCandidates(normalizedPhone: string): string[] {
  const candidates = new Set([normalizedPhone]);

  if (normalizedPhone.length === 10) {
    candidates.add(`52${normalizedPhone}`);
    candidates.add(`521${normalizedPhone}`);
    candidates.add(`57${normalizedPhone}`);
  }

  if (normalizedPhone.startsWith('52') && normalizedPhone.length === 12) {
    candidates.add(`521${normalizedPhone.slice(2)}`);
  }

  if (normalizedPhone.startsWith('521') && normalizedPhone.length === 13) {
    candidates.add(`52${normalizedPhone.slice(3)}`);
  }

  return [...candidates];
}

export function isTesterPhoneHashAuthorized(
  phoneHash: string,
  configuredPhoneHashes: readonly string[]
): boolean {
  return bundledTesterPhoneHashes.includes(phoneHash as (typeof bundledTesterPhoneHashes)[number]) ||
    configuredPhoneHashes.includes(phoneHash);
}
