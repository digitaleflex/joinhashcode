import { describe, it, expect } from "vitest"
import { getClaimDecision, isStaffRole } from "@/lib/review-access"

const submission = (over: Partial<{ userId: string; status: string; missionLevel: string | null }> = {}) => ({
  userId: "owner",
  status: "PENDING",
  mission: { missionLevel: over.missionLevel === undefined ? "INIT" : over.missionLevel },
  ...(over.userId ? { userId: over.userId } : {}),
  ...(over.status ? { status: over.status } : {}),
})

const reviewer = (role: string | null, missionsCompletedCount: number | null = 0) => ({
  id: "rev",
  role,
  missionsCompletedCount,
})

describe("isStaffRole", () => {
  it("reconnaît ADMIN et MODERATOR, rien d'autre", () => {
    expect(isStaffRole("ADMIN")).toBe(true)
    expect(isStaffRole("MODERATOR")).toBe(true)
    expect(isStaffRole("USER")).toBe(false)
    expect(isStaffRole(null)).toBe(false)
  })
})

describe("getClaimDecision (politique actuelle : modération seule)", () => {
  it("autorise la modération sur une soumission en attente, sans exiger 3 labs", () => {
    expect(getClaimDecision({ reviewer: reviewer("ADMIN", 0), submission: submission() })).toEqual({ ok: true })
    expect(getClaimDecision({ reviewer: reviewer("MODERATOR", 1), submission: submission({ missionLevel: "CORE" }) })).toEqual({ ok: true })
  })

  it("refuse un membre ordinaire tant que le mode concierge est actif", () => {
    const d = getClaimDecision({ reviewer: reviewer("USER", 5), submission: submission() })
    expect(d).toMatchObject({ ok: false, status: 403 })
  })

  it("contrôle l'autorisation avant l'état : un membre non autorisé n'apprend rien sur la soumission", () => {
    const refused = { ok: false, status: 403, message: "Le claim de mission est réservé à la modération." }
    for (const sub of [
      submission({ status: "APPROVED" }),
      submission({ missionLevel: "PRO" }),
      submission({ userId: "rev" }),
    ]) {
      expect(getClaimDecision({ reviewer: reviewer("USER", 9), submission: sub })).toEqual(refused)
    }
  })

  it("n'autorise jamais à relire sa propre soumission, même pour un admin", () => {
    const d = getClaimDecision({ reviewer: reviewer("ADMIN"), submission: submission({ userId: "rev" }) })
    expect(d).toMatchObject({ ok: false, status: 403 })
  })

  it("refuse une soumission qui n'est plus en attente", () => {
    for (const status of ["IN_REVIEW", "APPROVED", "NEEDS_REVISION", "PENDING_ADMIN"]) {
      expect(getClaimDecision({ reviewer: reviewer("ADMIN"), submission: submission({ status }) })).toMatchObject({
        ok: false,
        status: 400,
      })
    }
  })

  it("réserve les labs PRO à la validation depuis l'admin", () => {
    const d = getClaimDecision({ reviewer: reviewer("ADMIN"), submission: submission({ missionLevel: "PRO" }) })
    expect(d).toMatchObject({ ok: false, status: 400 })
  })
})
