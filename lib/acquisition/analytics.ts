/**
 * HASHCODE — Acquisition funnel analytics events.
 *
 * Funnel: VISITE → CTA → PROFILAGE → COMPLÉTION → WHATSAPP
 * Measurement: drop-off per step, mean time, completion rate, WhatsApp click rate.
 */

export const EVENT_TYPES = [
  "acq_page_view",
  "acq_cta_clicked",
  "profiling_started",
  "profiling_question_answered",
  "profiling_question_timed",
  "profiling_back",
  "profiling_resumed",
  "profiling_completed",
  "profiling_abandoned",
  "whatsapp_join_clicked",
  "acq_invite_sent",
] as const;

export type AcqEventType = (typeof EVENT_TYPES)[number];

export interface TrackEvent {
  type: AcqEventType;
  sessionId?: string;
  memberId?: string;
  ref?: string;
  value?: number;
}

const SESSION_KEY = "hashcode:acq:session";
const SOURCE_KEY = "hashcode:acq:source";

/** Get-or-create a stable client session id (per browser). */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let s = localStorage.getItem(SESSION_KEY);
    if (!s) {
      s = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(SESSION_KEY, s);
    }
    return s;
  } catch {
    return "anon";
  }
}

/**
 * Capture UTM/source params from the current URL (best-effort).
 * Persisted in localStorage so the acquisition source survives the funnel.
 */
export function getOrCreateSource(): string {
  if (typeof window === "undefined") return "direct";
  try {
    const existing = localStorage.getItem(SOURCE_KEY);
    if (existing) return existing;

    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source");
    const medium = params.get("utm_medium");
    const campaign = params.get("utm_campaign");
    let value: string;
    if (source) {
      value = `${source}${medium ? `/${medium}` : ""}${campaign ? `?${campaign}` : ""}`;
    } else if (medium) {
      value = medium;
    } else {
      value = "direct";
    }
    localStorage.setItem(SOURCE_KEY, value);
    return value;
  } catch {
    return "direct";
  }
}

/** Read the persisted acquisition source (or "direct"). */
export function getSource(): string {
  if (typeof window === "undefined") return "direct";
  try {
    return localStorage.getItem(SOURCE_KEY) ?? "direct";
  } catch {
    return "direct";
  }
}

/** Fire-and-forget client tracker. Never blocks the UI. */
export function track(event: TrackEvent): void {
  if (typeof window === "undefined") return;
  const payload = {
    type: event.type,
    sessionId: event.sessionId ?? getOrCreateSessionId(),
    memberId: event.memberId,
    ref: event.ref,
    value: event.value,
    path: window.location.pathname + window.location.search,
  };
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    } else {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  } catch {
    /* analytics must never break UX */
  }
}
