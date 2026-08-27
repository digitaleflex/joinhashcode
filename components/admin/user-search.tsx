"use client"

import { useState, useRef, useCallback } from "react"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Search, Mail, Badge, MapPin, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchUser {
  id: string
  name: string
  email: string
  pseudo: string | null
  class: string | null
  country: string | null
  createdAt: string
  currentStreak: number
}

interface UserSearchProps {
  onClose?: () => void
}

export function UserSearch({ onClose }: UserSearchProps) {
  const [results, setResults] = useState<SearchUser[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const searchUsers = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      return
    }

    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    try {
      const params = new URLSearchParams({ q, limit: "20", offset: "0" })
      const res = await fetch(`/api/admin/users/search?${params}`, { signal: abortRef.current.signal })
      if (res.ok) {
        const data = await res.json()
        setResults(data.users ?? [])
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSelect = (user: SearchUser) => {
    window.location.href = `/admin/users/${user.id}`
    onClose?.()
  }

  return (
    <Command
      onValueChange={searchUsers}
      value=""
    >
      <CommandInput placeholder="Rechercher un utilisateur (nom, pseudo, email, classe, pays)..." autoFocus />
      <CommandList>
        <CommandGroup>
          {loading ? (
            <CommandItem className={cn("flex items-center gap-2 text-zinc-500 py-3", "data-[disabled=true]:opacity-50")} disabled>
              <Search className="h-4 w-4 animate-spin" />
              Recherche en cours...
            </CommandItem>
          ) : results.length === 0 ? (
            <CommandEmpty>
              Tapez au moins 2 caractères pour rechercher
            </CommandEmpty>
          ) : (
            results.map((user) => (
              <CommandItem
                key={user.id}
                onSelect={() => handleSelect(user)}
                className="flex flex-col items-start gap-1.5 py-3 hover:bg-primary/5 data-[selected=true]:bg-primary/10"
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white truncate">{user.name}</span>
                      {user.pseudo && (
                        <span className="text-zinc-500 font-mono text-[10px]">@{user.pseudo}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      {user.class && (
                        <span className="flex items-center gap-1">
                          <Badge className="h-3 w-3" />
                          {user.class}
                        </span>
                      )}
                      {user.country && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {user.country}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-[10px] font-mono text-zinc-500">
                      {user.currentStreak > 0 ? `🔥 ${user.currentStreak}j` : "—"}
                    </span>
                    <ChevronRight className="h-4 w-4 text-zinc-600" />
                  </div>
                </div>
              </CommandItem>
            ))
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}