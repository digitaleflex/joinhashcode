import { checkAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

const mentorProfileSchema = z.object({
  bio: z.string().optional(),
  expertise: z.array(z.string()).default([]),
  domains: z.array(z.string()).default([]),
  maxMentees: z.number().min(1).max(10).default(3),
  isActive: z.boolean().default(true),
});

const mentorMatchSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "ENDED", "CANCELLED"]).optional(),
  notes: z.string().optional(),
  startedAt: z.string().optional().nullable(),
  endedAt: z.string().optional().nullable(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { type } = body;

    if (type === "profile") {
      const validatedData = mentorProfileSchema.parse(body);

      const profile = await prisma.mentorProfile.update({
        where: { id },
        data: validatedData,
        include: { user: { select: { id: true, name: true, email: true } } }
      });

      logActivity({
        userId: admin.id,
        action: "ADMIN_MENTOR_PROFILE_UPDATED",
        entity: "MentorProfile",
        entityId: profile.id,
        metadata: { userId: profile.userId, patch: Object.keys(validatedData) },
        request: req
      });

      return NextResponse.json(profile);
    }

    return NextResponse.json({ message: "Type invalide" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_MENTORING_PUT]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { type } = body;

    if (type === "match") {
      const validatedData = mentorMatchSchema.parse(body);

      const existingMatch = await prisma.mentorMatch.findUnique({
        where: { id },
        select: { mentorId: true, menteeId: true, status: true }
      });

      if (!existingMatch) {
        return NextResponse.json({ message: "Match non trouvé" }, { status: 404 });
      }

      const data: Record<string, unknown> = {};
      if (validatedData.status !== undefined) data.status = validatedData.status;
      if (validatedData.notes !== undefined) data.notes = validatedData.notes;
      if (validatedData.startedAt !== undefined) data.startedAt = validatedData.startedAt ? new Date(validatedData.startedAt) : null;
      if (validatedData.endedAt !== undefined) data.endedAt = validatedData.endedAt ? new Date(validatedData.endedAt) : null;

      if (validatedData.status === "ENDED" && existingMatch.status === "ACTIVE") {
        await prisma.mentorProfile.update({
          where: { userId: existingMatch.mentorId },
          data: { currentMentees: { decrement: 1 } }
        });
      } else if (validatedData.status === "ACTIVE" && existingMatch.status !== "ACTIVE") {
        await prisma.mentorProfile.update({
          where: { userId: existingMatch.mentorId },
          data: { currentMentees: { increment: 1 } }
        });
      }

      const match = await prisma.mentorMatch.update({
        where: { id },
        data,
        include: {
          mentor: { select: { id: true, name: true, email: true } },
          mentee: { select: { id: true, name: true, email: true } }
        }
      });

      logActivity({
        userId: admin.id,
        action: "ADMIN_MENTOR_MATCH_UPDATED",
        entity: "MentorMatch",
        entityId: match.id,
        metadata: { mentorId: match.mentorId, menteeId: match.menteeId, patch: Object.keys(data) },
        request: req
      });

      return NextResponse.json(match);
    }

    if (type === "notify") {
      const match = await prisma.mentorMatch.findUnique({
        where: { id },
        include: {
          mentor: { select: { id: true, name: true, email: true } },
          mentee: { select: { id: true, name: true, email: true } }
        }
      });

      if (!match) {
        return NextResponse.json({ message: "Match non trouvé" }, { status: 404 });
      }

      await prisma.notification.createMany({
        data: [
          {
            userId: match.mentorId,
            type: "MENTOR_MATCH",
            title: "Nouveau mentee assigné",
            message: `Vous avez été assigné comme mentor pour ${match.mentee.name}`,
            link: `/mentoring/matches/${match.id}`
          },
          {
            userId: match.menteeId,
            type: "MENTOR_MATCH",
            title: "Mentor assigné",
            message: `${match.mentor.name} est maintenant votre mentor`,
            link: `/mentoring/matches/${match.id}`
          }
        ]
      });

      logActivity({
        userId: admin.id,
        action: "ADMIN_MENTOR_NOTIFICATION_SENT",
        entity: "MentorMatch",
        entityId: match.id,
        metadata: { mentorId: match.mentorId, menteeId: match.menteeId },
        request: req
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Type invalide" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_MENTORING_PATCH]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited: delLimited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (delLimited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { type } = body;

    if (type === "profile") {
      const profile = await prisma.mentorProfile.findUnique({
        where: { id },
        select: { userId: true }
      });

      await prisma.mentorProfile.delete({
        where: { id },
      });

      if (profile) {
        logActivity({
          userId: admin.id,
          action: "ADMIN_MENTOR_PROFILE_DELETED",
          entity: "MentorProfile",
          entityId: id,
          metadata: { userId: profile.userId },
          request: req
        });
      }

      return new NextResponse(null, { status: 204 });
    }

    if (type === "match") {
      const match = await prisma.mentorMatch.findUnique({
        where: { id },
        select: { mentorId: true, menteeId: true, status: true }
      });

      await prisma.mentorMatch.delete({
        where: { id },
      });

      if (match && match.status === "ACTIVE") {
        await prisma.mentorProfile.update({
          where: { userId: match.mentorId },
          data: { currentMentees: { decrement: 1 } }
        });
      }

      if (match) {
        logActivity({
          userId: admin.id,
          action: "ADMIN_MENTOR_MATCH_DELETED",
          entity: "MentorMatch",
          entityId: id,
          metadata: { mentorId: match.mentorId, menteeId: match.menteeId },
          request: req
        });
      }

      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json({ message: "Type invalide" }, { status: 400 });
  } catch (error) {
    console.error("[ADMIN_MENTORING_DELETE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}