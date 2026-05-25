import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../auth-options';
import { resolveCurrentAccess } from '../../../lib/access-resolver';
import { recordEntitlementAuditEvent } from '../../../lib/entitlement-audit';
import { formatEntitlementLogError, upsertEntitlement } from '../../../lib/entitlements';
import { normalizeEmail } from '../../../lib/owner';
import {
  authorizeTesterPhone,
  createTesterAccessToken,
  getExpiredTesterAccessCookieOptions,
  getActiveTesterAccess,
  getTesterAccessCookieOptions,
  isTesterAccessConfigured,
  TESTER_ACCESS_COOKIE,
} from '../../../lib/tester-access';

export const runtime = 'nodejs';

const TEAM_QA_ACTOR_REF = 'team-phone-qa';
const TEAM_QA_OWNER_EMAIL = 'team-phone-qa@lotos.local';
const TEAM_QA_TRIAL_DAYS = 30;
const TEAM_QA_INTERNAL_NOTE = 'Automatic team QA grant from authorized phone unlock.';

type TesterAccessRequest = {
  phone?: unknown;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = normalizeEmail(session?.user?.email);
  const qaCookie = await getActiveTesterAccess(email);
  const access = await resolveCurrentAccess('launch_pack');

  return Response.json({
    ok: true,
    configured: isTesterAccessConfigured(),
    qaCookieDetected: Boolean(qaCookie),
    tier: access.tier,
    source: access.source,
    expiresAt: access.expiresAt,
    allowed: access.allowed,
    capabilities: access.capabilities,
    warnings: access.warnings,
  });
}

async function persistTesterEntitlement(input: {
  email: string;
  grant: ReturnType<typeof createTesterAccessToken>['grant'];
}) {
  try {
    const entitlement = await upsertEntitlement({
      userEmail: input.email,
      plan: input.grant.plan,
      source: input.grant.source,
      provider: 'manual',
      createdByOwnerEmail: TEAM_QA_OWNER_EMAIL,
      internalNote: TEAM_QA_INTERNAL_NOTE,
      paymentReference: TEAM_QA_ACTOR_REF,
      trialDays: TEAM_QA_TRIAL_DAYS,
      metadata: {
        grantMode: 'test',
        paymentProvider: 'manual',
        paymentReference: TEAM_QA_ACTOR_REF,
        internalNote: TEAM_QA_INTERNAL_NOTE,
        qaAccess: true,
        qaGrantSource: 'team_phone',
        phoneVerified: true,
        trialDays: TEAM_QA_TRIAL_DAYS,
      },
    });

    await recordEntitlementAuditEvent({
      entitlementId: entitlement.id,
      actorType: 'system',
      actorRef: TEAM_QA_ACTOR_REF,
      action: 'manual_test_granted',
      reason: TEAM_QA_INTERNAL_NOTE,
      provider: 'manual',
      metadata: {
        plan: entitlement.plan,
        grantMode: 'test',
        qaAccess: true,
        qaGrantSource: 'team_phone',
        trialDays: TEAM_QA_TRIAL_DAYS,
      },
    });

    return {
      persisted: true,
      entitlement: {
        plan: entitlement.plan,
        user_email: entitlement.user_email,
      },
    };
  } catch (error) {
    console.error('Tester access entitlement persistence failed.', {
      error: formatEntitlementLogError(error),
    });

    return {
      persisted: false,
      warning: 'Temporary browser unlock activated; database grant could not be persisted.',
    };
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const email = normalizeEmail(session?.user?.email);

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
  const persistence = email
    ? await persistTesterEntitlement({ email, grant })
    : {
        persisted: false,
        warning: 'Browser QA unlock activated; no database email grant was created.',
      };
  const response = NextResponse.json({
    ok: true,
    email: email ?? null,
    plan: grant.plan,
    expiresAt: grant.expiresAt,
    ...persistence,
  });

  response.cookies.set(TESTER_ACCESS_COOKIE, token, getTesterAccessCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(TESTER_ACCESS_COOKIE, '', getExpiredTesterAccessCookieOptions());
  return response;
}
