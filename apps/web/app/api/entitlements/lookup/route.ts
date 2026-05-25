import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth-options';
import { formatEntitlementError, listAdminEntitlementsByEmail } from '../../../../lib/entitlements';
import { isOwnerEmail, normalizeEmail } from '../../../../lib/owner';

interface LookupPayload {
  userEmail?: string;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const ownerEmail = normalizeEmail(session?.user?.email);

  if (!ownerEmail || !isOwnerEmail(ownerEmail)) {
    return Response.json({ ok: false, error: 'Only owner accounts can inspect entitlements.' }, { status: 403 });
  }

  const payload = (await request.json()) as LookupPayload;
  const userEmail = normalizeEmail(payload.userEmail);

  if (!userEmail) {
    return Response.json({ ok: false, error: 'A valid buyer email is required.' }, { status: 400 });
  }

  try {
    const entitlements = await listAdminEntitlementsByEmail(userEmail);
    return Response.json({
      ok: true,
      entitlements,
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: formatEntitlementError(error) },
      { status: 500 }
    );
  }
}
