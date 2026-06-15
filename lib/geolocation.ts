"use client"

import { useState, useCallback } from "react"

export interface GeolocationData {
  latitude: number
  longitude: number
  accuracy: number
}

export function useGeolocation() {
  const [data, setData] = useState<GeolocationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const capture = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocalisation non supportée")
      return
    }

    const consent = localStorage.getItem("hc_cookie_consent")
    if (consent !== "accepted") {
      setError("Consentement requis")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setData({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        })
        setLoading(false)
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Localisation refusée par l'utilisateur")
            break
          case err.POSITION_UNAVAILABLE:
            setError("Position indisponible")
            break
          case err.TIMEOUT:
            setError("Délai de localisation dépassé")
            break
          default:
            setError("Erreur de localisation")
        }
        setLoading(false)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  return { data, error, loading, capture }
}

export function getConsentStatus(): "accepted" | "declined" | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("hc_cookie_consent") as "accepted" | "declined" | null
}

export function hasLocationConsent(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("hc_gps_consent") === "accepted"
}

export function getGpsConsentStatus(): "accepted" | "declined" | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("hc_gps_consent") as "accepted" | "declined" | null
}
