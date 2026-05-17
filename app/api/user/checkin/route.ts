import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/utils";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const checkinSchema = z.object({
  note: z.string().transform(stripHtml).pipe(z.string().min(1).max(1000)),
  domain: z.string().min(1).max(100),
  energy: z.number().int().min(1).max(5),
  duration: z.number().int().min(1).max(1440),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check for existing check-in in the last 20 hours
    const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000);
    const existingCheckin = await prisma.dailyCheckin.findFirst({
      where: {
        userId: session.user.id,
        createdAt: { gte: twentyHoursAgo },
      },
    });

    if (existingCheckin) {
      return new NextResponse("Tu as déjà signé ton check-in aujourd'hui. Garde ton énergie pour demain !", { status: 429 });
    }

    const body = await req.json();
    const parsed = checkinSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Données invalides", { status: 400 });
    }

    const { note, domain, energy, duration } = parsed.data;

    const checkin = await prisma.dailyCheckin.create({
      data: {
        userId: session.user.id,
        note,
        domain,
        energy,
        duration,
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastCheckinAt: new Date() },
    });

    return NextResponse.json(checkin);
  } catch (error) {
    console.error("[DAILY_CHECKIN_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
