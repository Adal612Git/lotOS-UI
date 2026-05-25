import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import {
  hasProcessedProviderEvent,
  recordEntitlementAuditEvent,
} from '../../../../lib/entitlement-audit';
import { formatEntitlementError, formatEntitlementLogError, upsertEntitlement } from '../../../../lib/entitlements';
import { env } from '../../../../lib/env';
import {
  listSupportedLemonWebhookEvents,
  mapLemonWebhookEvent,
} from '../../../../lib/webhooks/lemon-event-mapper';

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
  return eventName ? listSupportedLemonWebhookEvents().includes(eventName) : false;
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
  const mapping = mapLemonWebhookEvent(payload);
  const eventName = mapping.eventName;

  if (!isSupportedEvent(eventName)) {
    await recordEntitlementAuditEvent({
      actorType: 'webhook',
      action: 'webhook_ignored',
      provider: 'lemon_squeezy',
      providerEventId: mapping.providerEventId,
      metadata: {
        eventName,
        reason: 'unsupported_event',
      },
    });
    return Response.json({ ok: true, ignored: true, event: eventName ?? 'unknown' }, { status: 202 });
  }

  if (mapping.action === 'reject_unmappable' || !mapping.userEmail || !mapping.plan || !mapping.status) {
    await recordEntitlementAuditEvent({
      actorType: 'webhook',
      action: 'webhook_failed',
      provider: 'lemon_squeezy',
      providerEventId: mapping.providerEventId,
      reason: mapping.reason,
      metadata: {
        eventName,
        action: mapping.action,
        hasUserEmail: Boolean(mapping.userEmail),
        hasPlan: Boolean(mapping.plan),
        hasVariantId: Boolean(mapping.variantId),
      },
    });
    return Response.json(
      {
        ok: false,
        error: 'Webhook payload cannot be mapped to a known entitlement action.',
      },
      { status: 400 }
    );
  }

  if (mapping.providerEventId) {
    const duplicate = await hasProcessedProviderEvent('lemon_squeezy', mapping.providerEventId);
    if (duplicate) {
      return Response.json({ ok: true, duplicate: true });
    }
  }

  await recordEntitlementAuditEvent({
    actorType: 'webhook',
    action: 'webhook_received',
    provider: 'lemon_squeezy',
    providerEventId: mapping.providerEventId,
    metadata: {
      eventName,
      action: mapping.action,
      status: mapping.status,
      hasUserEmail: Boolean(mapping.userEmail),
      hasVariantId: Boolean(mapping.variantId),
    },
  });

  try {
    const entitlement = await upsertEntitlement({
      userEmail: mapping.userEmail,
      plan: mapping.plan,
      source: 'lemon',
      provider: 'lemon_squeezy',
      providerCustomerId: mapping.providerCustomerId,
      providerSubscriptionId: mapping.providerSubscriptionId,
      providerOrderId: mapping.providerOrderId,
      providerEventId: mapping.providerEventId,
      status: mapping.status,
      metadata: {
        eventName,
        providerAction: mapping.action,
        providerEventId: mapping.providerEventId,
        variantId: mapping.variantId,
        lemonResourceId: payload.data?.id ?? null,
      },
    });

    await recordEntitlementAuditEvent({
      entitlementId: entitlement.id,
      actorType: 'webhook',
      action: 'webhook_applied',
      provider: 'lemon_squeezy',
      providerEventId: mapping.providerEventId,
      metadata: {
        eventName,
        action: mapping.action,
        status: mapping.status,
        plan: entitlement.plan,
      },
    });

    return Response.json({
      ok: true,
      entitlement: {
        plan: entitlement.plan,
        status: mapping.status,
      },
    });
  } catch (error) {
    await recordEntitlementAuditEvent({
      actorType: 'webhook',
      action: 'webhook_failed',
      provider: 'lemon_squeezy',
      providerEventId: mapping.providerEventId,
      reason: formatEntitlementLogError(error),
      metadata: {
        eventName,
        action: mapping.action,
        status: mapping.status,
        hasUserEmail: Boolean(mapping.userEmail),
        hasVariantId: Boolean(mapping.variantId),
      },
    });

    console.error('LotOS Lemon webhook persistence failed', {
      reason: formatEntitlementLogError(error),
      eventName,
      action: mapping.action,
      buyerIdentityPresent: Boolean(mapping.userEmail),
      hasVariantId: Boolean(mapping.variantId),
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
