import crypto from "crypto";
import { prisma } from "./prisma";

export type WebhookEvent =
  | "submission.created"
  | "submission.approved"
  | "submission.rejected"
  | "review.started";

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, unknown>;
}

function hmacSign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function sendWebhook(
  url: string,
  payload: WebhookPayload,
  secret: string
): Promise<{ success: boolean; status?: number; error?: string }> {
  const body = JSON.stringify(payload);
  const signature = hmacSign(body, secret);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
        "X-Webhook-Timestamp": payload.timestamp,
        "User-Agent": "HASHCODE-Webhooks/1.0",
      },
      body,
    });

    if (!response.ok) {
      return { success: false, status: response.status, error: `HTTP ${response.status}` };
    }

    return { success: true, status: response.status };
  } catch (error: unknown) {
    return { success: false, error: String(error) };
  }
}

export async function registerWebhook(
  missionId: string,
  url: string,
  events: WebhookEvent[],
  secret: string
) {
  return prisma.missionWebhook.create({
    data: {
      missionId,
      url,
      secret,
      events,
    },
  });
}

export async function getWebhooks(missionId: string) {
  return prisma.missionWebhook.findMany({
    where: { missionId, isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateWebhook(
  webhookId: string,
  data: { url?: string; events?: WebhookEvent[]; isActive?: boolean }
) {
  return prisma.missionWebhook.update({
    where: { id: webhookId },
    data,
  });
}

export async function deleteWebhook(webhookId: string) {
  return prisma.missionWebhook.delete({
    where: { id: webhookId },
  });
}

export async function triggerWebhooks(
  missionId: string,
  event: WebhookEvent,
  data: Record<string, unknown>
) {
  const webhooks = await getWebhooks(missionId);
  const relevantWebhooks = webhooks.filter((w) => w.events.includes(event));

  if (relevantWebhooks.length === 0) return;

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  const results = await Promise.allSettled(
    relevantWebhooks.map((webhook) => sendWebhook(webhook.url, payload, webhook.secret))
  );

  const failures = results
    .map((r, i) => (r.status === "rejected" || !r.value.success ? { webhook: relevantWebhooks[i], result: r } : null))
    .filter(Boolean);

  if (failures.length > 0) {
    console.error(`[WEBHOOK] ${failures.length}/${relevantWebhooks.length} webhooks failed for ${event}`, failures);
  }
}