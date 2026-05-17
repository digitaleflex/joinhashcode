import { Client } from "@upstash/qstash";

if (!process.env.QSTASH_TOKEN) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("QSTASH_TOKEN is required in production");
  }
}

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN || "development_token",
});

export interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}

export async function triggerNotification(payload: NotificationPayload) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  return await qstash.publishJSON({
    url: `${APP_URL}/api/internal/notify`,
    body: payload,
  });
}
