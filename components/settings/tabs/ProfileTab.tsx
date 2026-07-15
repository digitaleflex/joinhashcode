"use client"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, Camera, User, AtSign, Languages, Globe, RefreshCw, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { CountrySelector } from "@/components/onboarding/country-selector"

interface ProfileTabProps {
  userData: any
  updateData: (next: any) => void
}

function HudCorners({ className }: { className?: string }) {
  return (
    <>
      <div className={cn("absolute top-3 left-3 w-3 h-3 border-t border-l pointer-events-none", className)} aria-hidden="true" />
      <div className={cn("absolute top-3 right-3 w-3 h-3 border-t border-r pointer-events-none", className)} aria-hidden="true" />
      <div className={cn("absolute bottom-3 left-3 w-3 h-3 border-b border-l pointer-events-none", className)} aria-hidden="true" />
      <div className={cn("absolute bottom-3 right-3 w-3 h-3 border-b border-r pointer-events-none", className)} aria-hidden="true" />
    </>
  )
}

export function ProfileTab({ userData, updateData }: ProfileTabProps) {
  const router = useRouter()
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [quizStatus, setQuizStatus] = useState<{
    canRetake: boolean
    isNewAccount: boolean
    cooldownDaysRemaining: number
    lastQuizDate: string | null
    nextAvailableDate: string | null
  } | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(true)

  useEffect(() => {
    fetch("/api/user/quiz-status")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de récupération")
        return res.json()
      })
      .then((data) => {
        setQuizStatus(data)
        setLoadingStatus(false)
      })
      .catch((err) => {
        console.error(err)
        setLoadingStatus(false)
      })
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input so same file can be re-selected after an error
    e.target.value = ""
    setUploadingAvatar(true)
    const formData = new FormData()
    formData.append("file", file)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)
    try {
      const res = await fetch("/api/user/avatar", { method: "POST", body: formData, signal: controller.signal })
      if (!res.ok) throw new Error(await res.text())
      const { url } = await res.json()
      updateData({ ...userData, image: url })
      toast.success("Avatar mis à jour !")
      router.refresh()
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast.error("Upload trop long. Vérifie ta connexion et réessaie.")
      } else {
        toast.error(error.message || "Erreur lors de l'upload")
      }
    } finally {
      clearTimeout(timeout)
      setUploadingAvatar(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-white/5 pb-12">
        {/* Avatar dock */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-950/40 border border-emerald-500/20 rounded-[2.5rem] relative overflow-hidden group/avatar-dock min-h-70">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-size-[16px_16px] opacity-40 pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-x-0 w-full animate-laser-sweep pointer-events-none" style={{ '--laser-color': '#10B981' } as React.CSSProperties} aria-hidden="true" />
          <HudCorners className="border-emerald-500/30" />

          <div className="relative group/avatar shrink-0 my-4">
            <div className="size-32 md:size-40 bg-zinc-900 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center relative overflow-hidden group-hover/avatar:border-emerald-500/60 transition-all duration-700 cyber-notch">
              {uploadingAvatar ? (
                <Loader2 className="size-10 animate-spin text-emerald-400" />
              ) : userData?.image ? (
                <Image src={userData.image} alt="Avatar" width={160} height={160} className="w-full h-full object-cover" />
              ) : (

                <div className="w-full h-full flex items-center justify-center text-5xl font-black text-emerald-500/10 uppercase">
                  {userData?.name?.charAt(0)}
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/png, image/jpeg, image/webp" />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all disabled:opacity-50 z-20 cursor-pointer"
              aria-label="Changer l'avatar"
            >
              <Camera className="size-4" />
            </button>
          </div>
        </div>

        {/* Profile fields */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <User className="size-3.5 text-emerald-500" /> Nom complet
              </label>
              <Input
                value={userData?.name || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ ...userData, name: e.target.value })}
                className="input-premium h-14 rounded-2xl text-base px-5 font-medium focus:border-emerald-500/60"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <AtSign className="size-3.5 text-emerald-500" /> Nom d'utilisateur
              </label>
              <Input
                value={userData?.pseudo || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ ...userData, pseudo: e.target.value })}
                className="input-premium h-14 rounded-2xl text-base px-5 font-medium font-mono focus:border-emerald-500/60"
                placeholder="votre_pseudo"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400">Présentation / Bio</label>
            <textarea
              value={userData?.bio || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateData({ ...userData, bio: e.target.value })}
              className="w-full input-premium min-h-30 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-emerald-500/60 resize-none text-white leading-relaxed font-light italic"
              placeholder="Présente-toi en quelques mots..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <Languages className="size-3.5 text-emerald-500" /> Langue d'affichage
          </label>
          <Select
            value={userData?.language || "fr"}
            onValueChange={(val: string) => updateData({ ...userData, language: val })}
          >
            <SelectTrigger className="input-premium h-14 rounded-2xl text-base px-5 font-bold text-white cyber-notch">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français (FR)</SelectItem>
              <SelectItem value="en">English (EN)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <Globe className="size-3.5 text-emerald-500" /> Pays de résidence
          </label>
          <CountrySelector
            value={userData?.country || ""}
            onChange={(val: string) => updateData({ ...userData, country: val })}
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <Globe className="size-3.5 text-emerald-500" /> Ville de résidence
          </label>
          <Input
            value={userData?.city || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ ...userData, city: e.target.value })}
            className="input-premium h-14 rounded-2xl text-base px-5 font-medium focus:border-emerald-500/60"
            placeholder="Ex: Paris"
          />
        </div>
      </div>

      {/* Section Visibilité recruteur */}
      <div className="border-t border-white/5 pt-12 space-y-6">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2 font-mono">
            <Eye className="size-4 text-emerald-500" /> Visibilité recruteur
          </h3>
          <p className="text-zinc-500 text-xs font-light mt-1">
            Apparais dans l&apos;annuaire public des talents HASHCODE — visible par les recruteurs sans inscription.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-950/40 border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              {userData?.talentVisible ? (
                <Eye className="size-5 text-emerald-500" />
              ) : (
                <EyeOff className="size-5 text-zinc-500" />
              )}
              <div>
                <p className="text-sm font-medium text-white">
                  {userData?.talentVisible ? "Visible dans l'annuaire" : "Masqué de l'annuaire"}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {userData?.talentVisible
                    ? "Les recruteurs peuvent découvrir ton profil"
                    : "Ton profil n'apparaît pas dans les recherches"}
                </p>
              </div>
            </div>
            <button
              onClick={() => updateData({ ...userData, talentVisible: !userData?.talentVisible })}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                userData?.talentVisible ? "bg-emerald-500" : "bg-zinc-700"
              }`}
              role="switch"
              aria-checked={userData?.talentVisible ?? true}
            >
              <span
                className={`pointer-events-none inline-block size-6 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                  userData?.talentVisible ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section Recalibrage de profil */}
      <div className="border-t border-white/5 pt-12 space-y-6">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2 font-mono">
            <RefreshCw className="size-4 text-emerald-500" /> Recalibrage de profil
          </h3>
          <p className="text-zinc-500 text-xs font-light mt-1">
            Repassez le quiz de diagnostic pour recalibrer vos scores comportementaux de départ.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-950/40 border border-white/5 relative overflow-hidden">
          <HudCorners className="border-white/10" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />

          {loadingStatus ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="size-6 animate-spin text-emerald-500" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-xl">
                {quizStatus?.canRetake ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      ÉLIGIBLE AU RECALIBRAGE
                    </span>
                    <p className="text-xs text-zinc-400 leading-relaxed font-light">
                      {quizStatus.isNewAccount
                        ? "Période de grâce de 24h active. Vous pouvez repasser le quiz immédiatement si vous pensez vous être trompé dans vos réponses."
                        : "Le délai de carence de 14 jours est écoulé. Vous pouvez effectuer un nouveau recalibrage manuel pour ajuster vos profils de départ."}
                    </p>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-500">
                      RECALIBRAGE VERROUILLÉ
                    </span>
                    <p className="text-xs text-zinc-400 leading-relaxed font-light">
                      Vous avez déjà passé le quiz de diagnostic. Pour stabiliser votre intégration d'escouade et privilégier l'évolution par l'action, vous devez attendre le délai de 14 jours entre chaque quiz.
                    </p>
                    {quizStatus?.nextAvailableDate && (
                      <p className="text-[10px] font-mono text-zinc-500">
                        Prochain recalibrage disponible le :{" "}
                        <span className="text-zinc-300">
                          {new Date(quizStatus.nextAvailableDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>{" "}
                        (dans {quizStatus.cooldownDaysRemaining} jour{quizStatus.cooldownDaysRemaining > 1 ? "s" : ""})
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="shrink-0 flex items-center">
                {quizStatus?.canRetake ? (
                  <button
                    onClick={() => router.push("/quiz")}
                    className="relative px-6 py-3 rounded-2xl bg-emerald-500 text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] cursor-pointer"
                  >
                    Repasser le quiz
                  </button>
                ) : (
                  <button
                    disabled
                    className="relative px-6 py-3 rounded-2xl bg-zinc-800/50 text-zinc-500 font-mono text-xs font-bold uppercase tracking-wider cursor-not-allowed border border-white/5"
                  >
                    Verrouillé ({quizStatus?.cooldownDaysRemaining}j)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
