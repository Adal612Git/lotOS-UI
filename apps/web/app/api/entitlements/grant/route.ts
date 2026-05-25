import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth-options';
import { recordEntitlementAuditEvent } from '../../../../lib/entitlement-audit';
import { formatEntitlementError, upsertEntitlement } from '../../../../lib/entitlements';
import { isOwnerEmail, normalizeEmail } from '../../../../lib/owner';
import { normalizePlan } from '../../../../lib/plans';

interface GrantPayload {
  userEmail?: string;
  plan?: string;
  grantMode?: string;
  provider?: string;
  paymentReference?: string;
  recoveryReason?: string;
  internalNote?: string;
  trialDays?: number;
  evidenceReviewed?: boolean;
}

type GrantMode = 'test' | 'paid_recovery';
type ManualProvider = 'lemon_squeezy' | 'mercado_pago' | 'paypal' | 'manual';

const manualProviders = new Set<ManualProvider>(['lemon_squeezy', 'mercado_pago', 'paypal', 'manual']);
const allowedTrialDays = new Set([7, 14, 30]);

function normalizeGrantMode(value: string | undefined): GrantMode | null {
  if (!value) {
    return 'test';
  }

  const normalized = value.trim().toLowerCase().replaceAll('-', '_');

  if (normalized === 'test' || normalized === 'paid_recovery') {
    return normalized;
  }

  return null;
}

function normalizeProvider(value: string | undefined): ManualProvider | null {
  const normalized = (value || 'manual').trim().toLowerCase().replaceAll('-', '_');
  return manualProviders.has(normalized as ManualProvider) ? (normalized as ManualProvider) : null;
}

function normalizeTrialDays(value: number | undefined): number {
  if (!value) {
    return 14;
  }

  return allowedTrialDays.has(value) ? value : 14;
}

function cleanOptionalText(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const ownerEmail = normalizeEmail(session?.user?.email);

  if (!ownerEmail || !isOwnerEmail(ownerEmail)) {
    return Response.json({ ok: false, error: 'Only owner accounts can grant access.' }, { status: 403 });
  }

  const payload = (await request.json()) as GrantPayload;
  const plan = normalizePlan(payload.plan);
  const grantMode = normalizeGrantMode(payload.grantMode);

  if (!plan || plan === 'free') {
    return Response.json({ ok: false, error: 'Select a valid paid plan.' }, { status: 400 });
  }

  if (!grantMode) {
    return Response.json({ ok: false, error: 'Select a valid manual grant mode.' }, { status: 400 });
  }

  const userEmail = normalizeEmail(payload.userEmail);

  if (!userEmail) {
    return Response.json({ ok: false, error: 'A valid buyer email is required.' }, { status: 400 });
  }

  const provider = normalizeProvider(payload.provider);
  if (!provider) {
    return Response.json({ ok: false, error: 'Select a supported provider.' }, { status: 400 });
  }

  const paymentReference = cleanOptionalText(payload.paymentReference);
  const recoveryReason = cleanOptionalText(payload.recoveryReason);
  const internalNote = cleanOptionalText(payload.internalNote);
  const trialDays = grantMode === 'test' ? normalizeTrialDays(payload.trialDays) : null;

  if (grantMode === 'paid_recovery' && !recoveryReason) {
    return Response.json({ ok: false, error: 'Recovery reason is required for paid recovery.' }, { status: 400 });
  }

  if (grantMode === 'paid_recovery' && payload.evidenceReviewed !== true) {
    return Response.json({ ok: false, error: 'Payment evidence review is required for paid recovery.' }, { status: 400 });
  }

  const source =
    grantMode === 'test'
      ? `manual_owner_test:${provider}`
      : `manual_owner_paid_recovery:${provider}`;

  try {
    const entitlement = await upsertEntitlement({
      userEmail,
      plan,
      source,
      provider,
      createdByOwnerEmail: ownerEmail,
      internalNote,
      paymentReference,
      recoveryReason,
      trialDays,
      metadata: {
        grantMode,
        createdByOwnerEmail: ownerEmail,
        paymentProvider: provider,
        paymentReference,
        recoveryReason,
        internalNote,
        trialDays,
        evidenceReviewed: payload.evidenceReviewed === true,
      },
    });

    await recordEntitlementAuditEvent({
      entitlementId: entitlement.id,
      actorType: 'owner',
      actorRef: ownerEmail,
      action: grantMode === 'test' ? 'manual_test_granted' : 'paid_recovery_granted',
      reason: grantMode === 'paid_recovery' ? recoveryReason : internalNote,
      provider,
      metadata: {
        plan,
        grantMode,
        trialDays,
        hasPaymentReference: Boolean(paymentReference),
        hasInternalNote: Boolean(internalNote),
        evidenceReviewed: payload.evidenceReviewed === true,
      },
    });

    return Response.json({
      ok: true,
      entitlement: {
        plan: entitlement.plan,
        user_email: entitlement.user_email,
      },
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: formatEntitlementError(error) },
      { status: 500 }
    );
  }
}
