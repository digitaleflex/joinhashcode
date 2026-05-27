import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { updateSquadCohesion } from "@/lib/squad-logic";
import { triggerNotification } from "@/lib/qstash";
import { z } from "zod";

const checkinSchema = z.object({
  note: z.string().min(20, "Ta note doit faire au moins 20 caractères pour être validée par le protocole."),
  domain: z.string(),
  energy: z.number().min(1).max(5),
  duration: z.number().min(15).max(480),
});

// Basic similarity check (Levenshtein distance simplified)
function getSimilarity(s1: string, s2: string): number {
  if (!s1 || !s2) return 0;
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;
  
  // Simplified overlap check for performance
  const words1 = new Set(s1.toLowerCase().split(/\s+/));
  const words2 = new Set(s2.toLowerCase().split(/\s+/));
  const intersection = [...words1].filter(w => words2.has(w));
  return intersection.length / Math.max(words1.size, words2.size);
}

const stripHtml = (str: string) => str.replace(/<[^>]*>?/gm, "");

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Non autorisé. Connecte-toi pour continuer.", { status: 401 });

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

      // 2. Similarity check (> 80%)
      if (getSimilarity(note, lastCheckin.note) > 0.8) {
        return NextResponse.json({ 
            message: "Ta note est trop similaire à celle d\"hier. Dis-nous ce qui a VRAIMENT changé aujourd\"hui !" 
        }, { status: 400 });
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

      // Recalculate evolution
      const weights = domain === "Code" ? { builder: 1, creator: 0, strategist: 0, catalyst: 0 } : { builder: 0, creator: 0, strategist: 0, catalyst: 1 };
      await updateUserEvolution(session.user.id, weights as any, 0.05, tx);

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
    return new NextResponse("Erreur système. Réessaie dans un instant.", { status: 500 });
  }
}
