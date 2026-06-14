/**
 * Centralized logging and alerting for HASHCODE Infrastructure.
 */

export async function logError(title: string, error: any, metadata: Record<string, any> = {}) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : "No stack trace";
  
  console.error(`[${title.toUpperCase()}] ${message}`, { metadata, stack });

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

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
            ...Object.entries(metadata).map(([key, value]) => ({
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
  console.log(`[INFO] ${title}: ${message}`, metadata);

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
            ...Object.entries(metadata).map(([key, value]) => ({
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
