import { Client } from "@upstash/qstash";
import { APP_URL } from "./config";

// Initialisation lazy : le client est créé uniquement à la demande
// pour éviter un crash au moment du build Docker (où QSTASH_TOKEN n'existe pas)
function getQstashClient(): Client {
  if (!process.env.QSTASH_TOKEN && process.env.NODE_ENV === "production") {
    throw new Error("QSTASH_TOKEN is required in production");
  }
  return new Client({
    token: process.env.QSTASH_TOKEN || "development_token",
  });
}

export interface NotificationPayload {
  userId: string;
  type: "MISSION_APPROVED" | "DAILY_REMINDER" | "LEVEL_UP" | "SYSTEM" | "MISSION_REVIEW_RELEASED";
  title: string;
  message: string;
  link?: string;
  xp?: number;
  newLevel?: number;
}

export async function triggerNotification(payload: NotificationPayload) {
  const hasQStashKeys =
    process.env.QSTASH_CURRENT_SIGNING_KEY &&
    process.env.QSTASH_CURRENT_SIGNING_KEY !== "test_key";

  if (hasQStashKeys) {
    const qstash = getQstashClient(); // vérification à l'exécution, pas au build
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
