/**
 * HASHCODE Analytics Engine.
 * Supports server-side event tracking.
 * Can be easily connected to PostHog, Umami, or Google Analytics.
 */

export async function trackEvent(
  userId: string, 
  event: string, 
  properties: Record<string, any> = {}
) {
  // 1. Console logging for development
  if (process.env.NODE_ENV !== "production") {
    console.log(`[ANALYTICS] User ${userId}: ${event}`, properties);
  }

  // 2. Integration with External Service (e.g. PostHog)
  const posthogKey = process.env.POSTHOG_API_KEY;
  const posthogHost = process.env.POSTHOG_HOST || "https://app.posthog.com";

  if (posthogKey) {
    try {
      await fetch(`${posthogHost}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: posthogKey,
          event,
          distinct_id: userId,
          properties: {
            ...properties,
            platform: "hashcode-web",
            environment: process.env.NODE_ENV
          },
          timestamp: new Date().toISOString()
        }),
      });
    } catch (_) {
      console.error("[ANALYTICS_CAPTURE_FAILED]", err);
    }
  }
}

/**
 * Funnel Tracking Helpers
 */
export const EVENTS = {
  ONBOARDING_STARTED: "onboarding_started",
  FIRST_MISSION_STARTED: "first_mission_started",
};
