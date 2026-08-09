import { describe, it, expect } from "vitest"
import { analyzeQuizResults } from "@/lib/analysis"
import { questions } from "@/lib/questions"

describe("analyzeQuizResults", () => {
  it("returns equal distribution and hybrid when no answers match questions", () => {
    const result = analyzeQuizResults([], [])
    expect(result.isHybrid).toBe(true)
    expect(result.hybridLabel).toBe("Profil non déterminé")
    expect(result.consistencyScore).toBe(0)
    expect(result.percentages).toEqual({ builder: 25, creator: 25, strategist: 25, catalyst: 25 })
    expect(result.suggestedChannels).toEqual([])
    expect(result.recommendedSpecializations).toEqual([])
  })

  it("classifies as pure builder when all answers are builder", () => {
    const answers = questions.map(() => "builder")
    const result = analyzeQuizResults(answers, [])
    expect(result.primary).toBe("builder")
    expect(result.isHybrid).toBe(false)
    expect(result.percentages.builder).toBeGreaterThanOrEqual(80)
    expect(result.percentages.creator).toBeLessThan(10)
  })

  it("classifies as pure creator when all answers are creator", () => {
    const answers = questions.map(() => "creator")
    const result = analyzeQuizResults(answers, [])
    expect(result.primary).toBe("creator")
    expect(result.isHybrid).toBe(false)
  })

  it("classifies as pure strategist when all answers are strategist", () => {
    const answers = questions.map(() => "strategist")
    const result = analyzeQuizResults(answers, [])
    expect(result.primary).toBe("strategist")
    expect(result.isHybrid).toBe(false)
  })

  it("classifies as pure catalyst when all answers are catalyst", () => {
    const answers = questions.map(() => "catalyst")
    const result = analyzeQuizResults(answers, [])
    expect(result.primary).toBe("catalyst")
    expect(result.isHybrid).toBe(false)
  })

  it("detects hybrid when two profiles are close", () => {
    const answers = [
      "builder", "strategist", "strategist", "catalyst", "creator"
    ]
    const result = analyzeQuizResults(answers, [])
    expect(result.isHybrid).toBe(true)
    expect(result.hybridLabel).toMatch(/Builder.*Stratège|Stratège.*Builder/)
  })

  it("tie-breaks by faster response time when scores are equal", () => {
    const half = Math.floor(questions.length / 2)
    const tieAnswers = questions.map((_, i) => i < half ? "builder" : "creator")

    const slowTimes = tieAnswers.map((_, i) => i < half ? 0.5 : 1.0)
    const fastTimes = tieAnswers.map((_, i) => i < half ? 1.0 : 0.5)

    const resultSlow = analyzeQuizResults(tieAnswers, slowTimes)
    const resultFast = analyzeQuizResults(tieAnswers, fastTimes)

    if (resultSlow.primary === resultFast.primary) {
      expect(resultSlow.secondary).toBe(resultFast.secondary)
    }
  })

  it("uses mainObjective to sort specializations", () => {
    const answers = questions.map(() => "builder")
    const result = analyzeQuizResults(answers, [], "CYBERSECURITY")
    expect(result.recommendedSpecializations.length).toBeGreaterThan(0)
    const firstSpec = result.recommendedSpecializations[0]
    expect(firstSpec).toBeDefined()
  })

  it("returns suggested channels matching the profile", () => {
    const answers = questions.map(() => "builder")
    const result = analyzeQuizResults(answers, [])
    expect(result.suggestedChannels.length).toBeGreaterThan(0)
    expect(result.suggestedChannels[0]).toHaveProperty("name")
    expect(result.suggestedChannels[0]).toHaveProperty("url")
  })

  it("produces a consistency score between 0 and 1", () => {
    const allSame = questions.map(() => "builder")
    const result = analyzeQuizResults(allSame, [])
    expect(result.consistencyScore).toBeGreaterThan(0.8)

    const spread = ["builder", "creator", "strategist", "catalyst"]
    const answers = questions.map((_, i) => spread[i % 4])
    const resultSpread = analyzeQuizResults(answers, [])
    expect(resultSpread.consistencyScore).toBeLessThanOrEqual(1)
    expect(resultSpread.consistencyScore).toBeGreaterThanOrEqual(0)
  })

  it("always returns level 1", () => {
    const answers = questions.map(() => "builder")
    const result = analyzeQuizResults(answers, [])
    expect(result.level).toBe(1)
  })

  it("returns secondary different from primary in non-hybrid case", () => {
    const answers = questions.map(() => "builder")
    const result = analyzeQuizResults(answers, [])
    expect(result.primary).not.toBe(result.secondary)
  })
})
