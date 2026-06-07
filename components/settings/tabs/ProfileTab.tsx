"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { User, AtSign, Languages, Globe, Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CountrySelector } from "@/components/onboarding/country-selector"
import { cn } from "@/lib/utils"

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
                <Image src={userData.image} alt="Avatar" fill className="object-cover" sizes="(max-width: 768px) 128px, 160px" />
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
                onChange={e => updateData({ ...userData, name: e.target.value })}
                className="input-premium h-14 rounded-2xl text-base px-5 font-medium focus:border-emerald-500/60"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <AtSign className="size-3.5 text-emerald-500" /> Nom d'utilisateur
              </label>
              <Input
                value={userData?.pseudo || ""}
                onChange={e => updateData({ ...userData, pseudo: e.target.value })}
                className="input-premium h-14 rounded-2xl text-base px-5 font-medium font-mono focus:border-emerald-500/60"
                placeholder="votre_pseudo"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400">Présentation / Bio</label>
            <textarea
              value={userData?.bio || ""}
              onChange={e => updateData({ ...userData, bio: e.target.value })}
              className="w-full input-premium min-h-30 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-emerald-500/60 resize-none text-white leading-relaxed font-light italic"
              placeholder="Présente-toi en quelques mots..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <Languages className="size-3.5 text-emerald-500" /> Langue d'affichage
          </label>
          <Select
            value={userData?.language || "fr"}
            onValueChange={val => updateData({ ...userData, language: val })}
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
            onChange={val => updateData({ ...userData, country: val })}
          />
        </div>
      </div>
    </div>
  )
}
