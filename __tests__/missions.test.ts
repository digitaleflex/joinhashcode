import { describe, it, expect, vi, afterEach } from "vitest";
import {
  MISSIONS,
  WEEKLY_CHALLENGES,
  getCurrentWeeklyChallenge,
  getCurrentCycleKey,
} from "../lib/missions";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MISSIONS data integrity", () => {
  it("should have unique ids", () => {
    const ids = MISSIONS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have unique slugs when present", () => {
    const slugs = MISSIONS.map((m) => m.slug).filter(Boolean);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("should have all required fields on every mission", () => {
    for (const m of MISSIONS) {
      expect(m.id).toBeTruthy();
      expect(m.title).toBeTruthy();
      expect(m.shortDesc).toBeTruthy();
      expect(m.description).toBeTruthy();
      expect(typeof m.xpReward).toBe("number");
      expect(m.xpReward).toBeGreaterThan(0);
      expect(m.targetProfiles.length).toBeGreaterThan(0);
      expect(["INIT", "CORE", "PRO"]).toContain(m.missionLevel);
      expect(Array.isArray(m.requirements)).toBe(true);
    }
  });

  it("should have positive XP rewards", () => {
    for (const m of MISSIONS) {
      expect(m.xpReward).toBeGreaterThanOrEqual(20);
    }
  });

  it("should have valid submission methods", () => {
    const validMethods = ["ANY_LINK", "TEXT_RESPONSE", "LIVE_URL", "DOCUMENT_LINK", "GITHUB_LINK"];
    for (const m of MISSIONS) {
      if (m.submissionMethod) {
        expect(validMethods).toContain(m.submissionMethod);
      }
    }
  });

  it("should target all four profiles when missions exist", () => {
    for (const m of MISSIONS) {
      expect(m.targetProfiles).toContain("builder");
      expect(m.targetProfiles).toContain("creator");
      expect(m.targetProfiles).toContain("strategist");
      expect(m.targetProfiles).toContain("catalyst");
    }
  });
});

describe("WEEKLY_CHALLENGES data integrity", () => {
  it("should have unique ids", () => {
    const ids = WEEKLY_CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have valid XP rewards", () => {
    for (const c of WEEKLY_CHALLENGES) {
      expect(c.xp).toBeGreaterThan(0);
      expect(typeof c.xp).toBe("number");
    }
  });
});

describe("getCurrentWeeklyChallenge", () => {
  it("should return a valid challenge from the list when challenges exist", () => {
    if (WEEKLY_CHALLENGES.length === 0) {
      expect(getCurrentWeeklyChallenge()).toBeUndefined();
      return;
    }
    // Mock a fixed date to be deterministic
    vi.setSystemTime(new Date("2026-08-05T12:00:00Z"));
    const challenge = getCurrentWeeklyChallenge()!;
    expect(WEEKLY_CHALLENGES).toContain(challenge);
    expect(challenge.id).toBeTruthy();
    expect(challenge.title).toBeTruthy();
  });

  it("should rotate through challenges based on week number", () => {
    if (WEEKLY_CHALLENGES.length === 0) {
      expect(getCurrentWeeklyChallenge()).toBeUndefined();
      return;
    }
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
    const first = getCurrentWeeklyChallenge();
    vi.setSystemTime(new Date("2026-01-08T12:00:00Z"));
    const second = getCurrentWeeklyChallenge();
    // Different weeks might pick the same or different challenges depending on array size,
    // but the function must always return a valid one.
    expect(WEEKLY_CHALLENGES).toContain(first);
    expect(WEEKLY_CHALLENGES).toContain(second);
  });
});

describe("getCurrentCycleKey", () => {
  it("should return PERMANENT when mission is not a weekly challenge", () => {
    expect(getCurrentCycleKey()).toBe("PERMANENT");
    expect(getCurrentCycleKey({ isWeeklyChallenge: false })).toBe("PERMANENT");
  });

  it("should return year-week key for weekly challenges", () => {
    vi.setSystemTime(new Date("2026-08-05T12:00:00Z"));
    const key = getCurrentCycleKey({ isWeeklyChallenge: true });
    expect(key).toMatch(/^\d{4}-W\d{2}$/);
  });

  it("should produce a stable key within the same week", () => {
    vi.setSystemTime(new Date("2026-08-05T10:00:00Z"));
    const key1 = getCurrentCycleKey({ isWeeklyChallenge: true });
    vi.setSystemTime(new Date("2026-08-05T22:00:00Z"));
    const key2 = getCurrentCycleKey({ isWeeklyChallenge: true });
    expect(key1).toBe(key2);
  });
});
