import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  submissionFind: vi.fn(),
  userFind: vi.fn(),
  submissionUpdate: vi.fn(),
  logActivity: vi.fn(),
}))

vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }))
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: mocks.getSession } } }))
vi.mock("@/lib/prisma", () => ({
  prisma: {
    missionSubmission: { findUnique: mocks.submissionFind, update: mocks.submissionUpdate },
    user: { findUnique: mocks.userFind },
  },
}))
vi.mock("@/lib/ratelimit", () => ({
  claimLimiter: {},
  checkRateLimit: vi.fn(async () => ({ limited: false })),
}))
vi.mock("@/lib/activity-log", () => ({ logActivity: mocks.logActivity }))
vi.mock("@/lib/webhooks", () => ({ triggerWebhooks: vi.fn(() => Promise.resolve()) }))

import { POST } from "@/app/api/missions/[id]/claim/route"

const call = () => POST(new Request("http://localhost/api/missions/s1/claim", { method: "POST" }), { params: Promise.resolve({ id: "s1" }) })

const pending = (over: Record<string, unknown> = {}) => ({
  id: "s1",
  userId: "owner",
  missionId: "m1",
  status: "PENDING",
  mission: { title: "Triage d'alertes", missionLevel: "INIT" },
  ...over,
})

describe("POST /api/missions/[id]/claim", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getSession.mockResolvedValue({ user: { id: "rev" } })
    mocks.submissionFind.mockResolvedValue(pending())
    mocks.submissionUpdate.mockResolvedValue({ id: "s1", status: "IN_REVIEW" })
  })

  it("renvoie 401 sans session", async () => {
    mocks.getSession.mockResolvedValue(null)
    expect((await call()).status).toBe(401)
  })

  it("renvoie 404 pour une soumission inconnue", async () => {
    mocks.userFind.mockResolvedValue({ id: "rev", name: "R", email: "r@x.test", role: "ADMIN", missionsCompletedCount: 0 })
    mocks.submissionFind.mockResolvedValue(null)
    expect((await call()).status).toBe(404)
  })

  it("laisse la modération prendre en charge une soumission en attente", async () => {
    mocks.userFind.mockResolvedValue({ id: "rev", name: "R", email: "r@x.test", role: "ADMIN", missionsCompletedCount: 0 })
    const res = await call()

    expect(res.status).toBe(200)
    expect(mocks.submissionUpdate).toHaveBeenCalledWith({
      where: { id: "s1", status: "PENDING" },
      data: { status: "IN_REVIEW", reviewerId: "rev", reviewerType: "PEER" },
    })
  })

  it("laisse un pair ayant validé 3 labs prendre en charge, sans profil psychométrique", async () => {
    mocks.userFind.mockResolvedValue({ id: "rev", name: "R", email: "r@x.test", role: "USER", missionsCompletedCount: 3 })
    const res = await call()

    expect(res.status).toBe(200)
    expect(mocks.submissionUpdate).toHaveBeenCalledWith({
      where: { id: "s1", status: "PENDING" },
      data: { status: "IN_REVIEW", reviewerId: "rev", reviewerType: "PEER" },
    })
  })

  it("refuse un membre qui n'a validé que 2 labs", async () => {
    mocks.userFind.mockResolvedValue({ id: "rev", name: "R", email: "r@x.test", role: "USER", missionsCompletedCount: 2 })
    const res = await call()

    expect(res.status).toBe(403)
    expect((await res.json()).message).toMatch(/au moins 3 labs/)
    expect(mocks.submissionUpdate).not.toHaveBeenCalled()
  })

  it("réserve les labs PRO à l'admin, même pour un pair éligible", async () => {
    mocks.userFind.mockResolvedValue({ id: "rev", name: "R", email: "r@x.test", role: "USER", missionsCompletedCount: 9 })
    mocks.submissionFind.mockResolvedValue(pending({ mission: { title: "Lab PRO", missionLevel: "PRO" } }))

    expect((await call()).status).toBe(400)
    expect(mocks.submissionUpdate).not.toHaveBeenCalled()
  })

  it("refuse de relire sa propre soumission, même pour un admin", async () => {
    mocks.userFind.mockResolvedValue({ id: "rev", name: "R", email: "r@x.test", role: "ADMIN", missionsCompletedCount: 9 })
    mocks.submissionFind.mockResolvedValue(pending({ userId: "rev" }))

    expect((await call()).status).toBe(403)
    expect(mocks.submissionUpdate).not.toHaveBeenCalled()
  })

  it("renvoie 409 si un autre relecteur a pris la soumission entre-temps", async () => {
    mocks.userFind.mockResolvedValue({ id: "rev", name: "R", email: "r@x.test", role: "ADMIN", missionsCompletedCount: 0 })
    mocks.submissionUpdate.mockRejectedValue(Object.assign(new Error("not found"), { code: "P2025" }))

    expect((await call()).status).toBe(409)
  })
})
