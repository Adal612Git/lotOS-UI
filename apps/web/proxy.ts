import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getRequiredPlanForPath } from './lib/access-policy';
import { hasEntitlementViaRest } from './lib/entitlements-rest';
import { env } from './lib/env';
import { isOwnerEmail, normalizeEmail } from './lib/owner';
import { isTesterPhoneHashAuthorized, TESTER_ACCESS_COOKIE } from './lib/tester-access-policy';

function redirectToLogin(request: NextRequest) {
  const url = new URL('/login', request.url);
  url.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function redirectToTeamAccess(request: NextRequest) {
  const url = new URL('/team-access', request.url);
  url.searchParams.set('state', 'qa-required');
  url.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function base64UrlEncode(bytes: ArrayBuffer) {
  let binary = '';
  for (const byte of new Uint8Array(bytes)) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string) {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return atob(padded);
}

function signaturesMatch(actual: string, expected: string) {
  if (actual.length !== expected.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < actual.length; index += 1) {
    mismatch |= actual.charCodeAt(index) ^ expected.charCodeAt(index);
  }

  return mismatch === 0;
}

async function hasTesterAccessCookie(request: NextRequest) {
  const token = request.cookies.get(TESTER_ACCESS_COOKIE)?.value;
  const secret = env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!token || !secret || secret.length < 16) {
    return false;
  }

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    return false;
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const expectedSignature = base64UrlEncode(await crypto.subtle.sign('HMAC', key, encoder.encode(encodedPayload)));

  if (!signaturesMatch(signature, expectedSignature)) {
    return false;
  }

  let payload: {
    v?: unknown;
    role?: unknown;
    phoneHash?: unknown;
    expiresAt?: unknown;
  };
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as typeof payload;
  } catch {
    return false;
  }

  if (
    payload.v !== 1 ||
    payload.role !== 'team_qa' ||
    typeof payload.phoneHash !== 'string' ||
    typeof payload.expiresAt !== 'string'
  ) {
    return false;
  }

  const expiresAt = new Date(payload.expiresAt);

  return (
    isTesterPhoneHashAuthorized(payload.phoneHash, env.testerPhoneHashes) &&
    !Number.isNaN(expiresAt.getTime()) &&
    expiresAt.getTime() > Date.now()
  );
}

export async function proxy(request: NextRequest) {
  const requiredPlan = getRequiredPlanForPath(request.nextUrl.pathname);

  if (!requiredPlan) {
    return NextResponse.next();
  }

  if (!env.AUTH_SECRET) {
    return redirectToLogin(request);
  }

  if (requiredPlan === 'free') {
    return NextResponse.next();
  }

  if (await hasTesterAccessCookie(request)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: env.AUTH_SECRET,
  });

  const email = normalizeEmail(typeof token?.email === 'string' ? token.email : null);

  if (!email) {
    return redirectToTeamAccess(request);
  }

  if (isOwnerEmail(email)) {
    return NextResponse.next();
  }

  const allowed = await hasEntitlementViaRest(email, requiredPlan);

  if (allowed) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/pricing', request.url));
}

export const config = {
  matcher: ['/vault/:path*'],
};
