"use client"

import { Analytics } from "@vercel/analytics/next"

export function AnalyticsConsent() {
  // Only load Vercel Analytics if we are actually on Vercel
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === undefined) {
    return null;
  }

  return (
    <Analytics
      beforeSend={(event) => {
        const consent = window.localStorage.getItem("hc_cookie_consent")
        return consent === "accepted" ? event : null
      }}
    />
  )
}
