/**
 * Analytics helpers: push events to dataLayer for GTM/GA4.
 * Safe when dataLayer is missing (SSR or no GTM ID).
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({
    event: eventName,
    ...properties,
  });
}

export function trackContactSubmitted(): void {
  trackEvent("contact_submitted", {
    form_name: "contact",
    form_location: "contact_page",
  });
}

/**
 * Minimal lead-funnel instrumentation (CEO audit, Track B). Two events per
 * lead form — start (first interaction) and submit (success) — both tagged
 * with the lead `source`, so completion rate per surface is answerable
 * without building an analytics cathedral. `form` is the human form label.
 *
 * Response-time SLA (Track B2) is measured CRM-side from crm_activities, not
 * here — it needs the team's first-contact timestamp, which the web app
 * never sees.
 */
export function trackLeadStart(source: string, form: string): void {
  trackEvent("lead_form_start", { source, form });
}

export function trackLeadSubmit(source: string, form: string): void {
  trackEvent("lead_form_submit", { source, form });
}
