// src/lib/analytics.ts
// Google Analytics 4 integration — controlled entirely via env var
// Set VITE_GA_MEASUREMENT_ID in .env to enable tracking

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

/** True when GA4 is configured and gtag is loaded */
export const isAnalyticsEnabled = (): boolean => {
  return Boolean(GA_ID && typeof window.gtag === 'function');
};

/**
 * Track a page view. Called automatically by usePageTracking().
 */
export function trackPageView(path: string, title?: string) {
  if (!isAnalyticsEnabled()) return;
  window.gtag!('config', GA_ID!, {
    page_path: path,
    page_title: title ?? document.title,
  });
}

/**
 * Track a custom event.
 * @example trackEvent('event_registration', { event_id: 'abc123', event_name: 'Hackathon' })
 */
export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean>
) {
  if (!isAnalyticsEnabled()) return;
  window.gtag!('event', action, params);
}

/**
 * Track user identity (anonymous — no PII).
 * Only passes the role to GA4 for audience segmentation.
 */
export function identifyUserRole(role: string) {
  if (!isAnalyticsEnabled()) return;
  window.gtag!('set', 'user_properties', { user_role: role });
}
