import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;

    const mission = await prisma.mission.findUnique({
      where: { id },
      select: { id: true, title: true },
    });
    if (!mission)
      return NextResponse.json(
        { message: "Mission introuvable" },
        { status: 404 }
      );

    const steps = await prisma.missionStep.findMany({
      where: { missionId: id },
      orderBy: { stepOrder: "asc" },
      include: {
        responses: {
          select: {
            id: true,
            data: true,
            score: true,
            feedback: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    const stepAnalytics = steps.map((step) => {
      const totalResponses = step.responses.length;
      const scoredResponses = step.responses.filter(
        (r) => r.score !== null && r.score !== undefined
      );
      const avgScore =
        scoredResponses.length > 0
          ? scoredResponses.reduce((acc, r) => acc + (r.score ?? 0), 0) /
            scoredResponses.length
          : 0;

      const issues: Record<string, number> = {};
      step.responses.forEach((r) => {
        if (r.feedback) {
          const lower = r.feedback.toLowerCase();
          const keywords = [
            "incomplet",
            "manquant",
            "erreur",
            "insuffisant",
            "mauvais",
            "refusé",
            "invalide",
          ];
          keywords.forEach((kw) => {
            if (lower.includes(kw)) {
              issues[kw] = (issues[kw] ?? 0) + 1;
            }
          });
        }
        if (!r.data || JSON.stringify(r.data) === "{}") {
          issues["données manquantes"] = (issues["données manquantes"] ?? 0) + 1;
        }
      });

      const avgCompleteness =
        totalResponses > 0
          ? step.responses.reduce((acc, r) => {
              const dataStr = JSON.stringify(r.data ?? {});
              const isEmpty = dataStr === "{}" || dataStr === "null";
              return acc + (isEmpty ? 0 : 1);
            }, 0) / totalResponses
          : 0;

      return {
        stepId: step.id,
        stepOrder: step.stepOrder,
        key: step.key,
        title: step.title,
        totalResponses,
        avgScore: Math.round(avgScore * 10) / 10,
        avgCompleteness: Math.round(avgCompleteness * 100),
        scoredCount: scoredResponses.length,
        issues: Object.entries(issues)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([issue, count]) => ({ issue, count })),
      };
    });

    return NextResponse.json({
      mission: { id: mission.id, title: mission.title },
      steps: stepAnalytics,
    });
  } catch (error) {
    console.error("[ADMIN_MISSION_ANALYTICS_GET]", error);
    return NextResponse.json(
      { message: "Erreur interne" },
      { status: 500 }
    );
  }
}
