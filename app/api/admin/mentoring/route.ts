import { checkAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

const mentorProfileSchema = z.object({
  userId: z.string().min(1),
  bio: z.string().optional(),
  expertise: z.array(z.string()).default([]),
  domains: z.array(z.string()).default([]),
  maxMentees: z.number().min(1).max(10).default(3),
  isActive: z.boolean().default(true),
});

const mentorMatchSchema = z.object({
  mentorId: z.string().min(1),
  menteeId: z.string().min(1),
  status: z.enum(["PENDING", "ACTIVE", "ENDED", "CANCELLED"]).default("PENDING"),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    if (type === "profiles" || !type) {
      const where: Record<string, unknown> = {};
      if (status) where.isActive = status === "true";

      const profiles = await prisma.mentorProfile.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true, class: true, level: true, domains: true }
          }
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ profiles });
    }

    if (type === "matches") {
      const where: Record<string, unknown> = {};
      if (status) where.status = status;

      const matches = await prisma.mentorMatch.findMany({
        where,
        include: {
          mentor: { select: { id: true, name: true, email: true, image: true, class: true, level: true } },
          mentee: { select: { id: true, name: true, email: true, image: true, class: true, level: true, domains: true, currentSituation: true, mainObjective: true } }
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ matches });
    }

    if (type === "candidates") {
      const mentorId = searchParams.get("mentorId");
      if (!mentorId) {
        return NextResponse.json({ message: "mentorId requis" }, { status: 400 });
      }

      const mentor = await prisma.mentorProfile.findUnique({
        where: { userId: mentorId },
        select: { expertise: true, domains: true, maxMentees: true, currentMentees: true }
      });

      if (!mentor) {
        return NextResponse.json({ message: "Mentor non trouvé" }, { status: 404 });
      }

      const activeMatches = await prisma.mentorMatch.count({
        where: { mentorId, status: "ACTIVE" }
      });

      if (activeMatches >= mentor.maxMentees) {
        return NextResponse.json({ candidates: [], message: "Mentor at capacity" });
      }

      const candidates = await prisma.user.findMany({
        where: {
          id: { not: mentorId },
          class: { not: null },
          deactivatedAt: null,
          banned: { not: true },
          mentorMatches: { none: { status: { in: ["ACTIVE", "PENDING"] } } }
        },
        select: {
          id: true, name: true, email: true, image: true, class: true, level: true,
          domains: true, currentSituation: true, mainObjective: true
        },
        take: 50,
        orderBy: { createdAt: "desc" }
      });

      const scored = candidates.map(candidate => {
        let score = 0;
        if (candidate.class && mentor.expertise.includes(candidate.class.toLowerCase())) score += 10;
        if (candidate.class && mentor.domains.includes(candidate.class.toLowerCase())) score += 5;
        candidate.domains.forEach(d => {
          if (mentor.expertise.includes(d.toLowerCase())) score += 3;
          if (mentor.domains.includes(d.toLowerCase())) score += 2;
        });
        return { ...candidate, matchScore: score };
      });

      scored.sort((a, b) => b.matchScore - a.matchScore);
      return NextResponse.json({ candidates: scored });
    }

    return NextResponse.json({ message: "Type invalide" }, { status: 400 });
  } catch (error) {
    console.error("[ADMIN_MENTORING_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id, { failClosed: true });
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const body = await req.json();
    const { type } = body;

    if (type === "profile") {
      const validatedData = mentorProfileSchema.parse(body);

      const profile = await prisma.mentorProfile.upsert({
        where: { userId: validatedData.userId },
        update: validatedData,
        create: validatedData,
      });

      logActivity({
        userId: admin.id,
        action: "ADMIN_MENTOR_PROFILE_CREATED",
        entity: "MentorProfile",
        entityId: profile.id,
        metadata: { userId: profile.userId, isActive: profile.isActive },
        request: req
      });

      return NextResponse.json(profile);
    }

    if (type === "match") {
      const validatedData = mentorMatchSchema.parse(body);

      const existing = await prisma.mentorMatch.findUnique({
        where: { mentorId_menteeId: { mentorId: validatedData.mentorId, menteeId: validatedData.menteeId } }
      });

      if (existing) {
        return NextResponse.json({ message: "Ce match existe déjà" }, { status: 400 });
      }

      const match = await prisma.mentorMatch.create({
        data: validatedData,
        include: {
          mentor: { select: { id: true, name: true, email: true } },
          mentee: { select: { id: true, name: true, email: true } }
        }
      });

      await prisma.mentorProfile.update({
        where: { userId: validatedData.mentorId },
        data: { currentMentees: { increment: 1 } }
      });

      logActivity({
        userId: admin.id,
        action: "ADMIN_MENTOR_MATCH_CREATED",
        entity: "MentorMatch",
        entityId: match.id,
        metadata: { mentorId: match.mentorId, menteeId: match.menteeId, status: match.status },
        request: req
      });

      return NextResponse.json(match);
    }

    return NextResponse.json({ message: "Type invalide" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_MENTORING_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}