import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth-options';
import { recordEntitlementAuditEvent } from '../../../../lib/entitlement-audit';
import { formatEntitlementError, revokeEntitlement } from '../../../../lib/entitlements';
import { isOwnerEmail, normalizeEmail } from '../../../../lib/owner';
import { normalizePlan } from '../../../../lib/plans';

interface RevokePayload {
  userEmail?: string;
  plan?: string;
  reason?: string;
  internalNote?: string;
}

function cleanRequiredText(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed && trimmed.length >= 8 ? trimmed : null;
}

function cleanOptionalText(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const ownerEmail = normalizeEmail(session?.user?.email);

  if (!ownerEmail || !isOwnerEmail(ownerEmail)) {
    return Response.json({ ok: false, error: 'Only owner accounts can revoke access.' }, { status: 403 });
  }

  const payload = (await request.json()) as RevokePayload;
  const userEmail = normalizeEmail(payload.userEmail);
  const revokeReason = cleanRequiredText(payload.reason);
  const internalNote = cleanOptionalText(payload.internalNote);
  const requestedPlan = payload.plan && payload.plan !== 'all' ? normalizePlan(payload.plan) : null;

  if (!userEmail) {
    return Response.json({ ok: false, error: 'A valid buyer email is required.' }, { status: 400 });
  }

  if (!revokeReason) {
    return Response.json({ ok: false, error: 'Revocation reason is required.' }, { status: 400 });
  }

  if (payload.plan && payload.plan !== 'all' && (!requestedPlan || requestedPlan === 'free')) {
    return Response.json({ ok: false, error: 'Select a valid paid plan or all paid plans.' }, { status: 400 });
  }

  try {
    const revoked = await revokeEntitlement({
      userEmail,
      plan: requestedPlan,
      revokedBy: ownerEmail,
      revokeReason,
      internalNote,
    });

    if (revoked.length === 0) {
      return Response.json({ ok: false, error: 'No matching paid entitlement was found.' }, { status: 404 });
    }

    await Promise.all(
      revoked.map((entry) =>
        recordEntitlementAuditEvent({
          entitlementId: entry.id,
          actorType: 'owner',
          actorRef: ownerEmail,
          action: 'entitlement_revoked',
          reason: revokeReason,
          provider: entry.provider ?? null,
          metadata: {
            plan: entry.plan,
            scope: requestedPlan ? 'single_plan' : 'all_paid_plans',
            hasInternalNote: Boolean(internalNote),
          },
        })
      )
    );

    return Response.json({
      ok: true,
      revokedCount: revoked.length,
      plans: revoked.map((entry) => entry.plan),
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: formatEntitlementError(error) },
      { status: 500 }
    );
  }
}
