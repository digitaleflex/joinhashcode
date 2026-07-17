"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Monitor, Smartphone, Globe, Loader2, LogOut, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface SessionInfo {
  id: string
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  updatedAt: string | Date
}

export function ActiveSessions() {
    const [sessions, setSessions] = useState<SessionInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [revokingId, setRevokingId] = useState<string | null>(null)
    const { data: currentSession } = authClient.useSession()

    const fetchSessions = async () => {
        try {
            const { data, error } = await authClient.listSessions()
            if (error) throw error
            // Sort to put current session first, then by newest
            const sorted = (data || []).sort((a: SessionInfo, b: SessionInfo) => {
                if (a.id === currentSession?.session?.id) return -1
                if (b.id === currentSession?.session?.id) return 1
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            })
            setSessions(sorted)
        } catch (error: unknown) {
            console.error(error)
            toast.error("Erreur lors du chargement des sessions")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (currentSession) {
            fetchSessions()
        }
    }, [currentSession])

    const handleRevokeSession = async (token: string, id: string) => {
        setRevokingId(id)
        try {
            const { error } = await authClient.revokeSession({ token })
            if (error) throw error
            toast.success("Session déconnectée avec succès")
            setSessions(prev => prev.filter(s => s.id !== id))
        } catch (error: unknown) {
            toast.error("Erreur lors de la déconnexion de l'appareil")
        } finally {
            setRevokingId(null)
        }
    }

    const handleRevokeOtherSessions = async () => {
        if (!confirm("Déconnecter tous les autres appareils ?")) return
        setLoading(true)
        try {
            const { error } = await authClient.revokeOtherSessions()
            if (error) throw error
            toast.success("Tous les autres appareils ont été déconnectés")
            fetchSessions()
        } catch (error: unknown) {
            toast.error("Erreur lors de la déconnexion globale")
            setLoading(false)
        }
    }

    // Helper to guess device type from user agent
    const getDeviceInfo = (userAgent: string | null | undefined = "") => {
        const ua = (userAgent ?? "").toLowerCase()
        if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
            return { icon: Smartphone, label: "Mobile" }
        }
        return { icon: Monitor, label: "Ordinateur" }
    }

    // Helper to extract browser name
    const getBrowserName = (userAgent: string | null | undefined = "") => {
        const ua = (userAgent ?? "").toLowerCase()
        if (ua.includes("edg/")) return "Edge"
        if (ua.includes("chrome") && !ua.includes("edg/")) return "Chrome"
        if (ua.includes("safari") && !ua.includes("chrome")) return "Safari"
        if (ua.includes("firefox")) return "Firefox"
        return "Navigateur inconnu"
    }

    if (loading && sessions.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 animate-spin text-zinc-700" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Appareils connectés</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">Gère les appareils qui ont actuellement accès à ton compte.</p>
                </div>
                {sessions.length > 1 && (
                    <Button 
                        variant="outline"
                        onClick={handleRevokeOtherSessions} 
                        className="h-9 px-4 text-[10px] uppercase font-bold tracking-wider rounded-xl border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <ShieldAlert className="mr-2 size-3" />
                        Déconnecter les autres
                    </Button>
                )}
            </div>

            <div className="grid gap-3">
                {sessions.map((session) => {
                    const isCurrentSession = session.id === currentSession?.session?.id
                    const DeviceIcon = getDeviceInfo(session.userAgent).icon
                    const browser = getBrowserName(session.userAgent)
                    
                    return (
                        <div 
                            key={session.id} 
                            className={cn(
                                "group relative p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                                isCurrentSession 
                                    ? "bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(184,255,59,0.05)]" 
                                    : "bg-white/2 border-white/5 hover:bg-white/4"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-3 rounded-xl border",
                                    isCurrentSession ? "bg-black/60 border-primary/30 text-primary" : "bg-black/40 border-white/5 text-zinc-400"
                                )}>
                                    <DeviceIcon className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="text-[12px] font-bold text-zinc-200">
                                            {getDeviceInfo(session.userAgent).label} • {browser}
                                        </div>
                                        {isCurrentSession && (
                                            <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[8px] font-black uppercase tracking-wider border border-primary/30">
                                                Appareil actuel
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                                        <span className="flex items-center gap-1">
                                            <Globe className="size-3" />
                                            {session.ipAddress || "IP masquée"}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                        <span>
                                            Actif le {new Date(session.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {!isCurrentSession && (
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRevokeSession(session.token, session.id)}
                                    disabled={revokingId === session.id}
                                    className="h-8 text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full sm:w-auto"
                                >
                                    {revokingId === session.id ? (
                                        <Loader2 className="size-3.5 animate-spin" />
                                    ) : (
                                        <>
                                            <LogOut className="mr-2 size-3.5" />
                                            Déconnecter
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
