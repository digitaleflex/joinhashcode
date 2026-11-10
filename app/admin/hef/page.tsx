import Link from "next/link"
import { BookOpen, FlaskConical, GraduationCap, Layers, ListChecks, Trophy } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Academy HEF — Administration",
}

function statusLabel(count: number, expected: number) {
  if (count >= expected) return { label: "Complet", className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300" }
  if (count > 0) return { label: "Partiel", className: "border-amber-400/25 bg-amber-400/10 text-amber-300" }
  return { label: "Manquant", className: "border-red-400/25 bg-red-400/10 text-red-300" }
}

export default async function AdminHefPage() {
  const [courses, missions, hefSubmissions] = await Promise.all([
    prisma.course.findMany({
      where: { slug: { startsWith: "hef-" } },
      select: {
        id: true,
        slug: true,
        title: true,
        isPublished: true,
        thumbnail: true,
        pillar: { select: { level: true, slug: true } },
        sections: {
          select: {
            title: true,
            order: true,
            contents: {
              select: {
                id: true,
                title: true,
                type: true,
                url: true,
                quiz: { select: { questions: { select: { id: true } } } },
              },
            },
          },
        },
      },
      orderBy: { slug: "asc" },
    }),
    prisma.mission.findMany({
      where: { tags: { has: "HEF" } },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        status: true,
        tags: true,
        labTests: true,
        courseId: true,
        submissions: { select: { status: true } },
      },
    }),
    prisma.missionSubmission.findMany({
      where: { mission: { tags: { has: "HEF" } } },
      select: { status: true },
    }),
  ])

  const missionsByCourse = new Map<string, typeof missions>()
  for (const mission of missions) {
    if (!mission.courseId) continue
    missionsByCourse.set(mission.courseId, [...(missionsByCourse.get(mission.courseId) ?? []), mission])
  }

  const modules = courses.map((course) => {
    const contents = course.sections.flatMap((section) => section.contents)
    const missionContents = course.sections.find((section) => section.title === "Missions")?.contents ?? []
    // Quiz final uniquement : les quiz éclair sont rattachés aux contenus DOCUMENT des missions.
    const quizQuestions = contents.reduce(
      (sum, content) =>
        sum + (content.type === "QUIZ" ? content.quiz?.questions.length ?? 0 : 0),
      0,
    )
    const slides = contents.filter((content) => content.url?.includes("/hef/slides-pdf/")).length
    const courseMissions = missionsByCourse.get(course.id) ?? []
    const testedLabs = courseMissions.filter((mission) => {
      const tests = mission.labTests
      return Array.isArray(tests) && tests.length > 0
    }).length
    const submissions = courseMissions.flatMap((mission) => mission.submissions)
    const pending = submissions.filter((submission) =>
      ["PENDING", "IN_REVIEW", "PENDING_ADMIN"].includes(submission.status),
    ).length
    const approved = submissions.filter((submission) => submission.status === "APPROVED").length

    return {
      ...course,
      lessonCount: missionContents.length,
      quizQuestions,
      slides,
      labs: courseMissions.filter((mission) => mission.tags?.includes?.("LAB") || mission.category === "CODE").length,
      projects: courseMissions.filter((mission) => mission.tags?.includes?.("PROJECT") || mission.category === "GENERAL").length,
      testedLabs,
      pending,
      approved,
    }
  })

  const totalLessons = modules.reduce((sum, module) => sum + module.lessonCount, 0)
  const totalQuestions = modules.reduce((sum, module) => sum + module.quizQuestions, 0)
  const totalSlides = modules.reduce((sum, module) => sum + module.slides, 0)
  const totalTestedLabs = modules.reduce((sum, module) => sum + module.testedLabs, 0)
  const pendingSubmissions = hefSubmissions.filter((submission) =>
    ["PENDING", "IN_REVIEW", "PENDING_ADMIN"].includes(submission.status),
  ).length
  const approvedSubmissions = hefSubmissions.filter((submission) => submission.status === "APPROVED").length

  const stats = [
    { label: "Modules HEF", value: modules.length, icon: GraduationCap },
    { label: "Missions", value: totalLessons, icon: BookOpen },
    { label: "Questions de quiz", value: totalQuestions, icon: ListChecks },
    { label: "Slides PDF", value: totalSlides, icon: Layers },
    { label: "Labs auto-testés", value: totalTestedLabs, icon: FlaskConical },
    { label: "Soumissions HEF", value: hefSubmissions.length, icon: Trophy },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Academy
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
          Curriculum HEF
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Vue de pilotage du socle Engineering Foundations : complétude des modules,
          tests automatiques, quiz, slides et soumissions à traiter.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="flex flex-wrap gap-3">
        <Badge className="border border-amber-400/25 bg-amber-400/10 text-amber-300">
          {pendingSubmissions} soumission(s) en attente
        </Badge>
        <Badge className="border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
          {approvedSubmissions} validée(s)
        </Badge>
        <Link
          href="/admin/submissions"
          className="text-xs font-bold text-primary hover:underline"
        >
          Voir les soumissions →
        </Link>
        <Link
          href="/admin/missions"
          className="text-xs font-bold text-primary hover:underline"
        >
          Gérer les labs →
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-bold">Module</th>
                <th className="px-4 py-3 font-bold">Phase</th>
                <th className="px-4 py-3 font-bold">Missions</th>
                <th className="px-4 py-3 font-bold">Quiz</th>
                <th className="px-4 py-3 font-bold">Slides</th>
                <th className="px-4 py-3 font-bold">Tests lab</th>
                <th className="px-4 py-3 font-bold">Soumissions</th>
                <th className="px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {modules.map((module) => {
                const missionStatus = statusLabel(module.lessonCount, 9)
                const quizStatus = statusLabel(module.quizQuestions, 8)
                const slideStatus = statusLabel(module.slides, module.lessonCount)
                return (
                  <tr key={module.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-bold text-white">{module.title}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-zinc-500">{module.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{module.pillar?.level ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge className={`border ${missionStatus.className}`}>
                        {module.lessonCount} · {missionStatus.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`border ${quizStatus.className}`}>
                        {module.quizQuestions} q · {quizStatus.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`border ${slideStatus.className}`}>
                        {module.slides}/{module.lessonCount}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {module.testedLabs > 0 ? (
                        <Badge className="border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                          {module.testedLabs} testé(s)
                        </Badge>
                      ) : (
                        <Badge className="border border-white/10 bg-white/5 text-zinc-400">
                          Revue humaine
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      <span className="font-bold text-white">{module.pending}</span> en attente ·{" "}
                      <span className="text-emerald-300">{module.approved}</span> validées
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-xs font-semibold">
                        <Link
                          href={`/academy/courses/${module.slug}`}
                          className="text-primary hover:underline"
                        >
                          Voir le cours ↗
                        </Link>
                        <Link href="/admin/missions" className="text-zinc-400 hover:text-white">
                          Gérer les labs
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-zinc-500">
        « Revue humaine » indique un lab sans tests automatiques : la validation passe par
        le flux de soumission et un reviewer. Les modules dont le quiz ou les slides sont
        manquants doivent être complétés avant publication.
      </p>
    </div>
  )
}
