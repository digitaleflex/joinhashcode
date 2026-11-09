import { describe, test, expect } from "vitest";
import {
  betaVerifySchema,
  quizFeedbackSchema,
  uxPollSchema,
  notificationBulkSchema,
  adminKeyGenSchema,
  adminBroadcastSchema,
  adminLogSchema,
} from "../lib/validation/misc";

describe("S6-2 — misc API input validation schemas", () => {
  test("betaVerifySchema rejects empty key", () => {
    expect(betaVerifySchema.safeParse({}).success).toBe(false);
    expect(betaVerifySchema.safeParse({ key: "  " }).success).toBe(false);
    expect(betaVerifySchema.safeParse({ key: "ABC-123" }).success).toBe(true);
  });

  test("quizFeedbackSchema requires isAccurate and usefulness", () => {
    expect(quizFeedbackSchema.safeParse({ quizResultId: "r1" }).success).toBe(false);
    expect(quizFeedbackSchema.safeParse({ quizResultId: "r1", isAccurate: true, usefulness: 3 }).success).toBe(true);
    expect(quizFeedbackSchema.safeParse({ quizResultId: "r1", isAccurate: true, usefulness: 9 }).success).toBe(false);
    expect(quizFeedbackSchema.safeParse({ quizResultId: "r1", isAccurate: true, usefulness: 3, comment: "x".repeat(2001) }).success).toBe(false);
  });

  test("uxPollSchema clamps arrays and numbers", () => {
    expect(uxPollSchema.safeParse({ modernityRating: 3, prefersDarkMode: true, readabilityIssues: ["a", "b"] }).success).toBe(true);
    expect(uxPollSchema.safeParse({ modernityRating: 9 }).success).toBe(false);
    expect(uxPollSchema.safeParse({ modernityRating: 3, readabilityIssues: Array(11).fill("x") }).success).toBe(false);
  });

  test("notificationBulkSchema rejects oversized ids", () => {
    expect(notificationBulkSchema.safeParse({ ids: ["a"], isRead: true }).success).toBe(true);
    expect(notificationBulkSchema.safeParse({ ids: Array(101).fill("x") }).success).toBe(false);
    expect(notificationBulkSchema.safeParse({ readAll: "yes" }).success).toBe(false);
  });

  test("adminKeyGenSchema defaults and clamps", () => {
    const r = adminKeyGenSchema.safeParse({});
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.count).toBe(1);
      expect(r.data.prefix).toBe("H26-");
    }
    expect(adminKeyGenSchema.safeParse({ count: 500 }).success).toBe(false);
    expect(adminKeyGenSchema.safeParse({ count: 50, prefix: "X" }).success).toBe(true);
  });

  test("adminBroadcastSchema requires title and message", () => {
    expect(adminBroadcastSchema.safeParse({}).success).toBe(false);
    expect(adminBroadcastSchema.safeParse({ title: "T", message: "M" }).success).toBe(true);
    expect(adminBroadcastSchema.safeParse({ title: "T", message: "M", link: "javascript:alert(1)" }).success).toBe(false);
  });

  test("adminLogSchema validates action and metadata shape", () => {
    expect(adminLogSchema.safeParse({ action: "ADMIN_USER_BANNED", entityId: "e1", metadata: { a: 1 } }).success).toBe(true);
    expect(adminLogSchema.safeParse({ action: 123 }).success).toBe(false);
    expect(adminLogSchema.safeParse({ action: "X", metadata: "not-an-object" }).success).toBe(false);
  });
});
