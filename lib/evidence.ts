import { prisma } from "@/lib/prisma";

type QualityLevel = "STANDARD" | "HIGH" | "EXEMPLARY" | null;

/**
 * Evidence publique dérivée des soumissions de missions APPROVED.
 *
 * Pas de nouvelle table : on lit directement `MissionSubmission` (source de vérité)
 * avec ses artefacts et sa dernière review. Aucun champ interne n'est exposé.
 */
export interface PublicEvidence {
  id: string;
  missionId: string;
  mission: {
    title: string;
    category: string;
    slug: string;
    missionLevel?: string | null;
  };
  status: "APPROVED";
  qualityLevel: QualityLevel;
  validatedAt: Date;
  artifacts: Array<{
    id: string;
    type: string;
    label: string | null;
    fileUrl: string | null;
    fileName: string | null;
    mimeType: string | null;
  }>;
  review: {
    feedback: string | null;
    qualityLevel: QualityLevel;
    createdAt: Date;
  } | null;
}

export async function getPublicEvidence(userId: string): Promise<PublicEvidence[]> {
  const submissions = await prisma.missionSubmission.findMany({
    where: {
      userId,
      status: "APPROVED",
      user: { banned: false },
    },
    select: {
      id: true,
      missionId: true,
      qualityLevel: true,
      updatedAt: true,
      mission: {
        select: {
          title: true,
          category: true,
          slug: true,
          missionLevel: true,
        },
      },
      artifacts: {
        select: {
          id: true,
          type: true,
          label: true,
          fileUrl: true,
          fileName: true,
          mimeType: true,
          status: true,
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          feedback: true,
          qualityLevel: true,
          createdAt: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return submissions.map((sub) => ({
    id: sub.id,
    missionId: sub.missionId,
    mission: sub.mission,
    status: "APPROVED" as const,
    qualityLevel: sub.qualityLevel as QualityLevel,
    validatedAt: sub.updatedAt,
    artifacts: sub.artifacts
      .filter((a) => a.status !== "REJECTED")
      .map((a) => ({
        id: a.id,
        type: a.type,
        label: a.label,
        fileUrl: a.fileUrl,
        fileName: a.fileName,
        mimeType: a.mimeType,
      })),
    review: sub.reviews[0]
      ? {
          feedback: sub.reviews[0].feedback,
          qualityLevel: sub.reviews[0].qualityLevel as QualityLevel,
          createdAt: sub.reviews[0].createdAt,
        }
      : null,
  }));
}