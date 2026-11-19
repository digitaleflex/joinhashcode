export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import { safeAfter as after } from "@/lib/after";
import { triggerNotification } from "@/lib/qstash";
import { type QualityLevel } from "@/lib/acceptance-criteria";
import { logActivity } from "@/lib/activity-log";
import { emailService } from "@/lib/email";
import { z } from "zod";

const UpdateSubmissionSchema = z.object({
  action: z.enum(["APPROVE", "NEEDS_REVISION", "REJECT"]),
  feedback: z.string().max(2000).optional(),
  qualityLevel: z.enum(["STANDARD", "GOOD", "EXEMPLARY"]).optional(),
  revisionNotes: z.string().max(2000).optional(),
});


export const PATCH = withAdminAuth(async (req: Request, { userId }: { userId: string }) => {
  try {

    const json = await req.json();
    const result = UpdateSubmissionSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json({ error: "Données invalides", issues: result.error.issues }, { status: 400 });
    }

    const { action, feedback, qualityLevel, revisionNotes } =
      result.data;
    const id = new URL(req.url).pathname.split("/").pop()!;

    const submission = await prisma.missionSubmission.findUnique({
      where: { id },
      include: {
        mission: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        }
      }
    });

    if (!submission) return NextResponse.json({ message: "Submission not found" }, { status: 404 });
    if (submission.status === "APPROVED" || submission.status === "REJECTED") {
      return NextResponse.json({ message: "Submission already processed" }, { status: 400 });
    }

    const effectiveRevisionNotes = revisionNotes;

    if (action === "APPROVE") {
      // For PENDING_ADMIN (peer-reviewed CORE missions), preserve the peer's quality assessment
      // unless the admin explicitly overrides it
      const level: QualityLevel = qualityLevel ?? (submission.qualityLevel as QualityLevel) ?? "STANDARD";

      // 1. Transaction atomique — status + artefacts + missionsCompletedCount
      await prisma.$transaction(async (tx) => {
        await tx.missionSubmission.update({
          where: { id },
          data: { status: "APPROVED", qualityLevel: level, adminFeedback: feedback ?? null }
        });

        await tx.user.update({
          where: { id: submission.userId },
          data: { missionsCompletedCount: { increment: 1 } },
        });
      });

      // 2. Traitement post-réponse asynchrone (non-critique)
      await after(async () => {
        try {
          const qualityMsg = level === "EXEMPLARY" ? " Travail exemplaire !" : level === "GOOD" ? " Très bon travail !" : "";
          await triggerNotification({
            userId: submission.userId,
            type: "MISSION_APPROVED",
            title: `Mission validée : ${submission.mission.title}`,
            message: `Félicitations ! ${qualityMsg}`,
            link: "/missions",
          });
        } catch (error) {
          console.error("🔴 [Admin Approve Post-Tasks Error]", error);
        }
      });

      logActivity({
        userId: userId,
        action: "ADMIN_SUBMISSION_REVIEWED",
        entity: "mission_submission",
        entityId: id,
        metadata: { action: "APPROVE", qualityLevel: level, targetUserId: submission.userId },
        request: req,
      });

      

      return NextResponse.json({ success: true });
    }

    if (action === "NEEDS_REVISION") {
      await prisma.$transaction(async (tx) => {
        await tx.missionSubmission.update({
          where: { id },
          data: {
            status: "NEEDS_REVISION",
            adminFeedback: feedback ?? null,
            revisionNotes: effectiveRevisionNotes ?? null,
            revisionCount: { increment: 1 }
          }
        });
      });

      await after(async () => {
        try {
          await triggerNotification({
            userId: submission.userId,
            type: "SYSTEM",
            title: `Révision requise : ${submission.mission.title}`,
            message: feedback || "Ta soumission nécessite des améliorations. Consulte le feedback.",
            link: `/missions/${submission.missionId}`
          });

          await emailService.sendMissionNeedsRevision({
            email: submission.user.email,
            name: submission.user.name,
            missionTitle: submission.mission.title,
            feedback: feedback || "Ta soumission nécessite des améliorations.",
            revisionCount: (submission.revisionCount ?? 0) + 1,
          });
        } catch (error) {
          console.error("🔴 [Admin NeedsRevision Post-Tasks Error]", error);
        }
      });

      logActivity({
        userId: userId,
        action: "ADMIN_SUBMISSION_REVIEWED",
        entity: "mission_submission",
        entityId: id,
        metadata: {
          action: "NEEDS_REVISION",
          targetUserId: submission.userId,
          
        },
        request: req,
      });

      

      return NextResponse.json({ success: true });
    }

    if (action === "REJECT") {
      await prisma.missionSubmission.update({
        where: { id },
        data: { status: "REJECTED", adminFeedback: feedback }
      });

      await after(async () => {
        try {
          await triggerNotification({
            userId: submission.userId,
            type: "SYSTEM",
            title: `Mission refusée : ${submission.mission.title}`,
            message: feedback || "Ta soumission n'a pas été retenue.",
            link: "/missions"
          });

          await emailService.sendMissionRejected({
            email: submission.user.email,
            name: submission.user.name,
            missionTitle: submission.mission.title,
            feedback: feedback,
          });
        } catch (error) {
          console.error("🔴 [Admin Reject Post-Tasks Error]", error);
        }
      });

      logActivity({
        userId: userId,
        action: "ADMIN_SUBMISSION_REVIEWED",
        entity: "mission_submission",
        entityId: id,
        metadata: { action: "REJECT", targetUserId: submission.userId },
        request: req,
      });

      

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[ADMIN_SUBMISSION_PATCH]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
});
