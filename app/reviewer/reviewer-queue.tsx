"use client"

import {
  ClipboardCheck,
  Clock,
  FileText,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Submission {
  id: string
  mission: {
    id: string
    title: string
    category: string
    xp: number
    missionLevel: string | null
    targetProfiles: string[]
  }
  user: {
    id: string
    name: string
    pseudo: string | null
    image: string | null
    level: number
  }
  createdAt: string
}

export function ReviewerQueue({ submissions }: { submissions: Submission[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-2">
            <ClipboardCheck className="size-6 text-primary" />
            File d&apos;évaluation
          </h1>
          <p className="text-sm text-zinc-500 font-mono mt-1">
            {submissions.length} soumission{submissions.length > 1 ? "s" : ""} en attente
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card className="border-dashed border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ClipboardCheck className="size-12 text-zinc-700 mb-4" />
            <p className="text-zinc-500 font-mono text-sm">Aucune soumission en attente</p>
            <p className="text-zinc-700 text-xs font-mono mt-1">Reviens plus tard</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submissions.map((sub) => (
            <Link key={sub.id} href={`/missions/${sub.mission.id}/review`}>
              <Card className="h-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-primary/30 transition-all group cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8 rounded-lg border border-white/10">
                        <AvatarImage src={sub.user.image || ""} alt={sub.user.name} />
                        <AvatarFallback className="rounded-lg bg-zinc-800 text-xs">
                          {sub.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{sub.user.name}</p>
                        <p className="text-xs font-mono text-zinc-500">
                           LV.{sub.user.level ?? 1} · {sub.user.pseudo && `@${sub.user.pseudo}`}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono border-zinc-700 text-zinc-400">
                      +{sub.mission.xp} XP
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {sub.mission.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-mono text-zinc-600">
                      <span className="flex items-center gap-1">
                        <FileText className="size-3" />
                        {sub.mission.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {new Date(sub.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge className="text-3xs font-mono bg-amber-500/10 text-amber-400 border-amber-500/20">
                      En attente
                    </Badge>
                    <ChevronRight className="size-4 text-zinc-600 group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
