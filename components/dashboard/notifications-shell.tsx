"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  Inbox, 
  Bookmark, 
  CheckSquare, 
  Search, 
  Trash2, 
  Check, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Star, 
  Users, 
  Zap, 
  Activity, 
  Mail,
  Loader2,
  Calendar,
  Filter,
  ArrowUpDown,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { UserTopBar } from "./user-topbar"
import { BottomNav } from "./bottom-nav"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

const iconMap: Record<string, any> = {
  MISSION_APPROVED: CheckCircle,
  LEVEL_UP: Star,
  DAILY_REMINDER: Info,
  SYSTEM: AlertTriangle,
  SQUAD_COHESION_LOW: Users,
  SQUAD_COHESION_CRITICAL: AlertTriangle,
  SQUAD_COHESION_MAX: Zap,
  SQUAD_MEMBER_CHECKIN: Activity,
  SQUAD_STREAK_3: Zap,
  SQUAD_STREAK_7: Zap,
  STREAK_MILESTONE: Star,
  STREAK_BROKEN: Info,
  SQUAD_INVITATION: Mail,
}

const typeLabels: Record<string, string> = {
  MISSION_APPROVED: "Missions",
  LEVEL_UP: "Progression",
  DAILY_REMINDER: "Rappels",
  SYSTEM: "Système",
  SQUAD_COHESION_LOW: "Escouades",
  SQUAD_COHESION_CRITICAL: "Alertes Escouade",
  SQUAD_COHESION_MAX: "Bonus Escouade",
  SQUAD_MEMBER_CHECKIN: "Activité Escouade",
  SQUAD_INVITATION: "Invitations",
}

