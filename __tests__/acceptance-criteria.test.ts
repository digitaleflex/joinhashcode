import { describe, it, expect } from "vitest"
import {
  getCriteriaForMission,
  computeQualityLevel,
  computeXp,
  isEligibleReviewer,
  getMissingRequiredCriteria,
} from "@/lib/acceptance-criteria"

describe("getCriteriaForMission", () => {
  it("returns CODE criteria for CODE category", () => {
    const criteria = getCriteriaForMission("CODE")
    expect(criteria.some(c => c.id === "code-readme")).toBe(true)
  })

  it("falls back to GENERAL for unknown category", () => {
    const criteria = getCriteriaForMission("UNKNOWN")
    expect(criteria.some(c => c.id === "general-proof")).toBe(true)
  })
})

describe("computeQualityLevel", () => {
  it("returns STANDARD when only required criteria are checked", () => {
    const criteria = getCriteriaForMission("CODE")
    const checked: Record<string, boolean> = {}
    criteria.filter(c => c.weight === "REQUIRED").forEach(c => { checked[c.id] = true })
    criteria.filter(c => c.weight === "BONUS").forEach(c => { checked[c.id] = false })
    expect(computeQualityLevel(criteria, checked)).toBe("STANDARD")
  })

  it("returns GOOD when required + 2 bonus criteria are checked", () => {
    const criteria = getCriteriaForMission("CODE")
    const checked: Record<string, boolean> = {}
    criteria.filter(c => c.weight === "REQUIRED").forEach(c => { checked[c.id] = true })
    const bonus = criteria.filter(c => c.weight === "BONUS")
    bonus.forEach((c, i) => { checked[c.id] = i < 2 })
    expect(computeQualityLevel(criteria, checked)).toBe("GOOD")
  })

  it("returns EXEMPLARY when all criteria are checked", () => {
    const criteria = getCriteriaForMission("CODE")
    const checked: Record<string, boolean> = {}
    criteria.forEach(c => { checked[c.id] = true })
    expect(computeQualityLevel(criteria, checked)).toBe("EXEMPLARY")
  })
})

describe("computeXp", () => {
  it("returns 100% XP for STANDARD", () => {
    expect(computeXp(200, "STANDARD")).toBe(200)
  })

  it("returns 125% XP for GOOD", () => {
    expect(computeXp(200, "GOOD")).toBe(250)
  })

  it("returns 150% XP for EXEMPLARY", () => {
    expect(computeXp(200, "EXEMPLARY")).toBe(300)
  })
})

describe("isEligibleReviewer", () => {
  const base = {
    reviewerClass: "builder",
    reviewerLevel: 2,
    reviewerMissionsCompleted: 3,
    reviewerId: "rev1",
    submissionUserId: "user1",
    missionTargetProfiles: ["builder"],
    missionRequiredLevel: 1,
  }

  it("returns true for eligible reviewer", () => {
    expect(isEligibleReviewer(base)).toBe(true)
  })

  it("returns false if reviewer is the submitter", () => {
    expect(isEligibleReviewer({ ...base, reviewerId: "user1" })).toBe(false)
  })

  it("returns false if wrong profile", () => {
    expect(isEligibleReviewer({ ...base, reviewerClass: "creator" })).toBe(false)
  })

  it("returns false if level not high enough", () => {
    expect(isEligibleReviewer({ ...base, reviewerLevel: 1 })).toBe(false)
  })

  it("returns false if fewer than 3 missions completed", () => {
    expect(isEligibleReviewer({ ...base, reviewerMissionsCompleted: 2 })).toBe(false)
  })
})

describe("getMissingRequiredCriteria", () => {
  it("returns labels of unchecked required criteria", () => {
    const criteria = getCriteriaForMission("CODE")
    const checked: Record<string, boolean> = {}
    criteria.forEach(c => { checked[c.id] = true })
    checked["code-readme"] = false
    const missing = getMissingRequiredCriteria(criteria, checked)
    expect(missing).toContain("README présent avec description du projet")
    expect(missing).toHaveLength(1)
  })

  it("returns empty array when all required criteria are checked", () => {
    const criteria = getCriteriaForMission("CODE")
    const checked: Record<string, boolean> = {}
    criteria.forEach(c => { checked[c.id] = true })
    expect(getMissingRequiredCriteria(criteria, checked)).toHaveLength(0)
  })
})
