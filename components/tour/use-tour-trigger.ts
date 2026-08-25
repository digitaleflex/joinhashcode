"use client"

import { useEffect } from "react"
import { TOUR_NAMES, type TourName } from "./tour-config"
import { useNextStepSafe } from "./use-next-step-safe"

const STORAGE_PREFIX = "hc_tour_seen_"
const WELCOMED_PREFIX = "hc_welcomed_"

function hasSeenTour(userId: string, tourName: string): boolean {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${userId}_${tourName}`) === "1"
  } catch {
    return false
  }
}

export function markTourSeen(userId: string, tourName: string): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}_${tourName}`, "1")
  } catch {
    // ignore
  }
}

export function resetAllTours(userId: string): void {
  try {
    Object.values(TOUR_NAMES).forEach((name) => {
      localStorage.removeItem(`${STORAGE_PREFIX}${userId}_${name}`)
    })
  } catch {
    // ignore
  }
}

export function useTourTrigger(userId: string) {
  const { startNextStep } = useNextStepSafe()

  useEffect(() => {
    if (!userId) return

    // Si le WelcomeModal n'a pas encore été vu, ne pas déclencher le tour.
    // Le WelcomeModal lancera le tour après sa fermeture.
    try {
      const hasBeenWelcomed = localStorage.getItem(`${WELCOMED_PREFIX}${userId}`) === "1"
      if (!hasBeenWelcomed) return
    } catch {
      return
    }

    if (!hasSeenTour(userId, TOUR_NAMES.DASHBOARD)) {
      const timer = setTimeout(() => {
        markTourSeen(userId, TOUR_NAMES.DASHBOARD)
        startNextStep(TOUR_NAMES.DASHBOARD)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [userId, startNextStep])

  return {
    startTour: (tourName: TourName) => {
      markTourSeen(userId, tourName)
      startNextStep(tourName)
    },
    resetTours: () => resetAllTours(userId),
    hasSeenTour: (tourName: string) => hasSeenTour(userId, tourName),
  }
}
