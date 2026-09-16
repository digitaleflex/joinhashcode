"use client"

import { motion } from "framer-motion"
import { Users, Trophy, Flame, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface FirstDayWidgetProps {
  activeMembers: number
  userRank: number
  totalMembers: number
  weeklyCheckins: number
  userName: string
}

const CHECKIN_GOAL = 3

export function FirstDayWidget({
  activeMembers,
  userRank,
  totalMembers,
  weeklyCheckins,
  userName,
}: FirstDayWidgetProps) {
  const firstName = userName.split(" ")[0]
  const checkinProgress = Math.min(weeklyCheckins, CHECKIN_GOAL)
  const checkinPercent = Math.round((checkinProgress / CHECKIN_GOAL) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {/* Social proof — active members */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
          <Users className="size-5 text-emerald-500" />
        </div>
        <div className="min-w-0">
          <div className="text-xl font-black text-white leading-none">
            {activeMembers > 0 ? activeMembers : "—"}
          </div>
          <div className="text-xs font-mono text-zinc-500 uppercase mt-1">
            {activeMembers > 0 ? "membres actifs aujourd'hui" : "pas encore de données"}
          </div>
        </div>
      </div>

      {/* Rank */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
          <Trophy className="size-5 text-amber-500" />
        </div>
        <div className="min-w-0">
          <div className="text-xl font-black text-white leading-none">
            #{userRank > 0 && totalMembers > 0 ? `${userRank}` : "—"}
          </div>
          <div className="text-xs font-mono text-zinc-500 uppercase mt-1">
            sur {totalMembers > 0 ? totalMembers : "—"} membres
          </div>
        </div>
      </div>

      {/* Weekly check-in goal */}
      <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="size-4 text-primary" />
            <span className="text-xs font-mono text-primary uppercase font-bold">
              Objectif semaine
            </span>
          </div>
          <span className="text-xs font-black text-primary">
            {checkinProgress}/{CHECKIN_GOAL}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${checkinPercent}%` }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-primary"
          />
        </div>
        {checkinProgress >= CHECKIN_GOAL ? (
          <p className="text-xs text-primary font-bold">
            {firstName}, tu as atteint l&apos;objectif ! Badge Streak débloqué.
          </p>
        ) : (
          <p className="text-xs text-zinc-500">
            {firstName}, fais {CHECKIN_GOAL - checkinProgress} check-in{CHECKIN_GOAL - checkinProgress > 1 ? "s" : ""} de plus pour débloquer le badge Streak.
          </p>
        )}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-7 text-xs font-mono font-bold text-primary hover:text-primary hover:bg-primary/10 self-start mt-auto"
        >
          <Link href="/missions">
            Voir les missions <ArrowRight className="size-3 ml-1" />
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}
