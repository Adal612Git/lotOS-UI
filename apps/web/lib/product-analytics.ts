export type ProductEventName =
  | 'free_page_view'
  | 'free_start_clicked'
  | 'creator_pass_cta_clicked'
  | 'claim_started'
  | 'claim_code_submitted'
  | 'claim_code_success'
  | 'claim_code_failed'
  | 'claim_success'
  | 'claim_failed'
  | 'demo_student_control_opened'
  | 'demo_opened'
  | 'pricing_viewed'
  | 'pricing_upgrade_clicked'
  | 'upgrade_clicked'
  | 'pro_surface_preview_clicked'
  | 'pro_surface_previewed'
  | 'export_clicked'
  | 'grant_created'
  | 'grant_revoked';

type ProductEventPayload = Record<string, string | number | boolean | null | undefined>;

const blockedPayloadKeys = /email|phone|code|token|secret|cookie|authorization/i;

function sanitizePayload(payload: ProductEventPayload = {}) {
  return Object.fromEntries(
    Object.entries(payload)
      .filter(([key, value]) => !blockedPayloadKeys.test(key) && value !== undefined)
      .map(([key, value]) => [key, value ?? null])
  );
}

export function trackProductEvent(eventName: ProductEventName, payload?: ProductEventPayload) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent('lotos:product-event', {
      detail: {
        eventName,
        payload: sanitizePayload(payload),
      },
    })
  );
}
