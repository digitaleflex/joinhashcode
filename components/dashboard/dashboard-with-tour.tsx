"use client"

import { TourProvider } from "@/components/tour/tour-provider"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { DashboardShell } from "./dashboard-shell"
import type { UserProfile, DetailedMissionSubmission } from "@/lib/types"
import type { SquadData } from "./squad-journey"
import type { Activity } from "@/components/landing/activity-feed"
import type { Mission } from "@/lib/missions"

export function DashboardWithTour({
  user,
  quizResult,
  submissions,
  fullSubmissions,
  squad,
  memberRole,
  recommendedMissions,
  feedActivities,
  featureFlags,
  socialProof,
}: {
  user: UserProfile
  quizResult: { profileType?: string | null } | null
  submissions?: Record<string, string>
  fullSubmissions?: DetailedMissionSubmission[]
  squad?: SquadData | null
  memberRole?: string
  recommendedMissions?: Mission[]
  feedActivities?: Activity[]
  featureFlags?: Record<string, boolean>
  socialProof?: { activeMembers: number; userRank: number; weeklyCheckins: number; totalMembers: number }
}) {
  const tourEnabled = isFeatureEnabled("tour")

  return (
    <TourProvider userId={user.id} featureFlag={tourEnabled}>
      <DashboardShell
        user={user}
        quizResult={quizResult}
        submissions={submissions}
        fullSubmissions={fullSubmissions}
        squad={squad}
        memberRole={memberRole}
        recommendedMissions={recommendedMissions}
        feedActivities={feedActivities}
        featureFlags={featureFlags}
        socialProof={socialProof}
      />
    </TourProvider>
  )
}
