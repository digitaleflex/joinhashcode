export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { clientErrorLimiter, checkRateLimit } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    // Rate limit by IP to prevent log flooding
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { limited } = await checkRateLimit(clientErrorLimiter, `client-error:${ip}`);
    if (limited) return NextResponse.json({ ok: false }, { status: 429 });

    const body = await request.json();
    console.error("[CLIENT_ERROR]", JSON.stringify(body, null, 2));
  } catch {
  }
  return NextResponse.json({ ok: true });
}
