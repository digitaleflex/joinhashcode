"use client"

import Link from "next/link"
import { User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { SubmissionContent } from "./submission-content"
import { StatusBadge } from "./status-badge"

interface SubmissionUser {
  id: string
  name: string
  email: string
  level: number
}

interface SubmissionMission {
  title: string
  category: string
  xp: number
  submissionMethod: string
  deliverables: string[]
}

interface Submission {
  id: string
  status: string
  content: string | null
  projectDescription: string | null
  createdAt: string
  updatedAt: string
  qualityLevel: string | null
  xpAwarded: number | null
  adminFeedback: string | null
  revisionNotes: string | null
  revisionCount: number
  userFeedback: string | null
  userDifficulty: number | null
  userRating: number | null
  improvementSuggestions: string | null
  user: SubmissionUser
  mission: SubmissionMission
}

interface SubmissionsTableProps {
  submissions: Submission[]
  activeTab: "pending" | "history"
  processingId: string | null
  onReview: (submission: Submission) => void
}

export function SubmissionsTable({ submissions, activeTab, processingId, onReview }: SubmissionsTableProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Membre</TableHead>
            <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Mission</TableHead>
            <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Contenu</TableHead>
            {activeTab === "history" && (
              <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Décision</TableHead>
            )}
            <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground text-right">
              {activeTab === "pending" ? "Actions" : "Date"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((s) => (
            <TableRow key={s.id} className="border-white/5 hover:bg-white/5 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center border border-white/10">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <Link
                      href={`/admin/users/${s.user.id}`}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      {s.user.name}
                    </Link>
                    <p className="text-[10px] text-muted-foreground font-mono">LVL {s.user.level} · {s.user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{s.mission.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter bg-primary/5 text-primary border-primary/20 font-mono">
                      {s.mission.category}
                    </Badge>
                    <span className="text-[10px] text-[#B8FF3B] font-mono">+{s.mission.xp} XP</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <div className="space-y-1.5">
                  <SubmissionContent
                    content={s.content}
                    submissionMethod={s.mission.submissionMethod}
                  />
                  {s.projectDescription && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 italic">
                      &ldquo;{s.projectDescription}&rdquo;
                    </p>
                  )}
                  <p className="text-[9px] text-muted-foreground/60 font-mono">
                    Soumis le {new Date(s.createdAt).toLocaleDateString()} à {new Date(s.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </TableCell>
              {activeTab === "history" && (
                <TableCell>
                  <div className="space-y-1.5">
                    <StatusBadge status={s.status} />
                    {s.status === "APPROVED" && s.qualityLevel && s.qualityLevel !== "STANDARD" && (
                      <p className="text-[9px] font-mono text-primary/70">
                        {s.qualityLevel === "EXEMPLARY" ? "⭐ Exemplaire" : "✦ Très bon"}
                        {s.xpAwarded != null && ` · +${s.xpAwarded} XP`}
                      </p>
                    )}
                    {s.status === "APPROVED" && s.xpAwarded != null && s.qualityLevel === "STANDARD" && (
                      <p className="text-[9px] font-mono text-zinc-500">+{s.xpAwarded} XP</p>
                    )}
                    {s.adminFeedback && (
                      <p className="text-[10px] text-zinc-400 line-clamp-2 italic max-w-[200px]">
                        &ldquo;{s.adminFeedback}&rdquo;
                      </p>
                    )}
                  </div>
                </TableCell>
              )}
              <TableCell className="text-right">
                {activeTab === "pending" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-primary/20 text-primary hover:bg-primary/10 font-mono text-[9px] uppercase tracking-wider"
                    onClick={() => onReview(s)}
                    disabled={processingId === s.id}
                  >
                    Réviser
                  </Button>
                ) : (
                  <p className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">
                    {new Date(s.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
