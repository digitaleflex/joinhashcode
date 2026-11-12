import { describe, it, expect } from "vitest"
import {
  getCriteriaForMission,
  getReviewCriteria,
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

describe("getReviewCriteria (#424)", () => {
  it("uses the lab's own acceptance criteria when present", () => {
    const criteria = getReviewCriteria({ category: "CODE", acceptanceCriteria: ["Les tests passent", "  ", "Mesures avant/après"] })
    expect(criteria.map(c => c.label)).toEqual(["Les tests passent", "Mesures avant/après"])
    expect(criteria.every(c => c.weight === "REQUIRED")).toBe(true)
    expect(criteria.some(c => c.id === "code-commits")).toBe(false)
  })

  it("falls back to the category grid when the lab defines no criteria", () => {
    expect(getReviewCriteria({ category: "CODE", acceptanceCriteria: [] }).some(c => c.id === "code-readme")).toBe(true)
    expect(getReviewCriteria({ category: "BUSINESS", acceptanceCriteria: null }).length).toBeGreaterThan(0)
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

  it("returns GOOD (not EXEMPLARY) for a single-bonus mission with all bonus checked", () => {
    const criteria = getCriteriaForMission("INTRO") // has 1 bonus criterion
    const checked: Record<string, boolean> = {}
    criteria.forEach(c => { checked[c.id] = true })
    // INTRO has only 1 bonus criterion — should be GOOD, not EXEMPLARY (< 2 bonus required for EXEMPLARY)
    expect(computeQualityLevel(criteria, checked)).toBe("GOOD")
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

describe("isEligibleReviewer (D-029 : 3 labs validés, sans condition de profil)", () => {
  const base = {
    reviewerMissionsCompleted: 3,
    reviewerId: "rev1",
    submissionUserId: "user1",
  }

  it("returns true for a member with 3 validated labs", () => {
    expect(isEligibleReviewer(base)).toBe(true)
  })

  it("returns false if reviewer is the submitter", () => {
    expect(isEligibleReviewer({ ...base, reviewerId: "user1" })).toBe(false)
  })

  it("does not depend on level: 3 validated labs are enough", () => {
    expect(isEligibleReviewer({ ...base, reviewerMissionsCompleted: 3 })).toBe(true)
    expect(isEligibleReviewer({ ...base, reviewerMissionsCompleted: 12 })).toBe(true)
  })

  it("returns false if fewer than 3 labs are validated", () => {
    expect(isEligibleReviewer({ ...base, reviewerMissionsCompleted: 2 })).toBe(false)
    expect(isEligibleReviewer({ ...base, reviewerMissionsCompleted: 0 })).toBe(false)
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

  it("returns all required labels when nothing is checked", () => {
    const criteria = getCriteriaForMission("CODE")
    const checked: Record<string, boolean> = {}
    const missing = getMissingRequiredCriteria(criteria, checked)
    expect(missing).toHaveLength(criteria.filter(c => c.weight === "REQUIRED").length)
  })
})
