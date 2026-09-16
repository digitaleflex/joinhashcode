import { describe, it, expect, vi, beforeEach } from "vitest"
import { updateSquadCohesion, processStreakBreaks } from "../lib/squad-logic"

const { mockOrgFindUnique, mockOrgUpdate, mockMemberFindMany, mockNotifCreateMany, mockUserFindUnique, mockUserUpdate, mockAwardXp, mockOrgFindMany, mockOrgUpdateMany } = vi.hoisted(() => ({
  mockOrgFindUnique: vi.fn(),
  mockOrgUpdate: vi.fn(),
  mockMemberFindMany: vi.fn(),
  mockNotifCreateMany: vi.fn(),
  mockUserFindUnique: vi.fn(),
  mockUserUpdate: vi.fn(),
  mockAwardXp: vi.fn(),
  mockOrgFindMany: vi.fn(),
  mockOrgUpdateMany: vi.fn(),
}))

vi.mock("../lib/prisma", () => ({
  prisma: {
    organization: {
      findUnique: mockOrgFindUnique,
      update: mockOrgUpdate,
      findMany: mockOrgFindMany,
      updateMany: mockOrgUpdateMany,
    },
    member: {
      findMany: mockMemberFindMany,
    },
    notification: {
      createMany: mockNotifCreateMany,
    },
    user: {
      findUnique: mockUserFindUnique,
      update: mockUserUpdate,
    },
  },
}))

vi.mock("../lib/experience", () => ({
  awardXp: mockAwardXp,
}))

vi.mock("../lib/after", () => ({
  safeAfter: (fn: () => Promise<void>) => fn(),
}))

const ORG_ID = "org-1"
const YESTERDAY = new Date(Date.now() - 86400000)

