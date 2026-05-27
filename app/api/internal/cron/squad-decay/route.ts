export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { applySquadCohesionDecay } from "@/lib/squad-logic";
import { logError } from "@/lib/logger";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "test_key",
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "test_key",
});

export async function POST(req: Request) {
  try {
    const hasQStashKeys =
      process.env.QSTASH_CURRENT_SIGNING_KEY &&
      process.env.QSTASH_CURRENT_SIGNING_KEY !== "test_key";

    if (hasQStashKeys) {
      const signature = req.headers.get("upstash-signature");
      const body = await req.text();
      const isValid = await receiver.verify({ signature: signature!, body });
      if (!isValid) return new NextResponse("Unauthorized", { status: 401 });
    } else {
      const secret = req.headers.get("x-internal-secret");
      const configuredSecret = process.env.INTERNAL_API_SECRET;

      if (!configuredSecret || configuredSecret.length < 16) {
        await logError("Cron Squad Decay Security", new Error("INTERNAL_API_SECRET is missing or too weak."));
        return new NextResponse("Security Configuration Error", { status: 500 });
      }

      if (!secret || secret !== configuredSecret) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const result = await applySquadCohesionDecay();
    return NextResponse.json({
      success: true,
      message: "Squad cohesion decay applied.",
      processed: result?.processed || 0,
    });
  } catch (error) {
    await logError("Cron Squad Decay", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
