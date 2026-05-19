import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/utils";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { updateUserEvolution, CHECKIN_WEIGHTS } from "@/lib/evolution-engine";
import { BehavioralVibrancy } from "@/lib/evolution";
import { updateSquadCohesion } from "@/lib/squad-logic";

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

    // Update user evolution
    const baseWeights: BehavioralVibrancy = { builder: 0, creator: 0, strategist: 0, catalyst: 0 };
    const domainWeights = CHECKIN_WEIGHTS[domain] || { builder: 0.25, creator: 0.25, strategist: 0.25, catalyst: 0.25 };
    const finalWeights = { ...baseWeights, ...domainWeights };
    
    await updateUserEvolution(session.user.id, finalWeights, 0.01);

    // Boost Squad Cohesion if member
    const userWithGuild = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { guildMembers: { select: { guildId: true } } }
    });

    if (userWithGuild?.guildMembers?.[0]?.guildId) {
      await updateSquadCohesion(userWithGuild.guildMembers[0].guildId, 0.05);
    }

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