describe("updateSquadCohesion", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("silently returns when squad is not found", async () => {
    mockOrgFindUnique.mockResolvedValue(null)
    await updateSquadCohesion(ORG_ID, 0.05)
    expect(mockOrgUpdate).not.toHaveBeenCalled()
  })

  it("boosts cohesion score and caps at 1.0", async () => {
    mockOrgFindUnique
      .mockResolvedValueOnce({ cohesionScore: 0.95, name: "Test Squad" })
      .mockResolvedValueOnce({ lastStreakAt: YESTERDAY, streakCount: 1 })
    mockMemberFindMany.mockResolvedValue([])
    mockNotifCreateMany.mockResolvedValue({ count: 0 })

    await updateSquadCohesion(ORG_ID, 0.1)

    expect(mockOrgUpdate).toHaveBeenCalledTimes(2)
    expect(mockOrgUpdate).toHaveBeenNthCalledWith(1,
      expect.objectContaining({ where: { id: ORG_ID }, data: { cohesionScore: 1.0 } })
    )
  })

  it("triggers max cohesion reward at 1.0", async () => {
    mockOrgFindUnique
      .mockResolvedValueOnce({ cohesionScore: 0.95, name: "Test Squad" })
      .mockResolvedValueOnce({ lastStreakAt: YESTERDAY, streakCount: 2 })
    mockMemberFindMany.mockResolvedValue([{ userId: "user-1" }, { userId: "user-2" }])
    mockNotifCreateMany.mockResolvedValue({ count: 0 })

    await updateSquadCohesion(ORG_ID, 0.05)

    const calls = mockNotifCreateMany.mock.calls
    const hasMaxCohesionNotif = calls.some(([args]) =>
      args.data?.some((n: { type: string }) => n.type === "SQUAD_COHESION_MAX")
    )
    expect(hasMaxCohesionNotif).toBe(true)
  })

  it("notifies other members when triggerUserId is provided", async () => {
    mockOrgFindUnique.mockResolvedValue({ cohesionScore: 0.5, name: "Test Squad" })
    mockUserFindUnique.mockResolvedValue({ name: "Alice" })
    mockMemberFindMany.mockResolvedValue([{ userId: "user-2" }])
    mockNotifCreateMany.mockResolvedValue({ count: 0 })

    await updateSquadCohesion(ORG_ID, 0.05, "user-1")

    const calls = mockNotifCreateMany.mock.calls
    const hasCheckinNotif = calls.some(([args]) =>
      args.data?.some((n: { type: string }) => n.type === "SQUAD_MEMBER_CHECKIN")
    )
    expect(hasCheckinNotif).toBe(true)
  })

  it("triggers streak 3 notification at day 3", async () => {
    mockOrgFindUnique
      .mockResolvedValueOnce({ cohesionScore: 0.9, name: "Test Squad" })
      .mockResolvedValueOnce({ lastStreakAt: YESTERDAY, streakCount: 2 })
    mockMemberFindMany.mockResolvedValue([{ userId: "user-1" }])
    mockNotifCreateMany.mockResolvedValue({ count: 0 })

    await updateSquadCohesion(ORG_ID, 0.01)

    const calls = mockNotifCreateMany.mock.calls
    const hasStreak3Notif = calls.some(([args]) =>
      args.data?.some((n: { type: string }) => n.type === "SQUAD_STREAK_3")
    )
    expect(hasStreak3Notif).toBe(true)
  })

  it("triggers streak 7 reward at day 7", async () => {
    mockOrgFindUnique
      .mockResolvedValueOnce({ cohesionScore: 0.9, name: "Test Squad" })
      .mockResolvedValueOnce({ lastStreakAt: YESTERDAY, streakCount: 6 })
    mockMemberFindMany.mockResolvedValue([{ userId: "user-1" }])
    mockNotifCreateMany.mockResolvedValue({ count: 0 })

    await updateSquadCohesion(ORG_ID, 0.01)

    const calls = mockNotifCreateMany.mock.calls
    const hasStreak7Notif = calls.some(([args]) =>
      args.data?.some((n: { type: string }) => n.type === "SQUAD_STREAK_7")
    )
    expect(hasStreak7Notif).toBe(true)
  })

  it("catches errors internally without throwing", async () => {
    mockOrgFindUnique.mockRejectedValue(new Error("DB crash"))
    await expect(updateSquadCohesion(ORG_ID, 0.05)).resolves.toBeUndefined()
  })
})

describe("processStreakBreaks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNotifCreateMany.mockResolvedValue({ count: 0 })
  })

  it("consumes a freeze and protects the streak after 48h of inactivity", async () => {
    mockOrgFindMany.mockResolvedValue([
      { id: ORG_ID, name: "Test Squad", streakCount: 5, streakFreezes: 1 },
    ])
    mockOrgUpdate.mockResolvedValue({})

    const result = await processStreakBreaks()

    expect(result).toEqual({ frozen: 1, reset: 0 })
    expect(mockOrgUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: ORG_ID },
        data: expect.objectContaining({ streakFreezes: { decrement: 1 } }),
      })
    )
    const freezeNotif = mockNotifCreateMany.mock.calls.some(([args]) =>
      args.data?.some((n: { type: string }) => n.type === "SQUAD_STREAK_FREEZE")
    )
    expect(freezeNotif).toBe(true)
  })

  it("resets the streak to 0 when no freeze is available", async () => {
    mockOrgFindMany.mockResolvedValue([
      { id: ORG_ID, name: "Test Squad", streakCount: 5, streakFreezes: 0 },
    ])
    mockOrgUpdate.mockResolvedValue({})

    const result = await processStreakBreaks()

    expect(result).toEqual({ frozen: 0, reset: 1 })
    expect(mockOrgUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: ORG_ID }, data: { streakCount: 0 } })
    )
  })

  it("does nothing when no squad is breaking", async () => {
    mockOrgFindMany.mockResolvedValue([])
    const result = await processStreakBreaks()
    expect(result).toEqual({ frozen: 0, reset: 0 })
    expect(mockOrgUpdate).not.toHaveBeenCalled()
  })
})
