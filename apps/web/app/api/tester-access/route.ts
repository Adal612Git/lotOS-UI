import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../auth-options';
import { normalizeEmail } from '../../../lib/owner';
import {
  authorizeTesterPhone,
  createTesterAccessToken,
  getExpiredTesterAccessCookieOptions,
  getTesterAccessCookieOptions,
  isTesterAccessConfigured,
  TESTER_ACCESS_COOKIE,
} from '../../../lib/tester-access';

export const runtime = 'nodejs';

type TesterAccessRequest = {
  phone?: unknown;
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const email = normalizeEmail(session?.user?.email);

  if (!email) {
    return Response.json({ ok: false, error: 'Google sign-in is required before tester unlock.' }, { status: 401 });
  }

  if (!isTesterAccessConfigured()) {
    return Response.json({ ok: false, error: 'Tester access is not configured.' }, { status: 503 });
  }

  let payload: TesterAccessRequest;
  try {
    payload = (await request.json()) as TesterAccessRequest;
  } catch {
    return Response.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const phone = typeof payload.phone === 'string' ? payload.phone : '';
  const authorizedPhone = authorizeTesterPhone(phone);

  if (!authorizedPhone) {
    return Response.json({ ok: false, error: 'This phone is not authorized for team QA access.' }, { status: 403 });
  }

  const { token, grant } = createTesterAccessToken({
    email,
    phoneHash: authorizedPhone.phoneHash,
  });
  const response = NextResponse.json({
    ok: true,
    email,
    plan: grant.plan,
    expiresAt: grant.expiresAt,
  });

  response.cookies.set(TESTER_ACCESS_COOKIE, token, getTesterAccessCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(TESTER_ACCESS_COOKIE, '', getExpiredTesterAccessCookieOptions());
  return response;
}
