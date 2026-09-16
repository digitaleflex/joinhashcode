type AlertLevel = "info" | "warning" | "critical";

interface AlertField {
  name: string;
  value: string;
  inline?: boolean;
}

interface SendAlertOptions {
  level: AlertLevel;
  title: string;
  message: string;
  fields?: AlertField[];
  timestamp?: Date;
}

const WEBHOOK_URL = process.env.DISCORD_MONITOR_WEBHOOK_URL;

const LEVEL_COLORS: Record<AlertLevel, number> = {
  info: 0x3498db,
  warning: 0xf39c12,
  critical: 0xe74c3c,
};

const LEVEL_EMOJIS: Record<AlertLevel, string> = {
  info: "ℹ️",
  warning: "⚠️",
  critical: "🚨",
};

export async function sendAlert(opts: SendAlertOptions): Promise<void> {
  if (!WEBHOOK_URL) {
    return;
  }

  const { level, title, message, fields = [], timestamp = new Date() } = opts;

  const embed = {
    color: LEVEL_COLORS[level],
    title: `${LEVEL_EMOJIS[level]} ${title}`,
    description: message,
    fields: fields.map((f) => ({
      name: f.name,
      value: f.value,
      inline: f.inline ?? true,
    })),
    timestamp: timestamp.toISOString(),
    footer: {
      text: "HASHCODE Monitor",
    },
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch (error) {
    console.error("[DISCORD_MONITOR] Failed to send alert:", error);
  }
}

export async function sendCronError(cronName: string, error: Error, context?: Record<string, unknown>): Promise<void> {
  await sendAlert({
    level: "critical",
    title: `Cron Job Failed: ${cronName}`,
    message: error.message,
    fields: [
      { name: "Stack", value: `\`\`\`${error.stack?.slice(0, 1000) || "N/A"}\`\`\``, inline: false },
      ...(context ? [{ name: "Context", value: `\`\`\`${JSON.stringify(context, null, 2).slice(0, 1000)}\`\`\``, inline: false }] : []),
    ],
  });
}

export async function sendHealthCheckFailure(service: string, details: string): Promise<void> {
  await sendAlert({
    level: "critical",
    title: `Health Check Failed: ${service}`,
    message: details,
    fields: [{ name: "Service", value: service, inline: true }],
  });
}

export async function sendSLABreach(metric: string, currentValue: number, threshold: number, unit: string): Promise<void> {
  await sendAlert({
    level: "warning",
    title: `SLA Breach: ${metric}`,
    message: `${metric} exceeded threshold (${currentValue}${unit} > ${threshold}${unit})`,
    fields: [
      { name: "Current", value: `${currentValue}${unit}`, inline: true },
      { name: "Threshold", value: `${threshold}${unit}`, inline: true },
      { name: "Severity", value: currentValue > threshold * 2 ? "Critical" : "Warning", inline: true },
    ],
  });
}

export async function sendInfo(title: string, message: string, fields?: AlertField[]): Promise<void> {
  await sendAlert({ level: "info", title, message, fields });
}

export async function sendWarning(title: string, message: string, fields?: AlertField[]): Promise<void> {
  await sendAlert({ level: "warning", title, message, fields });
}

export async function sendCritical(title: string, message: string, fields?: AlertField[]): Promise<void> {
  await sendAlert({ level: "critical", title, message, fields });
}