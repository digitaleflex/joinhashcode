import { describe, it, expect } from "vitest";
import {
  createInitialKalmanState,
  createKalmanStateFromQuiz,
  kalmanPredict,
  kalmanUpdate,
  getKalmanInsights,
  buildProfileDistributionFromKalman,
  serializeKalmanState,
  deserializeKalmanState,
  updateProfileWithKalman,
  getKalmanProfileSummary,
} from "@/lib/profile-kalman";

describe("profile-kalman", () => {
  it("creates an initial state with default probabilities", () => {
    const state = createInitialKalmanState();
    expect(state.mean).toHaveLength(4);
    expect(state.confidence).toBeGreaterThanOrEqual(0.3);
    expect(state.confidence).toBeLessThanOrEqual(0.95);
  });

  it("builds a Kalman state from quiz percentages", () => {
    const state = createKalmanStateFromQuiz({
      builder: 60,
      creator: 20,
      strategist: 10,
      catalyst: 10,
    });

    expect(state.mean[0]).toBeCloseTo(0.6, 5);
    expect(state.mean[1]).toBeCloseTo(0.2, 5);
    expect(state.mean[2]).toBeCloseTo(0.1, 5);
    expect(state.mean[3]).toBeCloseTo(0.1, 5);
    expect(state.confidence).toBeGreaterThan(0.3);
  });

  it("predicts without changing confidence", () => {
    const state = createInitialKalmanState();
    const predicted = kalmanPredict(state);

    expect(predicted.mean).toHaveLength(4);
    expect(predicted.confidence).toBe(state.confidence);
    expect(predicted.lastUpdated.getTime()).toBeGreaterThanOrEqual(state.lastUpdated.getTime());
  });

  it("updates the state with a mission observation", () => {
    const state = createInitialKalmanState();
    const updated = kalmanUpdate(state, {
      builder: 0.8,
      creator: 0.1,
      strategist: 0.05,
      catalyst: 0.05,
    });

    expect(updated.mean[0]).toBeGreaterThan(state.mean[0]);
    expect(updated.confidence).toBeGreaterThan(state.confidence);
    expect(updated.covariance).toHaveLength(4);
  });

  it("returns insights with primary and secondary profile", () => {
    const state = createKalmanStateFromQuiz({
      builder: 50,
      creator: 30,
      strategist: 10,
      catalyst: 10,
    });

    const insights = getKalmanInsights(state);
    expect(insights.primary).toBe("builder");
    expect(insights.secondary).toBe("creator");
    expect(insights.isHybrid).toBe(false);
  });

  it("detects hybrid profiles when close", () => {
    const state = createKalmanStateFromQuiz({
      builder: 30,
      creator: 28,
      strategist: 22,
      catalyst: 20,
    });

    const insights = getKalmanInsights(state);
    expect(insights.isHybrid).toBe(true);
    expect(insights.primaryPercentage - insights.secondaryPercentage).toBeLessThan(15);
  });

  it("builds a readable distribution from Kalman state", () => {
    const state = createKalmanStateFromQuiz({
      builder: 40,
      creator: 30,
      strategist: 20,
      catalyst: 10,
    });

    const distribution = buildProfileDistributionFromKalman(state);
    expect(distribution.builder).toBeCloseTo(0.4, 5);
    expect(distribution.creator).toBeCloseTo(0.3, 5);
    expect(distribution.strategist).toBeCloseTo(0.2, 5);
    expect(distribution.catalyst).toBeCloseTo(0.1, 5);
  });

  it("serializes and deserializes the state", () => {
    const state = createKalmanStateFromQuiz({
      builder: 45,
      creator: 25,
      strategist: 20,
      catalyst: 10,
    });

    const serialized = serializeKalmanState(state);
    const deserialized = deserializeKalmanState(serialized);

    expect(deserialized).not.toBeNull();
    expect(deserialized!.mean).toHaveLength(4);
    expect(deserialized!.confidence).toBe(state.confidence);
    expect(deserialized!.lastUpdated.getTime()).toBe(state.lastUpdated.getTime());
  });

  it("updates profile through mission-based Kalman refinement", () => {
    const state = createKalmanStateFromQuiz({
      builder: 40,
      creator: 30,
      strategist: 20,
      catalyst: 10,
    });

    const updated = updateProfileWithKalman(state, "CODE", 0.9);
    expect(updated.mean[0]).toBeGreaterThan(state.mean[0]);
    expect(updated.mean[1]).toBeLessThan(state.mean[1]);
  });

  it("returns a summary with evolution and volatility", () => {
    const state = createKalmanStateFromQuiz({
      builder: 60,
      creator: 20,
      strategist: 10,
      catalyst: 10,
    });

    const summary = getKalmanProfileSummary(state);
    expect(summary.primary).toBe("builder");
    expect(summary.confidenceLevel).toBe("Élevé");
    expect(["growing", "shifting"]).toContain(summary.evolution.direction);
    expect(typeof summary.evolution.volatility).toBe("number");
  });
});
