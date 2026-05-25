import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { env } from './env';
import { normalizeEmail } from './owner';
import { planSatisfies, type CommercialPlan } from './plans';

export const TESTER_ACCESS_COOKIE = 'lotos_tester_access';
export const TESTER_ACCESS_PLAN: CommercialPlan = 'launch_pack';
export const TESTER_ACCESS_SOURCE = 'manual_owner_test:team_phone';

const testerAccessMaxAgeSeconds = 14 * 24 * 60 * 60;

const bundledTesterPhoneHashes = [
  'e91fb357689946b6d11ef4fe1cd323a85b4f6e928eadae4c9f710d8b366082ed',
  'e81544a50cca0c69bd09e5ba7fe30def53cf40f9824acea2f270f95747fb7cc2',
] as const;

type TesterAccessPayload = {
  v: 1;
  role: 'team_qa';
  email: string | null;
  phoneHash: string;
  issuedAt: string;
  expiresAt: string;
};

export type TesterAccessGrant = {
  email: string | null;
  phoneHash: string;
  issuedAt: string;
  expiresAt: string;
  plan: CommercialPlan;
  source: string;
};

function getTesterSigningSecret(): string | null {
  const secret = env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  return secret && secret.length >= 16 ? secret : null;
}

export function getAuthorizedTesterPhoneHashes(): Set<string> {
  return new Set([...bundledTesterPhoneHashes, ...env.testerPhoneHashes]);
}

export function isTesterAccessConfigured(): boolean {
  return Boolean(getTesterSigningSecret() && getAuthorizedTesterPhoneHashes().size > 0);
}

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

export function hashTesterPhone(normalizedPhone: string): string {
  return createHash('sha256').update(normalizedPhone).digest('hex');
}

function getPhoneHashCandidates(normalizedPhone: string): string[] {
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

  return [...candidates].map(hashTesterPhone);
}

export function authorizeTesterPhone(value: string | null | undefined): { phoneHash: string } | null {
  const normalizedPhone = normalizeTesterPhone(value);
  if (!normalizedPhone) {
    return null;
  }

  const authorizedPhoneHashes = getAuthorizedTesterPhoneHashes();
  const phoneHash = getPhoneHashCandidates(normalizedPhone).find((candidate) =>
    authorizedPhoneHashes.has(candidate)
  );

  return phoneHash ? { phoneHash } : null;
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function signaturesMatch(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function createTesterAccessToken(input: {
  email?: string | null;
  phoneHash: string;
  now?: Date;
}): { token: string; grant: TesterAccessGrant } {
  const secret = getTesterSigningSecret();
  const email = normalizeEmail(input.email);

  if (!secret) {
    throw new Error('Tester access signing secret is not configured.');
  }
  if (!getAuthorizedTesterPhoneHashes().has(input.phoneHash)) {
    throw new Error('Tester phone is not authorized.');
  }

  const now = input.now ?? new Date();
  const issuedAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + testerAccessMaxAgeSeconds * 1000).toISOString();
  const payload: TesterAccessPayload = {
    v: 1,
    role: 'team_qa',
    email,
    phoneHash: input.phoneHash,
    issuedAt,
    expiresAt,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = signPayload(encodedPayload, secret);

  return {
    token: `${encodedPayload}.${signature}`,
    grant: {
      email: email ?? null,
      phoneHash: input.phoneHash,
      issuedAt,
      expiresAt,
      plan: TESTER_ACCESS_PLAN,
      source: TESTER_ACCESS_SOURCE,
    },
  };
}

export function verifyTesterAccessToken(
  token: string | null | undefined,
  expectedEmail: string | null | undefined,
  now: Date = new Date()
): TesterAccessGrant | null {
  const secret = getTesterSigningSecret();
  const email = normalizeEmail(expectedEmail);

  if (!token || !secret) {
    return null;
  }

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload, secret);
  if (!signaturesMatch(signature, expectedSignature)) {
    return null;
  }

  let payload: TesterAccessPayload;
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as TesterAccessPayload;
  } catch {
    return null;
  }
  const payloadEmail = normalizeEmail(payload.email);

  if (
    payload.v !== 1 ||
    payload.role !== 'team_qa' ||
    (payloadEmail && email && payloadEmail !== email) ||
    !getAuthorizedTesterPhoneHashes().has(payload.phoneHash)
  ) {
    return null;
  }

  const expiresAt = new Date(payload.expiresAt);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= now.getTime()) {
    return null;
  }

  return {
    email: payloadEmail ?? email ?? null,
    phoneHash: payload.phoneHash,
    issuedAt: payload.issuedAt,
    expiresAt: payload.expiresAt,
    plan: TESTER_ACCESS_PLAN,
    source: TESTER_ACCESS_SOURCE,
  };
}

export async function getActiveTesterAccess(email: string | null | undefined): Promise<TesterAccessGrant | null> {
  let token: string | undefined;
  try {
    const cookieStore = await cookies();
    token = cookieStore.get(TESTER_ACCESS_COOKIE)?.value;
  } catch {
    return null;
  }

  return verifyTesterAccessToken(token, email);
}

export async function hasTesterPlanAccess(
  email: string | null | undefined,
  requiredPlan: CommercialPlan
): Promise<boolean> {
  const grant = await getActiveTesterAccess(email);
  return Boolean(grant && planSatisfies(grant.plan, requiredPlan));
}

export function getTesterAccessCookieOptions() {
  return {
    httpOnly: true,
    maxAge: testerAccessMaxAgeSeconds,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };
}

export function getExpiredTesterAccessCookieOptions() {
  return {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };
}
