import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";
import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "test_key",
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "test_key",
});

export async function POST(req: Request) {
  try {
    // Signature verification (only in production)
    if (process.env.NODE_ENV === "production") {
      const signature = req.headers.get("upstash-signature");
      const body = await req.text();
      const isValid = await receiver.verify({ signature: signature!, body });
      if (!isValid) return new NextResponse("Unauthorized", { status: 401 });
      // Re-parse body for logic
      const payload = JSON.parse(body);
      return await handleNotify(payload);
    }

    const payload = await req.json();
    return await handleNotify(payload);
  } catch (error) {
    console.error("[NOTIFY_WORKER_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

async function handleNotify({ userId, type, title, message, link }: any) {
  // 1. Persist to DB
  const notification = await prisma.notification.create({
    data: { userId, type, title, message, link },
    include: { user: true }
  });

  // 2. Trigger Email (if applicable)
  if (type === "MISSION_APPROVED") {
    await emailService.sendMissionApproval({
      email: notification.user.email,
      name: notification.user.name,
      missionTitle: title.replace("Mission validée : ", ""),
      xp: 0, // Should be passed in payload or derived
    });
  }

  return NextResponse.json({ success: true });
}
