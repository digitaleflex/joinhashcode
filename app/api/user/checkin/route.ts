import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { updateUserEvolution, CHECKIN_WEIGHTS } from "@/lib/evolution-engine";
import { updateSquadCohesion } from "@/lib/squad-logic";
import { checkinLimiter, checkRateLimit } from "@/lib/ratelimit";
import { z } from "zod";

const checkinSchema = z.object({
  note: z.string().min(20, "Ta note doit faire au moins 20 caractères pour être validée par le protocole."),
  domain: z.string(),
  energy: z.number().min(1).max(5),
  duration: z.number().min(15).max(480),
});

const stripHtml = (str: string) => str.replace(/<[^>]*>?/gm, "");

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé. Connecte-toi pour continuer." }, { status: 401 });

    const { limited } = await checkRateLimit(checkinLimiter, session.user.id);
    if (limited) return NextResponse.json({ message: "Trop de check-ins. Réessaie demain." }, { status: 429 });

    const body = await req.json();
    body.note = stripHtml(body.note || "");
    
    const validated = checkinSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ message: validated.error.errors[0].message }, { status: 400 });
    }

    const { note, domain, energy, duration } = validated.data;

    // 1. Cooldown check (20h)
    const lastCheckin = await prisma.dailyCheckin.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (lastCheckin) {
      const hoursSince = (Date.now() - lastCheckin.createdAt.getTime()) / (1000 * 60 * 60);
      if (hoursSince < 20) {
        return NextResponse.json({ 
            message: "Tu as déjà signé ton check-in aujourd\"hui. Reviens dans quelques heures pour la suite de ton build !" 
        }, { status: 429 });
      }

    }

    // Process check-in
    const result = await prisma.$transaction(async (tx) => {
      const checkin = await tx.dailyCheckin.create({
        data: {
          userId: session.user.id,
          note,
          domain,
          energy,
          duration,
        },
      });

      // Update user streak and vibrancy
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          lastCheckinAt: new Date(),
          currentStreak: { increment: 1 },
        },
      });

      const weights = { builder: 0, creator: 0, strategist: 0, catalyst: 0, ...CHECKIN_WEIGHTS[domain] };
      await updateUserEvolution(session.user.id, weights, 0.05, tx);

      return checkin;
    });

    // Update squad cohesion if member
    const membership = await prisma.member.findFirst({ where: { userId: session.user.id } });
    if (membership) {
        await updateSquadCohesion(membership.organizationId, 0.02, session.user.id);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[CHECKIN_POST]", error);
    return NextResponse.json({ message: "Erreur système. Réessaie dans un instant." }, { status: 500 });
  }
}
