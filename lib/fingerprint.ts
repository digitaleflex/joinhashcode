"use client"

import { useEffect, useState } from "react"
import FingerprintJS from "@fingerprintjs/fingerprintjs"

let cachedFp: string | null = null
let loadPromise: Promise<string> | null = null

async function getVisitorId(): Promise<string> {
  if (cachedFp) return cachedFp
  if (!loadPromise) {
    loadPromise = FingerprintJS.load().then((fp) => fp.get().then((r) => r.visitorId))
  }
  cachedFp = await loadPromise
  return cachedFp
}

export function useFingerprint() {
  const [visitorId, setVisitorId] = useState<string | null>(null)

  useEffect(() => {
    getVisitorId().then(setVisitorId).catch(() => {})
  }, [])

  return visitorId
}

export async function getFingerprint(): Promise<string> {
  return getVisitorId()
}
