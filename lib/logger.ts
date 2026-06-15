/**
 * Centralized logging and alerting for HASHCODE Infrastructure.
 */

const SENSITIVE_KEYS = [
  "email", "token", "secret", "idToken", "sessionToken", "password", 
  "access_token", "refresh_token", "otp", "code", "authorization",
  "cookie", "key", "apiKey", "ip", "userAgent"
];

/**
 * Filtre récursif pour masquer les données sensibles dans les métadonnées.
 */
export function sanitizeMetadata(data: any): any {
  if (!data || typeof data !== "object") return data;
  
  if (Array.isArray(data)) {
    return data.map(sanitizeMetadata);
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const isSensitive = SENSITIVE_KEYS.some(sk => key.toLowerCase().includes(sk.toLowerCase()));
    
    if (isSensitive && value) {
      sanitized[key] = "[MASKED]";
    } else if (typeof value === "object") {
      sanitized[key] = sanitizeMetadata(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export async function logError(title: string, error: any, metadata: Record<string, any> = {}) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : "No stack trace";
  
  console.error(`[${title.toUpperCase()}] ${message}`, { metadata, stack });

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const sanitizedMetadata = sanitizeMetadata(metadata);

  try {
    const payload = {
      username: "HASHCODE Monitor",
      avatar_url: "https://joinhashcode.com/app-icon.png",
      embeds: [
        {
          title: `🚨 ERROR: ${title}`,
          description: `**Message:** ${message}\n\n**Environment:** ${process.env.NODE_ENV}`,
          color: 0xff4444, // Red
          fields: [
            ...Object.entries(sanitizedMetadata).map(([key, value]) => ({
              name: key,
              value: String(value),
              inline: true,
            })),
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Protocole de Surveillance HASHCODE",
          },
        },
      ],
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (alertError) {
    console.error("[ALERTING_FAILED]", alertError);
  }
}

export async function logInfo(title: string, message: string, metadata: Record<string, any> = {}) {
  const sanitizedMetadata = sanitizeMetadata(metadata);
  console.log(`[INFO] ${title}: ${message}`, sanitizedMetadata);

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const payload = {
      username: "HASHCODE Monitor",
      embeds: [
        {
          title: `ℹ️ INFO: ${title}`,
          description: message,
          color: 0x44ff44, // Green
          fields: [
            ...Object.entries(sanitizedMetadata).map(([key, value]) => ({
              name: key,
              value: String(value),
              inline: true,
            })),
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silent fail for info logs
  }
}
