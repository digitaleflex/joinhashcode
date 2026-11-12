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

describe("getClaimDecision (D-029 / D-030 : modération et pairs ayant validé 3 labs)", () => {
  it("autorise la modération sur une soumission en attente, sans exiger 3 labs", () => {
    expect(getClaimDecision({ reviewer: reviewer("ADMIN", 0), submission: submission() })).toEqual({ ok: true })
    expect(getClaimDecision({ reviewer: reviewer("MODERATOR", 1), submission: submission({ missionLevel: "CORE" }) })).toEqual({ ok: true })
  })

  it("autorise un membre ordinaire ayant validé 3 labs ou plus, sans profil ni niveau", () => {
    expect(getClaimDecision({ reviewer: reviewer("USER", 3), submission: submission() })).toEqual({ ok: true })
    expect(getClaimDecision({ reviewer: reviewer("MEMBER", 12), submission: submission({ missionLevel: "CORE" }) })).toEqual({ ok: true })
  })

  it("refuse un membre qui n'a pas validé 3 labs, avec un message qui dit pourquoi", () => {
    for (const count of [0, 1, 2, null]) {
      const d = getClaimDecision({ reviewer: reviewer("USER", count), submission: submission() })
      expect(d).toMatchObject({ ok: false, status: 403 })
      expect(d.ok === false && d.message).toMatch(/au moins 3 labs/)
    }
  })

  it("contrôle l'autorisation avant l'état : un membre non autorisé n'apprend rien sur la soumission", () => {
    const refused = getClaimDecision({ reviewer: reviewer("USER", 1), submission: submission() })
    for (const sub of [submission({ status: "APPROVED" }), submission({ missionLevel: "PRO" })]) {
      expect(getClaimDecision({ reviewer: reviewer("USER", 1), submission: sub })).toEqual(refused)
    }
  })

  it("n'autorise jamais à relire sa propre soumission, même pour un admin ou un pair éligible", () => {
    for (const r of [reviewer("ADMIN"), reviewer("USER", 9)]) {
      expect(getClaimDecision({ reviewer: r, submission: submission({ userId: "rev" }) })).toMatchObject({ ok: false, status: 403 })
    }
  })

  it("refuse une soumission qui n'est plus en attente", () => {
    for (const status of ["IN_REVIEW", "APPROVED", "NEEDS_REVISION", "PENDING_ADMIN"]) {
      expect(getClaimDecision({ reviewer: reviewer("USER", 5), submission: submission({ status }) })).toMatchObject({
        ok: false,
        status: 400,
      })
    }
  })

  it("réserve les labs PRO à la validation depuis l'admin, même pour un pair éligible", () => {
    const d = getClaimDecision({ reviewer: reviewer("USER", 9), submission: submission({ missionLevel: "PRO" }) })
    expect(d).toMatchObject({ ok: false, status: 400 })
  })
})
