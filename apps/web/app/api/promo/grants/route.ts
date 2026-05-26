import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth-options';
import {
  createPromoGrant,
  listPromoGrantEventsForOwner,
  listPromoGrantsForOwner,
  revokePromoGrant,
  type PromoGrantType,
} from '../../../../lib/promo-grants';
import { isOwnerEmail, normalizeEmail } from '../../../../lib/owner';

interface PromoGrantPayload {
  code?: string;
  label?: string;
  campaignName?: string;
  grantType?: PromoGrantType;
  planKey?: string;
  maxClaims?: number;
  startsAt?: string;
  expiresAt?: string;
  notes?: string;
}

async function requireOwner() {
  const session = await getServerSession(authOptions);
  const ownerEmail = normalizeEmail(session?.user?.email);

  if (!ownerEmail || !isOwnerEmail(ownerEmail)) {
    return null;
  }

  return ownerEmail;
}

export async function GET() {
  const ownerEmail = await requireOwner();

  if (!ownerEmail) {
    return Response.json({ ok: false, error: 'Owner access required.' }, { status: 403 });
  }

  try {
    const [grants, events] = await Promise.all([
      listPromoGrantsForOwner(),
      listPromoGrantEventsForOwner().catch(() => []),
    ]);

    return Response.json({ ok: true, grants, events });
  } catch {
    return Response.json({ ok: false, error: 'Promotional grant storage is not available.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const ownerEmail = await requireOwner();

  if (!ownerEmail) {
    return Response.json({ ok: false, error: 'Owner access required.' }, { status: 403 });
  }

  const payload = (await request.json().catch(() => ({}))) as PromoGrantPayload;

  if (!payload.code || !payload.label || !payload.grantType) {
    return Response.json({ ok: false, error: 'Code, label, and grant type are required.' }, { status: 400 });
  }

  try {
    const grant = await createPromoGrant({
      code: payload.code,
      label: payload.label,
      campaignName: payload.campaignName,
      grantType: payload.grantType,
      planKey: payload.planKey,
      maxClaims: payload.maxClaims,
      startsAt: payload.startsAt,
      expiresAt: payload.expiresAt,
      createdBy: ownerEmail,
      notes: payload.notes,
    });

    return Response.json({ ok: true, grant });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create promotional grant.';
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const ownerEmail = await requireOwner();

  if (!ownerEmail) {
    return Response.json({ ok: false, error: 'Owner access required.' }, { status: 403 });
  }

  const payload = (await request.json().catch(() => ({}))) as { id?: string; action?: string };

  if (!payload.id || payload.action !== 'revoke') {
    return Response.json({ ok: false, error: 'Grant id and revoke action are required.' }, { status: 400 });
  }

  try {
    return Response.json({ ok: true, grant: await revokePromoGrant({ id: payload.id, revokedBy: ownerEmail }) });
  } catch {
    return Response.json({ ok: false, error: 'Unable to revoke promotional grant.' }, { status: 500 });
  }
}