export function NotificationsShell({
  user,
  squad,
  memberRole
}: {
  user: any
  squad: any
  memberRole?: string
}) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<"inbox" | "saved" | "done">("inbox")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Fetch des notifications avec filtres
  const { data, isLoading } = useQuery({
    queryKey: ["notifications-full", activeTab, typeFilter, searchQuery, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set("all", "true")
      params.set("tab", activeTab)
      if (typeFilter) params.set("type", typeFilter)
      if (searchQuery) params.set("search", searchQuery)
      
      const res = await fetch(`/api/user/notifications?${params.toString()}`)
      if (!res.ok) throw new Error("Erreur de chargement")
      return res.json()
    },
    refetchInterval: 45_000, // rafraîchir toutes les 45s
  })

  const notifications = useMemo(() => {
    let list = data?.notifications ?? []
    if (sortBy === "oldest") {
      return [...list].reverse()
    }
    return list
  }, [data?.notifications, sortBy])

  // Mutation pour modifier les états (lecture, sauvegarde, archivage)
  const updateStateMutation = useMutation({
    mutationFn: async (payload: { ids: string[]; isRead?: boolean; isSaved?: boolean; isArchived?: boolean; readAll?: boolean; archiveAll?: boolean }) => {
      const res = await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Erreur serveur")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notifications-full"] })
      setSelectedIds([])
    },
    onError: () => {
      toast.error("Échec de la mise à jour des notifications")
    }
  })

  // Invitation escouade handler
  const handleSquadInvitation = async (invitationId: string, action: 'accept' | 'reject', notificationId: string) => {
    setProcessingId(notificationId)
    try {
      if (action === 'accept') {
        const { error } = await authClient.organization.acceptInvitation({ invitationId })
        if (error) throw new Error(error.message || "Erreur lors de l'acceptation.")
        toast.success("Bienvenue dans l'escouade !")
      } else {
        await authClient.organization.rejectInvitation({ invitationId })
        toast.info("Invitation refusée.")
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notifications-full"] })
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue")
    } finally {
      setProcessingId(null)
    }
  }

  // Sélection globale
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(notifications.map((n: any) => n.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id))
    }
  }

  // Actions groupées
  const handleBulkRead = (isRead: boolean) => {
    if (selectedIds.length === 0) return
    updateStateMutation.mutate({ ids: selectedIds, isRead })
    toast.success(isRead ? "Notifications marquées comme lues" : "Notifications marquées comme non lues")
  }

  const handleBulkSave = (isSaved: boolean) => {
    if (selectedIds.length === 0) return
    updateStateMutation.mutate({ ids: selectedIds, isSaved })
    toast.success(isSaved ? "Sauvegardé dans vos favoris" : "Retiré des favoris")
  }

  const handleBulkArchive = (isArchived: boolean) => {
    if (selectedIds.length === 0) return
    updateStateMutation.mutate({ ids: selectedIds, isArchived })
    toast.success(isArchived ? "Archivé dans 'Terminé'" : "Restauré dans la boîte de réception")
  }

  const handleMarkAllRead = () => {
    updateStateMutation.mutate({ ids: [], readAll: true })
    toast.success("Toutes les notifications ont été marquées comme lues")
  }

  const handleArchiveAll = () => {
    updateStateMutation.mutate({ ids: [], archiveAll: true })
    toast.success("Toutes les notifications ont été archivées")
  }

  // Liste des types uniques présents pour le filtre
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>()
    data?.notifications?.forEach((n: any) => {
      if (n.type) types.add(n.type)
    })
    return Array.from(types)
  }, [data?.notifications])

  return (
    <SidebarProvider>
      <AppSidebar user={user} hasSquad={!!squad} />
      <SidebarInset className="bg-background relative bg-gradient-mesh overflow-hidden">
        <div className="scanline"></div>
        <UserTopBar user={user} squad={squad} memberRole={memberRole} />

        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-[-0.04em] text-white uppercase font-mono">Notifications</h1>
                <p className="text-zinc-500 text-sm mt-1">Gère les signaux de ton réseau d&apos;agent en temps réel.</p>
              </div>
              <div className="flex gap-2">
                {activeTab === "inbox" && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleMarkAllRead} 
                      className="border-white/5 bg-white/[0.02] hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-wider h-10"
                    >
                      <Check className="size-3.5 mr-2" />
                      Tout lire
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleArchiveAll} 
                      className="border-white/5 bg-white/[0.02] hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-wider h-10"
                    >
                      <CheckSquare className="size-3.5 mr-2" />
                      Tout archiver
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Layout principal (2 colonnes sur large, vertical sinon) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Sidebar gauche : Dossiers GitHub-style */}
              <div className="lg:col-span-1 space-y-4">
                <Card variant="premium" className="p-2 border-white/5">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => { setActiveTab("inbox"); setTypeFilter(null); }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        activeTab === "inbox" 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Inbox className="size-4" />
                        <span>Boîte de réception</span>
                      </div>
                      {data?.unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-black font-mono font-black text-[9px]">
                          {data.unreadCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => { setActiveTab("saved"); setTypeFilter(null); }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        activeTab === "saved" 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Bookmark className="size-4" />
                        <span>Sauvegardées</span>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab("done"); setTypeFilter(null); }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        activeTab === "done" 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckSquare className="size-4" />
                        <span>Archivées (Done)</span>
                      </div>
                    </button>
                  </div>
                </Card>

                {/* Filtres par Type */}
                {uniqueTypes.length > 0 && (
                  <Card variant="premium" className="p-4 border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                      <Filter className="size-3" />
                      <span>Filtrer par type</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => setTypeFilter(null)}
                        className={`text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${!typeFilter ? "text-primary bg-primary/5" : "text-zinc-400 hover:text-white"}`}
                      >
                        Tous les types
                      </button>
                      {uniqueTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setTypeFilter(type)}
                          className={`text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${typeFilter === type ? "text-primary bg-primary/5" : "text-zinc-400 hover:text-white"}`}
                        >
                          {typeLabels[type] || type}
                        </button>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Zone centrale : Liste des notifications */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* Barre de filtres de la liste */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl glass-card border-white/5">
                  
                  {/* Recherche */}
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                    <Input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-muted/40 border-white/5 pl-9 rounded-xl text-xs h-9 focus:ring-primary/40 focus:border-primary/20"
                    />
                  </div>

                  {/* Tri */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSortBy(prev => prev === "newest" ? "oldest" : "newest")}
                      className="text-xs text-zinc-400 hover:text-white h-9 rounded-xl"
                    >
                      <ArrowUpDown className="size-3.5 mr-2" />
                      Tri : {sortBy === "newest" ? "Récent" : "Ancien"}
                    </Button>
                  </div>
                </div>

                {/* Actions groupées contextualisées */}
                {selectedIds.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-2xl"
                  >
                    <span className="text-xs text-primary/80 font-mono pl-2 mr-2">{selectedIds.length} sélectionné(s) :</span>
                    
                    {activeTab === "inbox" && (
                      <>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleBulkRead(true)}
                          className="h-8 text-[10px] font-bold uppercase hover:bg-white/5 rounded-lg text-zinc-300 hover:text-white"
                        >
                          <Check className="size-3 mr-1.5" />
                          Marquer lu
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleBulkArchive(true)}
                          className="h-8 text-[10px] font-bold uppercase hover:bg-white/5 rounded-lg text-zinc-300 hover:text-white"
                        >
                          <CheckSquare className="size-3 mr-1.5" />
                          Archiver
                        </Button>
                      </>
                    )}

                    {activeTab === "saved" && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleBulkSave(false)}
                        className="h-8 text-[10px] font-bold uppercase hover:bg-white/5 rounded-lg text-zinc-300 hover:text-white"
                      >
                        <Trash2 className="size-3 mr-1.5" />
                        Retirer des favoris
                      </Button>
                    )}

                    {activeTab === "done" && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleBulkArchive(false)}
                        className="h-8 text-[10px] font-bold uppercase hover:bg-white/5 rounded-lg text-zinc-300 hover:text-white"
                      >
                        <RotateCcw className="size-3 mr-1.5" />
                        Restaurer
                      </Button>
                    )}

                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleBulkSave(true)}
                      className="h-8 text-[10px] font-bold uppercase hover:bg-white/5 rounded-lg text-zinc-300 hover:text-white"
                    >
                      <Bookmark className="size-3 mr-1.5" />
                      Sauvegarder
                    </Button>
                  </motion.div>
                )}

                {/* Liste */}
                <Card variant="premium" className="border-white/5 overflow-hidden">
                  
                  {/* En-tête de la liste */}
                  <div className="flex items-center px-4 py-3 bg-zinc-900/50 border-b border-white/5">
                    <input
                      type="checkbox"
                      checked={notifications.length > 0 && selectedIds.length === notifications.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-white/10 text-primary focus:ring-primary/40 size-3.5 bg-zinc-850"
                    />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold ml-4">
                      {notifications.length} Notification{notifications.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Corps de la liste */}
                  <div className="divide-y divide-white/5">
                    {isLoading ? (
                      <div className="p-12 text-center text-sm text-zinc-500 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="size-8 animate-spin text-primary" />
                        <span className="font-mono text-xs uppercase tracking-wider">Synchronisation des signaux...</span>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-16 text-center text-sm text-zinc-500 flex flex-col items-center justify-center gap-4">
                        <CheckCircle2 className="size-10 text-zinc-700" />
                        <div>
                          <p className="font-bold text-white text-base">Aucun signal trouvé.</p>
                          <p className="text-xs text-zinc-500 mt-1">Tout est propre pour le moment dans cette boîte.</p>
                        </div>
                      </div>
                    ) : (
                      <AnimatePresence initial={false}>
                        {notifications.map((notif: any) => {
                          const Icon = iconMap[notif.type] || Info
                          const isInvitation = notif.type === "SQUAD_INVITATION"
                          const invitationId = notif.link?.split("id=")[1]
                          const isProcessing = processingId === notif.id
                          const isSelected = selectedIds.includes(notif.id)

                          return (
                            <motion.div
                              key={notif.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className={`flex items-start gap-4 p-4 hover:bg-white/[0.02] transition-colors relative group/row ${!notif.isRead ? "bg-primary/[0.01]" : ""}`}
                            >
                              
                              {/* Checkbox */}
                              <div className="pt-1">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => handleSelectOne(notif.id, e.target.checked)}
                                  className="rounded border-white/10 text-primary focus:ring-primary/40 size-3.5 bg-zinc-850"
                                />
                              </div>

                              {/* Indicateur d'état non lu (point bleu) */}
                              <div className="pt-2">
                                <div className={`size-2 rounded-full shrink-0 transition-all ${notif.isRead ? "bg-transparent" : "bg-primary shadow-[0_0_8px_rgba(197,244,65,0.8)]"}`} />
                              </div>

                              {/* Icône du type */}
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                                notif.isRead 
                                  ? "bg-zinc-900 border-white/5 text-zinc-500" 
                                  : "bg-primary/10 border-primary/20 text-primary"
                              }`}>
                                <Icon className="w-4.5 h-4.5" />
                              </div>

                              {/* Contenu principal */}
                              <div className="flex-1 space-y-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                  <h4 
                                    className={`text-sm font-bold tracking-tight transition-colors ${
                                      notif.isRead 
                                        ? "text-zinc-400 group-hover/row:text-white" 
                                        : "text-white"
                                    }`}
                                  >
                                    {notif.link ? (
                                      <a href={notif.link} className="hover:underline flex items-center gap-1">
                                        {notif.title}
                                      </a>
                                    ) : (
                                      notif.title
                                    )}
                                  </h4>
                                  <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap shrink-0 flex items-center gap-1.5">
                                    <Calendar className="size-3" />
                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">{notif.message}</p>

                                {/* Gérer les invitations d'escouades spécifiquement */}
                                {isInvitation && invitationId && (
                                  <div className="flex items-center gap-2 mt-3 w-full max-w-xs">
                                    <Button
                                      size="sm"
                                      disabled={isProcessing}
                                      onClick={() => handleSquadInvitation(invitationId, 'accept', notif.id)}
                                      className="h-8 px-4 bg-primary/20 hover:bg-primary text-primary hover:text-black text-[10px] font-black uppercase rounded-xl transition-all flex-1"
                                    >
                                      {isProcessing ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5 mr-1.5" />}
                                      Accepter
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      disabled={isProcessing}
                                      onClick={() => handleSquadInvitation(invitationId, 'reject', notif.id)}
                                      className="h-8 px-4 hover:bg-destructive/20 text-muted-foreground hover:text-destructive text-[10px] font-bold uppercase rounded-xl transition-all"
                                    >
                                      Refuser
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {/* Hover Actions (GitHub-style actions rapides à droite) */}
                              <div className="opacity-0 group-hover/row:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-1 z-20">
                                
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  title={notif.isRead ? "Marquer comme non lu" : "Marquer comme lu"}
                                  onClick={() => updateStateMutation.mutate({ ids: [notif.id], isRead: !notif.isRead })}
                                  className="h-8 w-8 text-zinc-400 hover:text-white rounded-lg"
                                >
                                  <Check className={`size-4 ${notif.isRead ? "text-zinc-650" : "text-primary"}`} />
                                </Button>

                                <Button
                                  size="icon"
                                  variant="ghost"
                                  title={notif.isSaved ? "Retirer des favoris" : "Sauvegarder"}
                                  onClick={() => updateStateMutation.mutate({ ids: [notif.id], isSaved: !notif.isSaved })}
                                  className="h-8 w-8 text-zinc-400 hover:text-white rounded-lg"
                                >
                                  <Bookmark className={`size-4 ${notif.isSaved ? "fill-primary text-primary" : ""}`} />
                                </Button>

                                <Button
                                  size="icon"
                                  variant="ghost"
                                  title={notif.isArchived ? "Restaurer dans l'inbox" : "Archiver (Done)"}
                                  onClick={() => updateStateMutation.mutate({ ids: [notif.id], isArchived: !notif.isArchived })}
                                  className="h-8 w-8 text-zinc-400 hover:text-white rounded-lg"
                                >
                                  {notif.isArchived ? <RotateCcw className="size-4 text-zinc-400" /> : <CheckSquare className="size-4 text-zinc-400 hover:text-green-400" />}
                                </Button>

                              </div>

                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    )}
                  </div>

                </Card>

              </div>

            </div>

          </div>
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
