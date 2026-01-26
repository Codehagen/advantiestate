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
