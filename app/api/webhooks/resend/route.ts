import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/logger";
import { Webhook } from "svix";

/**
 * Webhook handler for Resend.
 * Securely verifies signatures using svix.
 * Handles "email.bounced" and "email.complained" events.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const svix_id = req.headers.get("svix-id");
    const svix_timestamp = req.headers.get("svix-timestamp");
    const svix_signature = req.headers.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ message: "Missing svix headers" }, { status: 401 });
    }

    const secret = process.env.RESEND_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[CRITICAL] RESEND_WEBHOOK_SECRET not configured.");
      return NextResponse.json({ message: "Configuration Error" }, { status: 500 });
    }

    const wh = new Webhook(secret);
    let evt: any;

    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (_) {
      console.error("[RESEND_WEBHOOK] Invalid signature:", err);
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    const { type, data } = evt;

    if (type === "email.bounced" || type === "email.complained") {
      const email = data.to[0];

      await prisma.user.updateMany({
        where: { email },
        data: {
          emailStatus: type === "email.bounced" ? "BOUNCED" : "COMPLAINED",
          emailLastBounced: new Date(),
        },
      });

      await logInfo(
        "Email Health Alert", 
        `Email address ${email} has been marked as ${type}.`, 
        { type, email }
      );
    }

    return NextResponse.json({ processed: true });
  } catch (_) {
    await logError("Resend Webhook", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
