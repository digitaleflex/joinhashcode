'use client'

import { motion } from 'framer-motion'
import { type AnalysisResult } from '@/lib/analysis'
import { CLASS_COLORS as PROFILE_COLORS } from '@/lib/member-card-constants'
import { getProfileContent, type ProfileType } from '@/lib/profile-content'
import { type UserData } from './result-page'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const PROFILE_LABELS: Record<ProfileType, string> = {
  builder: 'Builder',
  creator: 'Créateur',
  strategist: 'Stratège',
  catalyst: 'Catalyseur',
}

interface Props {
  analysis: AnalysisResult
  user: UserData
}

export function ResultScores({ analysis, user }: Props) {
  const primary = analysis.primary as ProfileType
  const color = PROFILE_COLORS[primary]
  const content = getProfileContent(primary)
  const displayName = user.pseudo ?? user.name ?? 'Membre'
  const initial = displayName.charAt(0).toUpperCase()

  const profileEntries = Object.entries(analysis.percentages) as [ProfileType, number][]

  const profileDescriptions: Record<ProfileType, string> = {
    builder: "Capacité à transformer des idées en code et infrastructure solide.",
    creator: "Aptitude au design, à l'esthétique et à l'innovation conceptuelle.",
    strategist: "Vision d'ensemble, optimisation des processus et gestion de projet.",
    catalyst: "Force d'accélération sociale, networking et engagement communautaire."
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(content.whatsappText)}`

  return (
    <section className="px-6 py-16 max-w-2xl mx-auto">
      {/* Grille des scores */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        {profileEntries.map(([type, percent], i) => {
          const isPrimary = type === primary
          return (
            <TooltipProvider key={type}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl border p-5 cursor-help"
                    style={{
                      borderColor: isPrimary ? color : '#1a1a1a',
                      background: isPrimary ? `${color}08` : '#0f0f0f',
                    }}
                  >
                    <p
                      className="text-sm-plus tracking-wide uppercase mb-2"
                      style={{ color: isPrimary ? color : '#555' }}
                    >
                      {PROFILE_LABELS[type]}
                    </p>
                    <p
                      className="text-4xl font-extrabold leading-none mb-3"
                      style={{ color: isPrimary ? color : '#2a2a2a' }}
                    >
                      {percent}%
                    </p>
                    <div className="h-0.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${percent}%`,
                          background: isPrimary ? color : '#2a2a2a',
                        }}
                      />
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 border-white/10 text-xs text-zinc-300 font-mono max-w-48">
                  {profileDescriptions[type]}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>

      {/* Carte membre */}
      <div className="flex items-center gap-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl px-6 py-5 mb-6">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-black flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}66)` }}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{displayName}</p>
          <p className="text-sm text-zinc-500">
            {user.memberNumber ? `Membre #${String(user.memberNumber).padStart(4, '0')}` : ''}
          </p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-sm-plus font-semibold tracking-wide uppercase flex-shrink-0"
          style={{ background: `${color}18`, color }}
        >
          {PROFILE_LABELS[primary]}
        </span>
      </div>

      {/* Partage WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <span>↗</span>
        Partager ma carte profil sur WhatsApp
      </a>
    </section>
  )
}
