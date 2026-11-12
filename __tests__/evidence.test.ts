import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock prisma avant l'import de evidence
vi.mock("@/lib/prisma", () => ({
  prisma: {
    missionSubmission: {
      findMany: vi.fn(),
    },
  },
}))

import { getPublicEvidence } from "@/lib/evidence"
import { prisma } from "@/lib/prisma"

const mockFindMany = prisma.missionSubmission.findMany as ReturnType<typeof vi.fn>

describe("getPublicEvidence", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renvoie uniquement les soumissions APPROVED", async () => {
    mockFindMany.mockResolvedValue([
      {
        id: "sub-1",
        missionId: "m-1",
        qualityLevel: "HIGH",
        updatedAt: new Date("2026-01-01"),
        mission: { title: "Lab Git", category: "CODE", slug: "lab-git", missionLevel: "intermediate" },
        artifacts: [{ id: "a-1", type: "link", label: "Repo", fileUrl: "https://github.com/x", fileName: null, mimeType: null, status: "SUBMITTED" }],
        reviews: [{ feedback: "Bien fait", qualityLevel: "HIGH", createdAt: new Date("2026-01-02") }],
      },
    ])

    const result = await getPublicEvidence("user-1")

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "APPROVED", userId: "user-1" }),
      })
    )
    expect(result).toHaveLength(1)
    expect(result[0].status).toBe("APPROVED")
    expect(result[0].mission.title).toBe("Lab Git")
    expect(result[0].artifacts).toHaveLength(1)
    expect(result[0].review?.feedback).toBe("Bien fait")
  })

  it("exclut les artefacts REJECTED", async () => {
    mockFindMany.mockResolvedValue([
      {
        id: "sub-2",
        missionId: "m-2",
        qualityLevel: "STANDARD",
        updatedAt: new Date("2026-01-03"),
        mission: { title: "Lab SQL", category: "DATA", slug: "lab-sql", missionLevel: null },
        artifacts: [
          { id: "a-2", type: "link", label: "OK", fileUrl: "https://x", fileName: null, mimeType: null, status: "SUBMITTED" },
          { id: "a-3", type: "link", label: "Bad", fileUrl: "https://y", fileName: null, mimeType: null, status: "REJECTED" },
        ],
        reviews: [],
      },
    ])

    const result = await getPublicEvidence("user-2")

    expect(result[0].artifacts).toHaveLength(1)
    expect(result[0].artifacts[0].id).toBe("a-2")
  })

  it("renvoie un tableau vide si aucune soumission APPROVED", async () => {
    mockFindMany.mockResolvedValue([])
    const result = await getPublicEvidence("user-3")
    expect(result).toEqual([])
  })
})