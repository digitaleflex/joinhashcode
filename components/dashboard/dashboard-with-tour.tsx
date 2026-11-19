"use client"

import { TourProvider } from "@/components/tour/tour-provider"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { DashboardShell } from "./dashboard-shell"
import type { UserProfile, DetailedMissionSubmission } from "@/lib/types"
import type { Mission } from "@/lib/missions"
import type { FirstAction } from "@/lib/first-action"

export function DashboardWithTour({
  user,
  submissions,
  fullSubmissions,
  recommendedMissions,
  featureFlags,
  firstAction,
  firstActionStatus,
}: {
  user: UserProfile
  submissions?: Record<string, string>
  fullSubmissions?: DetailedMissionSubmission[]
  recommendedMissions?: Mission[]
  featureFlags?: Record<string, boolean>
  firstAction?: FirstAction
  firstActionStatus?: "not_started" | "started" | "completed"
}) {
  const tourEnabled = isFeatureEnabled("tour")

  return (
    <TourProvider userId={user.id} featureFlag={tourEnabled}>
      <DashboardShell
        user={user}
        submissions={submissions}
        fullSubmissions={fullSubmissions}
        recommendedMissions={recommendedMissions}
        featureFlags={featureFlags}
        firstAction={firstAction}
        firstActionStatus={firstActionStatus}
      />
    </TourProvider>
  )
}
