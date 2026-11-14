export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { clientErrorLimiter, checkRateLimit } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/utils";

const MAX_BODY_BYTES = 8 * 1024;

export async function POST(request: Request) {
  try {
    // Rate limit by IP to prevent log flooding
    const ip = getClientIp(request.headers);
    const { limited } = await checkRateLimit(clientErrorLimiter, `client-error:${ip}`);
    if (limited) return NextResponse.json({ ok: false }, { status: 429 });

    // Reject oversized payloads before reading them, then cap what is actually read.
    const declared = Number(request.headers.get("content-length") ?? 0);
    if (declared > MAX_BODY_BYTES) return NextResponse.json({ ok: false }, { status: 413 });

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ ok: false }, { status: 413 });

    console.error("[CLIENT_ERROR]", JSON.stringify(JSON.parse(raw), null, 2));
  } catch {
  }
  return NextResponse.json({ ok: true });
}
