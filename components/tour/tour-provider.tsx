"use client"

import { NextStepProvider, NextStep } from "nextstepjs"
import { getAllTours } from "./tour-config"
import { useTourTrigger } from "./use-tour-trigger"
import { TourCard } from "./tour-card"
import { useIsMobile } from "@/hooks/use-mobile"

export function TourProvider({
  children,
  userId,
  featureFlag = true,
}: {
  children: React.ReactNode
  userId: string
  featureFlag?: boolean
}) {
  const isMobile = useIsMobile()

  // Side-effect: auto-trigger dashboard tour on first visit
  useTourTrigger(userId)

  if (!featureFlag) {
    return <>{children}</>
  }

  return (
    <NextStepProvider>
      <NextStep
        steps={getAllTours(isMobile)}
        cardComponent={TourCard}
        shadowRgb="197,244,65"
        shadowOpacity="0.3"
        displayArrow
        clickThroughOverlay
        scrollToTop={false}
        disableConsoleLogs
      >
        {children}
      </NextStep>
    </NextStepProvider>
  )
}
