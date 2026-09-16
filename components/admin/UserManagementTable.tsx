"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserRowActions } from "./UserRowActions"
import { Search, Loader2, Download, ChevronLeft, ChevronRight, Users } from "lucide-react"
import { CLASS_COLORS, type ProfileType } from "@/lib/member-card-constants"
import Link from "next/link"

const ROLES = ["ALL", "ADMIN", "MODERATOR", "MEMBER"]
const STATUSES = ["ALL", "ACTIVE", "BANNED"]

interface User {
  id: string
  name: string
  email: string
  image: string | null
  pseudo: string | null
  role: string
  class: string | null
  level: number
  experience: number
  banned: boolean | null
  createdAt: string
}

export function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 25

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [loading, setLoading] = useState(true)

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
  }, [search])

  useEffect(() => { setPage(1) }, [roleFilter, statusFilter])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: debouncedSearch,
        role: roleFilter,
        status: statusFilter,
      })
      const res = await fetch(`/api/admin/users?${params}`)
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users ?? [])
        setTotal(data.total ?? 0)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, roleFilter, statusFilter])

  useEffect(() => {
    fetchUsers()
  }, [page, debouncedSearch, roleFilter, statusFilter])

  const totalPages = Math.ceil(total / limit)

  const getColorForClass = (cls: string | null) => {
    if (!cls) return undefined
    return CLASS_COLORS[cls.toLowerCase() as ProfileType]
  }

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gestion des Membres</h1>
          <p className="text-sm text-zinc-400 font-mono mt-1 uppercase tracking-wider">
            {total} membres · page {page}/{totalPages || 1}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={() => window.open("/api/admin/users/export", "_blank")}
            variant="outline"
            className="h-10 border-white/10 bg-zinc-900 text-white font-mono text-xs uppercase hover:bg-white/5"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Nom, email, pseudo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-zinc-900 border-white/5 text-white placeholder:text-zinc-600 h-10"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-1">
          <span className="text-3xs font-mono text-zinc-600 uppercase mr-2">Rôle</span>
          {ROLES.map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                roleFilter === r
                  ? "bg-primary text-primary-foreground"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-3xs font-mono text-zinc-600 uppercase mr-2">Statut</span>
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/5 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider font-bold text-zinc-500 py-4">Utilisateur</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-bold text-zinc-500 py-4">Rôle</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-bold text-zinc-500 py-4">Classe</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-bold text-zinc-500 py-4">Niv. / XP</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-bold text-zinc-500 py-4">Inscription</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-bold text-zinc-500 py-4">Statut</TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wider font-bold text-zinc-500 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-zinc-500">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="font-mono text-xs uppercase tracking-wider">Chargement...</span>
                  </div>
                </TableCell>
              </TableRow>
             ) : users.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={8} className="h-64 text-center">
                   <EmptyState
                     icon={Users}
                     title="Aucun membre trouvé"
                     className="border-0 bg-transparent p-0 inline-flex"
                   />
                 </TableCell>
               </TableRow>
             ) : (
              users.map(user => {
                const classColor = getColorForClass(user.class)
                return (
                  <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/users/${user.id}`} className="transition-opacity hover:opacity-80">
                          <Avatar className="h-9 w-9 border border-white/10 group-hover:border-primary/30 transition-colors">
                            <AvatarImage src={user.image ?? ""} />
                            <AvatarFallback className="bg-zinc-900 text-zinc-400 text-xs font-bold">
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex flex-col">
                          <Link href={`/admin/users/${user.id}`} className="hover:underline">
                            <span className="text-sm font-bold text-white leading-none mb-1">
                              {user.name}
                              {user.pseudo && (
                                <span className="text-zinc-500 ml-2 font-mono text-xs font-normal">@{user.pseudo}</span>
                              )}
                            </span>
                          </Link>
                          <span className="text-xs font-mono text-zinc-500">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-mono text-xs px-2 py-0 border-white/10 ${
                        user.role === "ADMIN" ? "bg-primary/10 text-primary border-primary/20" :
                        user.role === "MODERATOR" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-white/5 text-zinc-400"
                      }`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.class ? (
                        <span className="text-xs font-mono uppercase tracking-wider font-bold" style={{ color: classColor }}>
                          {user.class}
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-zinc-600 uppercase">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm-plus font-bold text-white font-mono">LVL {user.level}</span>
                        <span className="text-3xs text-zinc-500 font-mono">{user.experience.toLocaleString()} XP</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-mono text-zinc-500">
                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.banned ? (
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-mono text-xs">BANNI</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-xs">ACTIF</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <UserRowActions user={user} />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-mono">
            {(page - 1) * limit + 1}–{Math.min(page * limit, total)} sur {total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 border-white/10"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-mono text-muted-foreground">{page} / {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 border-white/10"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
