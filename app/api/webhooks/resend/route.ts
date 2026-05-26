import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/logger";

/**
 * Webhook handler for Resend.
 * Specifically designed to handle "email.bounced" and "email.complained" events.
 */
export async function POST(req: Request) {
  try {
    const secret = new URL(req.url).searchParams.get("secret");
    if (secret !== process.env.WEBHOOK_SECRET) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const payload = await req.json();
    const { type, data } = payload;

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
  } catch (error) {
    await logError("Resend Webhook", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
