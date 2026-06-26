export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.error("[CLIENT_ERROR]", JSON.stringify(body, null, 2));
  } catch {
  }
  return NextResponse.json({ ok: true });
}
