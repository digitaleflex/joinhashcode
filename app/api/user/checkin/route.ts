import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { note, domain, energy, duration } = await req.json();

    if (!note || !domain || !energy || !duration) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const checkin = await prisma.dailyCheckin.create({
      data: {
        userId: session.user.id,
        note,
        domain,
        energy,
        duration: parseInt(duration),
      },
    });

    // Update user's last checkin date
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        lastCheckinAt: new Date(),
      }
    });

    return NextResponse.json(checkin);
  } catch (error) {
    console.error("[DAILY_CHECKIN_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
