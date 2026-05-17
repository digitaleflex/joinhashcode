import { Client } from "@upstash/qstash";
import { APP_URL } from "./config";

if (!process.env.QSTASH_TOKEN && process.env.NODE_ENV === "production") {
  throw new Error("QSTASH_TOKEN is required in production");
}

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN || "development_token",
});

export interface NotificationPayload {
  userId: string;
  type: "MISSION_APPROVED" | "DAILY_REMINDER" | "LEVEL_UP" | "SYSTEM";
  title: string;
  message: string;
  link?: string;
}

export async function triggerNotification(payload: NotificationPayload) {
  const hasQStashKeys =
    process.env.QSTASH_CURRENT_SIGNING_KEY &&
    process.env.QSTASH_CURRENT_SIGNING_KEY !== "test_key";

  if (hasQStashKeys) {
    return await qstash.publishJSON({
      url: `${APP_URL}/api/internal/notify`,
      body: payload,
    });
  }

  // Dev/preview: call directly with internal secret
  return await fetch(`${APP_URL}/api/internal/notify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
    },
    body: JSON.stringify(payload),
  });
}
