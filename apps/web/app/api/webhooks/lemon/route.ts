import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { formatEntitlementError, upsertEntitlement } from '../../../../lib/entitlements';
import { env } from '../../../../lib/env';
import type { CommercialPlan } from '../../../../lib/plans';

export const runtime = 'nodejs';

const webhookSchema = z
  .object({
    meta: z
      .object({
        event_name: z.string().optional(),
        custom_data: z.record(z.unknown()).optional(),
      })
      .passthrough()
      .optional(),
    data: z
      .object({
        id: z.string().optional(),
        attributes: z
          .object({
            user_email: z.string().email().optional(),
            variant_id: z.union([z.string(), z.number()]).optional(),
            first_order_item: z
              .object({
                variant_id: z.union([z.string(), z.number()]).optional(),
              })
              .optional(),
          })
          .passthrough()
          .optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

function isSupportedEvent(eventName: string | undefined) {
  return (
    eventName === 'order_created' ||
    eventName === 'subscription_created' ||
    eventName === 'subscription_payment_success' ||
    eventName === 'subscription_resumed'
  );
}

function timingSafeMatch(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(receivedBuffer, expectedBuffer);
}

function validateSignature(rawBody: string, signature: string) {
  const digest = createHmac('sha256', env.LEMON_WEBHOOK_SECRET!).update(rawBody).digest('hex');
  return timingSafeMatch(signature, digest);
}

function resolvePlanFromVariantId(variantId: string | null): CommercialPlan | null {
  if (!variantId) {
    return null;
  }

  if (variantId === env.LEMON_SOLO_VARIANT_ID) {
    return 'solo';
  }
  if (variantId === env.LEMON_PRO_VARIANT_ID) {
    return 'pro';
  }
  if (variantId === env.LEMON_LAUNCH_VARIANT_ID) {
    return 'launch_pack';
  }

  return null;
}

function readVariantId(payload: z.infer<typeof webhookSchema>) {
  const directVariantId = payload.data?.attributes?.variant_id;
  const orderVariantId = payload.data?.attributes?.first_order_item?.variant_id;
  const resolved = directVariantId ?? orderVariantId;

  if (resolved === undefined || resolved === null) {
    return null;
  }

  return String(resolved);
}

function readUserEmail(payload: z.infer<typeof webhookSchema>) {
  const directEmail = payload.data?.attributes?.user_email;
  const customEmail = payload.meta?.custom_data?.user_email;

  if (typeof directEmail === 'string' && directEmail.length > 0) {
    return directEmail;
  }

  if (typeof customEmail === 'string' && customEmail.length > 0) {
    return customEmail;
  }

  return null;
}

export async function POST(request: Request) {
  if (!env.LEMON_WEBHOOK_SECRET) {
    return Response.json({ ok: false, error: 'Missing LEMON_WEBHOOK_SECRET.' }, { status: 503 });
  }

  const signature = request.headers.get('X-Signature');

  if (!signature) {
    return Response.json({ ok: false, error: 'Missing X-Signature header.' }, { status: 401 });
  }

  const rawBody = await request.text();

  if (!validateSignature(rawBody, signature)) {
    return Response.json({ ok: false, error: 'Invalid webhook signature.' }, { status: 401 });
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawBody);
  } catch {
    return Response.json({ ok: false, error: 'Webhook body is not valid JSON.' }, { status: 400 });
  }

  const parsedPayload = webhookSchema.safeParse(parsedJson);

  if (!parsedPayload.success) {
    return Response.json({ ok: false, error: 'Invalid Lemon Squeezy payload.' }, { status: 400 });
  }

  const payload = parsedPayload.data;
  const eventName = payload.meta?.event_name;

  if (!isSupportedEvent(eventName)) {
    return Response.json({ ok: true, ignored: true, event: eventName ?? 'unknown' }, { status: 202 });
  }

  const userEmail = readUserEmail(payload);
  const variantId = readVariantId(payload);
  const plan = resolvePlanFromVariantId(variantId);

  if (!userEmail || !plan) {
    return Response.json(
      {
        ok: false,
        error: 'Webhook payload is missing user_email or a known variant_id mapping.',
      },
      { status: 400 }
    );
  }

  try {
    const entitlement = await upsertEntitlement({
      userEmail,
      plan,
      source: 'lemon',
      metadata: {
        eventName,
        variantId,
        lemonResourceId: payload.data?.id ?? null,
      },
    });

    return Response.json({
      ok: true,
      entitlement: {
        email: entitlement.user_email,
        plan: entitlement.plan,
      },
    });
  } catch (error) {
    console.error('LotOS Lemon webhook failed to persist entitlement', {
      reason: formatEntitlementError(error),
      eventName,
      userEmail,
      variantId,
    });

    return Response.json(
      {
        ok: false,
        error: formatEntitlementError(error),
      },
      { status: 500 }
    );
  }
}
