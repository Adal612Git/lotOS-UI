import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth-options';
import { claimPromoCodeForEmail } from '../../../../lib/promo-grants';
import { normalizeEmail } from '../../../../lib/owner';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const email = normalizeEmail(session?.user?.email);
  const payload = (await request.json().catch(() => ({}))) as { code?: string };

  if (!email) {
    return Response.json({ ok: false, status: 'login_required' }, { status: 401 });
  }

  try {
    const result = await claimPromoCodeForEmail({
      code: payload.code ?? '',
      email,
    });

    const ok = result.status === 'success' || result.status === 'already_claimed';
    const status = result.status === 'configuration_required' ? 503 : 200;

    return Response.json({ ok, status: result.status, grant: result.grant }, { status });
  } catch {
    return Response.json(
      { ok: false, status: 'configuration_required', grant: null },
      { status: 503 }
    );
  }
}
