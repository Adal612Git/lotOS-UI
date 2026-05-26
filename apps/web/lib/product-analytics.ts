export type ProductEventName =
  | 'free_page_view'
  | 'free_start_clicked'
  | 'claim_code_submitted'
  | 'claim_code_success'
  | 'claim_code_failed'
  | 'demo_student_control_opened'
  | 'pricing_upgrade_clicked'
  | 'pro_surface_preview_clicked';

export function trackProductEvent(eventName: ProductEventName, payload?: Record<string, string | number | boolean | null>) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent('lotos:product-event', {
      detail: {
        eventName,
        payload: payload ?? {},
      },
    })
  );
}
