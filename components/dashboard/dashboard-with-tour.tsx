"use client"

import { TourProvider } from "@/components/tour/tour-provider"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { DashboardShell } from "./dashboard-shell"
import type { UserProfile, DetailedMissionSubmission } from "@/lib/types"
import type { Activity } from "@/components/landing/activity-feed"
import type { Mission } from "@/lib/missions"
import type { FirstAction } from "@/lib/first-action"

export function DashboardWithTour({
  user,
  quizResult,
  submissions,
  fullSubmissions,
  recommendedMissions,
  feedActivities,
  featureFlags,
  firstAction,
  firstActionStatus,
}: {
  user: UserProfile
  quizResult: { profileType?: string | null } | null
  submissions?: Record<string, string>
  fullSubmissions?: DetailedMissionSubmission[]
  recommendedMissions?: Mission[]
  feedActivities?: Activity[]
  featureFlags?: Record<string, boolean>
  firstAction?: FirstAction
  firstActionStatus?: "not_started" | "started" | "completed"
}) {
  const tourEnabled = isFeatureEnabled("tour")

  return (
    <TourProvider userId={user.id} featureFlag={tourEnabled}>
      <DashboardShell
        user={user}
        quizResult={quizResult}
        submissions={submissions}
        fullSubmissions={fullSubmissions}
        recommendedMissions={recommendedMissions}
        feedActivities={feedActivities}
        featureFlags={featureFlags}
        firstAction={firstAction}
        firstActionStatus={firstActionStatus}
      />
    </TourProvider>
  )
}
