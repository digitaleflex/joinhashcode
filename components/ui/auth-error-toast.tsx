"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

const ERROR_MESSAGES: Record<string, string> = {
  internal_server_error: "Une erreur interne est survenue lors de la connexion. Réessaie plus tard.",
  unauthorized: "Tu n'es pas autorisé à accéder à cette ressource.",
  configuration_error: "Le système d'authentification est mal configuré.",
  social_login_failed: "Échec de la connexion via le fournisseur social.",
}

function AuthErrorToastContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    if (error) {
      const message = ERROR_MESSAGES[error] || "Une erreur d'authentification est survenue."
      
      // We use a timeout to ensure sonner is ready and hasn't been blocked by the initial render
      const timer = setTimeout(() => {
        toast.error(message, {
          id: "auth-error", // Prevent duplicate toasts
          duration: 6000,
        })
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [error])

  return null
}

/**
 * Handles displaying toast notifications for authentication errors
 * passed via query parameters (e.g., /?error=internal_server_error).
 */
export function AuthErrorToast() {
  return (
    <Suspense fallback={null}>
      <AuthErrorToastContent />
    </Suspense>
  )
}
