import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH } from "@/app/api/admin/missions/attempts/[attemptId]/route";
import { POST } from "@/app/api/missions/[id]/attempt/submit/route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { triggerNotification } from "@/lib/qstash";
import { emailService } from "@/lib/email";
import * as missionEngine from "@/lib/mission-engine";

vi.mock("@/lib/mission-engine", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mission-engine")>();
  return {
    ...actual,
    logAttemptAction: vi.fn(() => Promise.resolve()),
    logAttemptActivity: vi.fn(() => Promise.resolve()),
  };
});

const logAttemptAction = vi.mocked(missionEngine.logAttemptAction);
const logAttemptActivity = vi.mocked(missionEngine.logAttemptActivity);

const { mockPrisma } = vi.hoisted(() => {
  const m = {
    mission: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    missionStep: {
      findMany: vi.fn(),
    },
    missionAttempt: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(() => Promise.resolve()),
      updateMany: vi.fn(),
    },
    user: {
      update: vi.fn(() => Promise.resolve()),
    },
    missionStepResponse: {
      findMany: vi.fn(),
      upsert: vi.fn(),
      updateMany: vi.fn(),
    },
    missionReviewLog: {
      create: vi.fn(() => Promise.resolve()),
      findMany: vi.fn(),
    },
    activityLog: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  };
  m.$transaction.mockImplementation((arg) => {
    if (typeof arg === "function") return arg(m);
    return Promise.all(arg.map((p: Promise<unknown>) => p ?? Promise.resolve()));
  });
  return { mockPrisma: m };
});

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/lib/qstash", () => ({
  triggerNotification: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  emailService: {
    sendMissionApproval: vi.fn(() => Promise.resolve()),
    sendMissionNeedsRevision: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock("@/lib/experience", () => ({
  awardXp: vi.fn(() => Promise.resolve()),
}));

vi.mock("@/lib/profile-v1", () => ({
  generateProfileV1: vi.fn(() => Promise.resolve()),
}));

vi.mock("@/lib/after", () => ({
  safeAfter: vi.fn((fn: () => unknown) => fn()),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

vi.mock("@/lib/ratelimit", () => ({
  mutationLimiter: {},
  adminOpsLimiter: {},
  checkRateLimit: vi.fn(() => ({ limited: false })),
}));

const mission = {
  id: "mission1",
  slug: "mission-01-decouverte",
  title: "Fais connaissance avec HashCode",
  xp: 150,
  isOnboarding: true,
  description: "",
  shortDesc: "",
  category: "INTRO",
};

const steps = [
  { id: "step1", missionId: "mission1", key: "presentation", stepOrder: 1, title: "Présente-toi", description: "", fields: [], scoreMax: 5 },
  { id: "step2", missionId: "mission1", key: "interets", stepOrder: 2, title: "Mon univers", description: "", fields: [], scoreMax: 5 },
  { id: "step3", missionId: "mission1", key: "competences", stepOrder: 3, title: "Compétences", description: "", fields: [], scoreMax: 5 },
  { id: "step4", missionId: "mission1", key: "ambition", stepOrder: 4, title: "Ambition", description: "", fields: [], scoreMax: 5 },
  { id: "step5", missionId: "mission1", key: "apprentissage", stepOrder: 5, title: "Apprentissage", description: "", fields: [], scoreMax: 5 },
  { id: "step6", missionId: "mission1", key: "contribution", stepOrder: 6, title: "Contribution", description: "", fields: [], scoreMax: 5 },
  { id: "step7", missionId: "mission1", key: "attentes", stepOrder: 7, title: "Attentes", description: "", fields: [], scoreMax: 5 },
  { id: "step8", missionId: "mission1", key: "environnement", stepOrder: 8, title: "Environnement", description: "", fields: [], scoreMax: 5 },
  { id: "step9", missionId: "mission1", key: "objectif", stepOrder: 9, title: "Objectif", description: "", fields: [], scoreMax: 5 },
  { id: "step10", missionId: "mission1", key: "presentation_finale", stepOrder: 10, title: "Présentation finale", description: "", fields: [], scoreMax: 5 },
];

const stepData: Record<string, Record<string, unknown>> = {
  presentation: { firstName: "Jean", pseudo: "jeanweb", presentation: "x".repeat(60) },
  interets: { domains: ["web", "ai"], pourquoi: "Pour apprendre le web et l'IA" },
  competences: { skills: [{ name: "React", level: "Intermédiaire" }, { name: "Node", level: "Débutant" }] },
  ambition: { vision: "x".repeat(80) },
  apprentissage: { preferences: ["projets", "mentorat"], explique: "En construisant des projets" },
  contribution: { modes: ["construire", "documenter"], priorite: "Construire" },
  attentes: { attentes: ["competences", "mentor"] },
  environnement: { env: { systeme: "Linux", ide: "VS Code", connexion: "bonne" } },
  objectif: { objectif: "Déployer ma première application web", pourquoi: "Pour valider mes acquis" },
  presentation_finale: { format: "texte", message: "y".repeat(80), lien: "" },
};

function completeResponses(attemptId: string) {
  return steps.map((s) => ({
    id: `resp-${s.id}`,
    attemptId,
    stepId: s.id,
    stepOrder: s.stepOrder,
    data: stepData[s.key] ?? {},
    status: "DRAFT",
    score: null,
    feedback: null,
    reviewedById: null,
    reviewedAt: null,
  }));
}

describe("Mission Attempt — Submit API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if not authenticated", async () => {
    (auth.api.getSession as any).mockResolvedValue(null);
    const req = new Request("http://localhost/api/missions/mission1/attempt/submit", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "mission1" }) });
    expect(res.status).toBe(401);
  });

  it("returns 404 if mission not found", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "user1", role: "MEMBER" } });
    (prisma.mission.findFirst as any).mockResolvedValue(null);
    const req = new Request("http://localhost/api/missions/unknown/attempt/submit", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "unknown" }) });
    expect(res.status).toBe(404);
  });

  it("rejects submission when steps are incomplete", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "user1", role: "MEMBER" } });
    (prisma.mission.findFirst as any).mockResolvedValue(mission);
    (prisma.missionAttempt.findUnique as any).mockResolvedValue(null);
    (prisma.missionStep.findMany as any).mockResolvedValue(steps);
    (prisma.missionAttempt.create as any).mockResolvedValue({ id: "attempt1", status: "DRAFT" });
    (prisma.missionStepResponse.findMany as any).mockResolvedValue([]);

    const req = new Request("http://localhost/api/missions/mission1/attempt/submit", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "mission1" }) });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("incomplètes");
    expect(body.incomplete.length).toBe(10);
  });

  it("submits successfully when all steps complete", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "user1", role: "MEMBER" } });
    (prisma.mission.findFirst as any).mockResolvedValue(mission);
    (prisma.missionAttempt.findUnique as any).mockResolvedValue(null);
    (prisma.missionStep.findMany as any).mockResolvedValue(steps);
    (prisma.missionAttempt.create as any).mockResolvedValue({ id: "attempt1", status: "DRAFT" });
    (prisma.missionStepResponse.findMany as any).mockResolvedValue(completeResponses("attempt1"));

    const req = new Request("http://localhost/api/missions/mission1/attempt/submit", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "mission1" }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("SUBMITTED");
    expect(prisma.missionAttempt.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: "SUBMITTED" }),
    }));
  });

  it("returns 409 if already submitted", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "user1", role: "MEMBER" } });
    (prisma.mission.findFirst as any).mockResolvedValue(mission);
    (prisma.missionAttempt.findUnique as any).mockResolvedValue({ id: "attempt1", status: "SUBMITTED", stepResponses: [] });

    const req = new Request("http://localhost/api/missions/mission1/attempt/submit", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "mission1" }) });
    expect(res.status).toBe(409);
  });
});

