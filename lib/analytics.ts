/**
 * HASHCODE Analytics Engine.
 * Supports server-side event tracking.
 * Can be easily connected to PostHog, Umami, or Google Analytics.
 */

import { logError, logInfo } from "./logger"
import type { Prisma } from "@/generated/prisma/client";

export async function trackEvent(
  userId: string,
  event: string,
  properties: Record<string, unknown> = {}
) {
  // 1. Structured logging for development
  if (process.env.NODE_ENV !== "production") {
    logInfo("Analytics", `User ${userId}: ${event}`, { properties } as Record<string, Prisma.InputJsonValue>);
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
     } catch (error: unknown) {
       logError("Analytics Capture", error);
     }
  }
}

/**
 * Funnel Tracking Helpers
 */
export const EVENTS = {
  ONBOARDING_STARTED: "onboarding_started",
  ONBOARDING_COMPLETED: "onboarding_completed",
  FIRST_MISSION_STARTED: "first_mission_started",
  FIRST_ACTION_STARTED: "first_action_started",
};

