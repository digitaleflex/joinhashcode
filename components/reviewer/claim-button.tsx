"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

/** Prend en charge une soumission (route `claim`, l'identifiant de l'URL est celui de la soumission). */
export function ClaimButton({ submissionId }: { submissionId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const claim = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/missions/${submissionId}/claim`, { method: "POST" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.message ?? "Impossible de prendre cette soumission en charge.")
        return
      }
      toast.success("Soumission prise en charge. À toi de la relire.")
      router.refresh()
    } catch {
      toast.error("Erreur réseau. Réessaie dans un instant.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={claim} disabled={loading} className="btn-primary-glow h-11 rounded-xl px-5">
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : "Prendre en charge cette soumission"}
    </Button>
  )
}
