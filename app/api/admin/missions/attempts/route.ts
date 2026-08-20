import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/admin-auth";
import { ONBOARDING_MISSION } from "@/lib/onboarding-mission";
import { PROJECT_MISSION } from "@/lib/project-mission";
import { SOLUTION_MISSION } from "@/lib/solution-mission";

export const dynamic = "force-dynamic";

const STEP_MISSION_SLUGS = [
  ONBOARDING_MISSION.slug,
  PROJECT_MISSION.slug,
  SOLUTION_MISSION.slug,
];

export const GET = withAdminAuth(async (req) => {
  try {
    const url = new URL(req.url);
    const tab = url.searchParams.get("tab") ?? "all";
    const search = url.searchParams.get("search") ?? "";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(100, Number(url.searchParams.get("limit")) || 50);

    const statusFilter: Record<string, string[]> = {
      all: ["DRAFT", "SUBMITTED", "IN_REVIEW", "REVISION_REQUIRED", "APPROVED", "REJECTED"],
      draft: ["DRAFT"],
      submitted: ["SUBMITTED"],
      in_review: ["IN_REVIEW"],
      revision: ["REVISION_REQUIRED"],
      approved: ["APPROVED"],
      rejected: ["REJECTED"],
      overdue: ["SUBMITTED", "IN_REVIEW"],
    };
    const statuses = statusFilter[tab] ?? statusFilter.all;

    const where: Record<string, unknown> = {
      mission: { slug: { in: STEP_MISSION_SLUGS } },
      status: { in: statuses },
    };
    if (search.trim()) {
      where.user = {
        OR: [
          { name: { contains: search.trim(), mode: "insensitive" } },
          { pseudo: { contains: search.trim(), mode: "insensitive" } },
          { email: { contains: search.trim(), mode: "insensitive" } },
        ],
      };
    }

    const [attempts, total] = await Promise.all([
      prisma.missionAttempt.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, name: true, pseudo: true, email: true, image: true, class: true, level: true } },
          mission: { select: { id: true, title: true, slug: true, xp: true, category: true } },
          reviewer: { select: { id: true, name: true, pseudo: true } },
          stepResponses: { select: { status: true, stepOrder: true } },
          reviewLogs: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true, action: true } },
        },
      }),
      prisma.missionAttempt.count({ where }),
    ]);

    const serialized = attempts.map((a) => ({
      id: a.id,
      status: a.status,
      currentStep: a.currentStep,
      score: a.score,
      decision: a.decision,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      submittedAt: a.submittedAt,
      user: a.user,
      mission: a.mission,
      reviewer: a.reviewer,
      stepsCompleted: a.stepResponses.filter((r) => r.status === "APPROVED").length,
      lastActivity: a.reviewLogs[0] ?? null,
    }));

    return NextResponse.json({ attempts: serialized, total, page, limit });
  } catch (error: unknown) {
    console.error("[ADMIN_ATTEMPTS_GET]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
});
