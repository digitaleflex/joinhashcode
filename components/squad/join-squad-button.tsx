"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogIn } from "lucide-react"
import { toast } from "sonner"

export function JoinSquadButton({ slug, name }: { slug: string; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleJoin() {
    setLoading(true)
    try {
      const res = await fetch("/api/squad/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || data.message || "Impossible de rejoindre l'escouade")
        return
      }
      toast.success(`Bienvenue dans ${name} !`)
      router.push("/squad")
      router.refresh()
    } catch {
      toast.error("Erreur réseau. Réessaie.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 h-9 rounded-xl text-xs font-mono font-bold uppercase tracking-widest bg-primary text-black hover:bg-primary/90 transition-all shadow-[0_0_10px_rgba(197,244,65,0.25)] hover:shadow-[0_0_18px_rgba(197,244,65,0.45)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 min-h-[44px]"
    >
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : <LogIn className="size-3.5" />}
      Rejoindre
    </button>
  )
}
