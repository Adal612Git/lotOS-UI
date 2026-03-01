import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { hasEntitlementViaRest } from './lib/entitlements-rest';
import { env } from './lib/env';
import { isOwnerEmail, normalizeEmail } from './lib/owner';
import type { CommercialPlan } from './lib/plans';

function resolveRequiredPlan(pathname: string): CommercialPlan | null {
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

function redirectToLogin(request: NextRequest) {
  const url = new URL('/login', request.url);
  url.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const requiredPlan = resolveRequiredPlan(request.nextUrl.pathname);

  if (!requiredPlan) {
    return NextResponse.next();
  }

  if (!env.AUTH_SECRET) {
    return redirectToLogin(request);
  }

  const token = await getToken({
    req: request,
    secret: env.AUTH_SECRET,
  });

  const email = normalizeEmail(typeof token?.email === 'string' ? token.email : null);

  if (!email) {
    return redirectToLogin(request);
  }

  if (requiredPlan === 'free' || isOwnerEmail(email)) {
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