describe("Admin Mission Attempt Review API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 403 if not authenticated", async () => {
    (auth.api.getSession as any).mockResolvedValue(null);
    const req = new Request("http://localhost/api/admin/missions/attempts/attempt1", {
      method: "PATCH",
      body: JSON.stringify({ action: "APPROVE" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(403);
  });

  it("approves attempt with grid scores, awards XP and notifies", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "admin1", role: "ADMIN" } });

    const attempt = {
      id: "attempt1",
      userId: "user1",
      missionId: "mission1",
      status: "SUBMITTED",
      score: null,
      decision: null,
      reviewerId: null,
      mission,
      user: { id: "user1", email: "user1@test.com", name: "Jean" },
      stepResponses: completeResponses("attempt1"),
    };
    (prisma.missionAttempt.findUnique as any).mockResolvedValue(attempt);
    (prisma.missionAttempt.update as any).mockResolvedValue(attempt);
    (prisma.missionStepResponse.updateMany as any).mockResolvedValue({ count: 1 });

    const gridScores = { completude: 5, clarte: 4, reflexion: 4, coherence_objectif: 5, qualite_presentation: 4 };
    const stepScores = Object.fromEntries(
      steps.map((s, i) => [s.id, { score: i === 0 ? 4 : 5, feedback: "", status: "APPROVED" }])
    );

    const req = new Request("http://localhost/api/admin/missions/attempts/attempt1", {
      method: "PATCH",
      body: JSON.stringify({ action: "APPROVE", gridScores, stepScores }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("APPROVED");
    expect(body.score).toBe(22);

    const attemptUpdate = (prisma.missionAttempt.update as any).mock.calls[0][0];
    expect(attemptUpdate.data.status).toBe("APPROVED");
    expect(attemptUpdate.data.score).toBe(22);
    expect(attemptUpdate.data.reviewerId).toBe("admin1");

    expect(triggerNotification).toHaveBeenCalledWith(expect.objectContaining({
      type: "MISSION_APPROVED",
      userId: "user1",
    }));
    expect(logAttemptAction).toHaveBeenCalled();
    expect(logAttemptActivity).toHaveBeenCalled();
  });

  it("requires feedback for NEEDS_REVISION", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "admin1", role: "ADMIN" } });
    const attempt = {
      id: "attempt1",
      userId: "user1",
      missionId: "mission1",
      status: "SUBMITTED",
      mission,
      user: { id: "user1", email: "u@t.com", name: "U" },
      stepResponses: [],
    };
    (prisma.missionAttempt.findUnique as any).mockResolvedValue(attempt);

    const req = new Request("http://localhost/api/admin/missions/attempts/attempt1", {
      method: "PATCH",
      body: JSON.stringify({ action: "NEEDS_REVISION" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(400);
    expect(emailService.sendMissionNeedsRevision).not.toHaveBeenCalled();
  });

  it("requests revision with feedback and notifies", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "admin1", role: "ADMIN" } });
    const attempt = {
      id: "attempt1",
      userId: "user1",
      missionId: "mission1",
      status: "SUBMITTED",
      mission,
      user: { id: "user1", email: "u@t.com", name: "U" },
      stepResponses: [],
    };
    (prisma.missionAttempt.findUnique as any).mockResolvedValue(attempt);

    const req = new Request("http://localhost/api/admin/missions/attempts/attempt1", {
      method: "PATCH",
      body: JSON.stringify({ action: "NEEDS_REVISION", feedback: "Précise ton objectif" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    expect(emailService.sendMissionNeedsRevision).toHaveBeenCalledWith(expect.objectContaining({
      feedback: "Précise ton objectif",
    }));
  });

  it("returns attempt details with step scoring on GET", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "admin1", role: "ADMIN" } });
    const attempt = {
      id: "attempt1",
      userId: "user1",
      missionId: "mission1",
      status: "SUBMITTED",
      score: null,
      decision: null,
      reviewerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      submittedAt: new Date(),
      mission,
      user: { id: "user1", email: "u@t.com", name: "U" },
      reviewer: null,
      stepResponses: completeResponses("attempt1"),
      reviewLogs: [],
    };
    (prisma.missionAttempt.findUnique as any).mockResolvedValue(attempt);
    (prisma.missionStep.findMany as any).mockResolvedValue(steps);

    const req = new Request("http://localhost/api/admin/missions/attempts/attempt1", {
      method: "GET",
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.attempt.id).toBe("attempt1");
    expect(body.attempt.stepResponses.length).toBe(10);
    expect(body.attempt.scoringGrid.length).toBe(5);
    expect(body.attempt.maxScore).toBe(25);
  });
});
