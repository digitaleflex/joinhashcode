"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { UserRowActions } from "./UserRowActions"
import { Search, Loader2, Download } from "lucide-react"
import { CLASS_COLORS } from "@/lib/member-card-constants"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function UserManagementTable() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const handleExport = () => {
    window.open("/api/admin/users/export", "_blank")
  }

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        // @ts-ignore
        const { data } = await authClient.admin.listUsers({
          query: {
            limit: 100,
          }
        })
        if (data?.users) {
          setUsers(data.users)
        }
      } catch (error) {
        console.error("Failed to fetch users", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    (user.pseudo && user.pseudo.toLowerCase().includes(search.toLowerCase()))
  )

  const getColorForClass = (className: string | null) => {
    if (!className) return undefined
    return CLASS_COLORS[className.toLowerCase()]
  }

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gestion des Membres</h1>
          <p className="text-sm text-zinc-400 font-mono mt-1 uppercase tracking-wider">
            {users.length} membres enregistrés
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleExport}
            variant="outline"
            className="h-10 border-white/10 bg-zinc-900 text-white font-mono text-[10px] uppercase hover:bg-white/5"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Rechercher un membre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-zinc-900 border-white/5 text-white placeholder:text-zinc-600 h-10"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 py-4">Utilisateur</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 py-4">Rôle</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 py-4">Classe</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 py-4">Inscription</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 py-4">Statut</TableHead>
              <TableHead className="text-right text-[10px] uppercase tracking-wider font-bold text-zinc-500 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-zinc-500">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="font-mono text-[10px] uppercase tracking-wider">Chargement des membres...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                   <div className="flex flex-col items-center justify-center gap-2 text-zinc-500">
                    <span className="font-mono text-[10px] uppercase tracking-wider">Aucun membre trouvé</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const classColor = getColorForClass(user.class)
                return (
                  <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/users/${user.id}`} className="transition-opacity hover:opacity-80">
                          <Avatar className="h-9 w-9 border border-white/10 group-hover:border-primary/30 transition-colors">
                            <AvatarImage src={user.image} />
                            <AvatarFallback className="bg-zinc-900 text-zinc-400 text-[10px] font-bold">
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex flex-col">
                          <Link href={`/admin/users/${user.id}`} className="hover:underline">
                            <span className="text-sm font-bold text-white leading-none mb-1">
                              {user.name} 
                              {user.pseudo && <span className="text-zinc-500 ml-2 font-mono text-[10px] font-normal">@{user.pseudo}</span>}
                            </span>
                          </Link>
                          <span className="text-[10px] font-mono text-zinc-500">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        font-mono text-[10px] px-2 py-0 border-white/10
                        ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : 
                          user.role === 'MODERATOR' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                          'bg-white/5 text-zinc-400'}
                      `}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.class ? (
                        <span 
                          className="text-[10px] font-mono uppercase tracking-wider font-bold"
                          style={{ color: classColor }}
                        >
                          {user.class}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                          Non défini
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.banned ? (
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-mono text-[10px]">
                          BANNI
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-[10px]">
                          ACTIF
                        </Badge>
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
    </div>
  )
}
