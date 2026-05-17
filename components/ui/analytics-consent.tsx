"use client"

import { Analytics } from "@vercel/analytics/next"

export function AnalyticsConsent() {
  return (
    <Analytics
      beforeSend={(event) => {
        const consent = window.localStorage.getItem("hc_cookie_consent")
        return consent === "accepted" ? event : null
      }}
    />
  )
}
