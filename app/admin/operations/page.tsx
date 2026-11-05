import Link from "next/link"
import { AlertCircle, MailCheck, UserCheck, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { OpsRemindButton } from "@/components/admin/ops-remind-button"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Opérations & relances — Administration",
}

function missingStep(user: {
  currentSituation: string | null
  class: string | null
  primaryDomain: string | null
  firstActionStartedAt: Date | null
}) {
  if (!user.currentSituation) return "Inscription à terminer"
  if (!user.class) return "Diagnostic à faire"
  if (!user.primaryDomain) return "Domaine à choisir"
  if (!user.firstActionStartedAt) return "Première action à commencer"
  return null
}

export default async function AdminOperationsPage() {
  const [totalValid, noOnboarding, noQuiz, noDomain, noFirstAction, users] =
    await Promise.all([
      prisma.user.count({
        where: { banned: { not: true }, deactivatedAt: null, emailOptOutAt: null, emailStatus: "VALID" },
      }),
      prisma.user.count({
        where: { banned: { not: true }, deactivatedAt: null, emailOptOutAt: null, currentSituation: null },
      }),
      prisma.user.count({
        where: {
          banned: { not: true },
          deactivatedAt: null,
          emailOptOutAt: null,
          currentSituation: { not: null },
          class: null,
        },
      }),
      prisma.user.count({
        where: {
          banned: { not: true },
          deactivatedAt: null,
          emailOptOutAt: null,
          class: { not: null },
          primaryDomain: null,
        },
      }),
      prisma.user.count({
        where: {
          banned: { not: true },
          deactivatedAt: null,
          emailOptOutAt: null,
          primaryDomain: { not: null },
          firstActionStartedAt: null,
        },
      }),
      prisma.user.findMany({
        where: {
          banned: { not: true },
          deactivatedAt: null,
          emailOptOutAt: null,
          emailStatus: "VALID",
          OR: [
            { currentSituation: null },
            { class: null },
            { primaryDomain: null },
            { firstActionStartedAt: null },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          currentSituation: true,
          class: true,
          primaryDomain: true,
          firstActionStartedAt: true,
          createdAt: true,
          lastOpsReminderAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ])

  const stats = [
    { label: "Comptes valides", value: totalValid, icon: Users },
    { label: "Inscription à terminer", value: noOnboarding, icon: AlertCircle },
    { label: "Diagnostic à faire", value: noQuiz, icon: AlertCircle },
    { label: "Domaine à choisir", value: noDomain, icon: AlertCircle },
    { label: "Première action à démarrer", value: noFirstAction, icon: UserCheck },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Opérations
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
          Activation & communications
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Repère les membres bloqués dans le parcours et envoie une relance
          transactionnelle ciblée. Une seule relance par membre toutes les 24 h.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  {stat.label}
                </span>
                <Icon className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <p className="mt-3 text-3xl font-black text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <Link href="/admin/users" className="font-bold text-primary hover:underline">
          Gérer tous les membres →
        </Link>
        <Link href="/admin/activity" className="font-semibold text-zinc-400 hover:text-white">
          Journal d’activité →
        </Link>
        <Badge className="border border-white/10 bg-white/5 text-zinc-400">
          Emails valides uniquement · comptes bannis/désactivés exclus
        </Badge>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <div className="border-b border-white/5 px-5 py-4">
          <p className="flex items-center gap-2 text-sm font-bold text-white">
            <MailCheck className="h-4 w-4 text-primary" aria-hidden />
            Membres à relancer ({users.length})
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-bold">Membre</th>
                <th className="px-4 py-3 font-bold">Étape manquante</th>
                <th className="px-4 py-3 font-bold">Inscrit le</th>
                <th className="px-4 py-3 font-bold">Dernière relance</th>
                <th className="px-4 py-3 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => {
                const step = missingStep(user)
                const recentlyReminded =
                  Boolean(user.lastOpsReminderAt) &&
                  Date.now() - user.lastOpsReminderAt!.getTime() < 24 * 60 * 60 * 1000
                return (
                  <tr key={user.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="border border-amber-400/25 bg-amber-400/10 text-amber-300">
                        {step ?? "Parcours complet"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {user.createdAt.toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {user.lastOpsReminderAt
                        ? user.lastOpsReminderAt.toLocaleDateString("fr-FR")
                        : "Jamais"}
                    </td>
                    <td className="px-4 py-3">
                      <OpsRemindButton
                        userId={user.id}
                        recentlyReminded={recentlyReminded}
                      />
                    </td>
                  </tr>
                )
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-500">
                    Aucun membre à relancer. 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
