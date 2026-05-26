export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";
import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { z } from "zod";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "test_key",
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "test_key",
});

const PayloadSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(["MISSION_APPROVED", "DAILY_REMINDER", "LEVEL_UP", "SYSTEM"]),
  title: z.string().min(1),
  message: z.string().min(1),
  link: z.string().optional(),
  xp: z.number().optional(),
  newLevel: z.number().optional(),
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
      const parsed = PayloadSchema.safeParse(JSON.parse(body));
      if (!parsed.success) return new NextResponse("Bad Request", { status: 400 });
      return await handleNotify(parsed.data);
    }

    // Dev/preview: require internal secret header
    const secret = req.headers.get("x-internal-secret");
    if (!secret || secret !== (process.env.INTERNAL_API_SECRET || "")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const parsed = PayloadSchema.safeParse(body);
    if (!parsed.success) return new NextResponse("Bad Request", { status: 400 });
    return await handleNotify(parsed.data);
  } catch (error) {
    console.error("[NOTIFY_WORKER_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

async function handleNotify({ userId, type, title, message, link, xp, newLevel }: z.infer<typeof PayloadSchema>) {
  const notification = await prisma.notification.create({
    data: { userId, type, title, message, link },
    include: { user: true },
  });

  if (type === "MISSION_APPROVED") {
    emailService.sendMissionApproval({
      email: notification.user.email,
      name: notification.user.name,
      missionTitle: title.replace("Mission validée : ", ""),
      xp: xp ?? 0,
    });
  } else if (type === "DAILY_REMINDER") {
    emailService.sendDailyReminder({
      email: notification.user.email,
      name: notification.user.name,
    });
  } else if (type === "LEVEL_UP" && newLevel) {
    emailService.sendLevelUp({
      email: notification.user.email,
      name: notification.user.name,
      newLevel,
    });
  }

  return NextResponse.json({ success: true });
}
