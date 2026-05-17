import { prisma } from "@/lib/prisma";
import { triggerNotification } from "@/lib/qstash";
import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { subHours } from "date-fns";

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
      if (!secret || secret !== (process.env.INTERNAL_API_SECRET || "")) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const twentyFourHoursAgo = subHours(new Date(), 24);

    const inactiveUsers = await prisma.user.findMany({
      where: {
        class: { not: null },
        OR: [
          { lastCheckinAt: { lt: twentyFourHoursAgo } },
          { lastCheckinAt: null },
        ],
      },
      select: { id: true },
    });

    console.log(`[CRON_CHECK_ACTIVITY] Found ${inactiveUsers.length} inactive users.`);

    const notificationPromises = inactiveUsers.map((user) =>
      triggerNotification({
        userId: user.id,
        type: "DAILY_REMINDER",
        title: "Ton build t'attend",
        message: "Tu n'as pas signé ton check-in aujourd'hui. Garde le rythme !",
        link: "/dashboard",
      })
    );

    await Promise.all(notificationPromises);

    return NextResponse.json({
      success: true,
      processed: inactiveUsers.length,
    });
  } catch (error) {
    console.error("[CRON_CHECK_ACTIVITY_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
