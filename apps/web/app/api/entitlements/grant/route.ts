import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth-options';
import { formatEntitlementError, upsertEntitlement } from '../../../../lib/entitlements';
import { isOwnerEmail, normalizeEmail } from '../../../../lib/owner';
import { normalizePlan } from '../../../../lib/plans';

interface GrantPayload {
  userEmail?: string;
  plan?: string;
  provider?: string;
  paymentReference?: string;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const ownerEmail = normalizeEmail(session?.user?.email);

  if (!ownerEmail || !isOwnerEmail(ownerEmail)) {
    return Response.json({ ok: false, error: 'Only owner accounts can grant access.' }, { status: 403 });
  }

  const payload = (await request.json()) as GrantPayload;
  const plan = normalizePlan(payload.plan);

  if (!plan || plan === 'free') {
    return Response.json({ ok: false, error: 'Select a valid paid plan.' }, { status: 400 });
  }

  const userEmail = normalizeEmail(payload.userEmail);

  if (!userEmail) {
    return Response.json({ ok: false, error: 'A valid buyer email is required.' }, { status: 400 });
  }

  const provider = payload.provider?.trim() || 'manual';
  const paymentReference = payload.paymentReference?.trim();

  try {
    const entitlement = await upsertEntitlement({
      userEmail,
      plan,
      source: `manual_owner_grant:${provider}`,
      metadata: {
        grantedBy: ownerEmail,
        paymentProvider: provider,
        paymentReference: paymentReference || null,
      },
    });

    return Response.json({ ok: true, entitlement });
  } catch (error) {
    return Response.json(
      { ok: false, error: formatEntitlementError(error) },
      { status: 500 }
    );
  }
}
