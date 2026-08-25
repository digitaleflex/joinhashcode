"use client"

import { useNextStep } from "nextstepjs"

const NOOP = {
  startNextStep: () => {},
  closeNextStep: () => {},
  currentStep: 0,
  currentTour: null,
  isNextStepVisible: false,
  setCurrentStep: () => {},
}

/**
 * Safe wrapper for useNextStep that returns no-ops when used
 * outside a NextStepProvider (e.g. in tests or pages without tour).
 */
export function useNextStepSafe() {
  try {
    return useNextStep()
  } catch {
    return NOOP
  }
}
