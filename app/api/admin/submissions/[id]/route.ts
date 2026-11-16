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
import type { Prisma } from "@/generated/prisma/client";

const ArtifactDecisionSchema = z.object({
  key: z.string().min(1).max(80),
  status: z.enum(["ACCEPTED", "REJECTED"]),
  reviewerNote: z.string().max(500).optional().nullable(),
});

const UpdateSubmissionSchema = z.object({
  action: z.enum(["APPROVE", "NEEDS_REVISION", "REJECT"]),
  feedback: z.string().max(2000).optional(),
  qualityLevel: z.enum(["STANDARD", "GOOD", "EXEMPLARY"]).optional(),
  revisionNotes: z.string().max(2000).optional(),
  artifacts: z.array(ArtifactDecisionSchema).max(20).optional(),
});

type ArtifactDecision = z.infer<typeof ArtifactDecisionSchema>;

function requiredKeys(submissionSchema: unknown): Set<string> {
  if (!Array.isArray(submissionSchema)) return new Set();
  return new Set(
    submissionSchema
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      )
      .filter((item) => item.required !== false && typeof item.key === "string")
      .map((item) => item.key as string),
  );
}

async function applyArtifactDecisions(
  tx: Prisma.TransactionClient,
  submissionId: string,
  decisions: ArtifactDecision[],
) {
  for (const decision of decisions) {
    await tx.missionSubmissionArtifact.updateMany({
      where: { submissionId, key: decision.key },
      data: {
        status: decision.status,
        reviewerNote: decision.reviewerNote ?? null,
      },
    });
  }
}

export const PATCH = withAdminAuth(async (req: Request, { userId }: { userId: string }) => {
  try {

    const json = await req.json();
    const result = UpdateSubmissionSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json({ error: "Données invalides", issues: result.error.issues }, { status: 400 });
    }

    const { action, feedback, qualityLevel, revisionNotes, artifacts: artifactDecisions } =
      result.data;
    const id = new URL(req.url).pathname.split("/").pop()!;

    const submission = await prisma.missionSubmission.findUnique({
      where: { id },
      include: {
        mission: true,
        artifacts: true,
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

    const decisions = artifactDecisions ?? [];
    const existingArtifacts = submission.artifacts ?? [];
    if (decisions.length > 0) {
      const knownKeys = new Set(existingArtifacts.map((a) => a.key));
      const unknown = decisions.filter((d) => !knownKeys.has(d.key));
      if (unknown.length > 0) {
        return NextResponse.json(
          { message: `Artefacts inconnus : ${unknown.map((d) => d.key).join(", ")}` },
          { status: 400 },
        );
      }
    }

    const artifactStatusAfter = new Map(
      existingArtifacts.map((a) => [a.key, a.status] as const),
    );
    for (const d of decisions) artifactStatusAfter.set(d.key, d.status);

    if (action === "APPROVE") {
      const required = requiredKeys(submission.mission.submissionSchema);
      const rejectedRequired = [...required].filter(
        (key) => artifactStatusAfter.get(key) === "REJECTED",
      );
      if (rejectedRequired.length > 0) {
        return NextResponse.json(
          {
            message: `Impossible de valider : artefacts requis refusés (${rejectedRequired.join(", ")}).`,
          },
          { status: 400 },
        );
      }
    }

    const rejectedLabels =
      action === "NEEDS_REVISION" && decisions.length > 0
        ? existingArtifacts
            .filter((a) => decisions.some((d) => d.key === a.key && d.status === "REJECTED"))
            .map((a) => a.label)
        : [];
    const effectiveRevisionNotes =
      revisionNotes ??
      (rejectedLabels.length > 0
        ? rejectedLabels.map((label) => `À reprendre : ${label}`).join("\n")
        : undefined);

    if (action === "APPROVE") {
      // For PENDING_ADMIN (peer-reviewed CORE missions), preserve the peer's quality assessment
      // unless the admin explicitly overrides it
      const level: QualityLevel = qualityLevel ?? (submission.qualityLevel as QualityLevel) ?? "STANDARD";

      // 1. Transaction atomique — status + artefacts + missionsCompletedCount
      await prisma.$transaction(async (tx) => {
        if (decisions.length > 0) {
          await applyArtifactDecisions(tx, id, decisions);
        }
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
        if (decisions.length > 0) {
          await applyArtifactDecisions(tx, id, decisions);
        }
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
          rejectedArtifacts: rejectedLabels,
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
