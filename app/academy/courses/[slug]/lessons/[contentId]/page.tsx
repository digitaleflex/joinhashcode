import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Clock, FileText } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getSessionSafe } from "@/lib/get-session-safe"
import { MarkdownContent } from "@/components/academy/markdown-content"
import { QuizPlayer } from "@/components/academy/quiz-player"
import { LessonWorkspace } from "@/components/academy/lesson-workspace"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; contentId: string }>
}) {
  const { contentId } = await params
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: { title: true },
  })
  return { title: content ? `${content.title} — Academy` : "Academy" }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; contentId: string }>
}) {
  const { slug, contentId } = await params

  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: {
      section: {
        include: {
          course: { select: { id: true, slug: true, title: true, isPublished: true } },
        },
      },
      mission: {
        select: {
          slug: true,
          title: true,
          category: true,
          deliverables: true,
          acceptanceCriteria: true,
        },
      },
      quiz: {
        include: {
          questions: {
            include: { options: true },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  })

  if (
    !content ||
    !content.section.course.isPublished ||
    content.section.course.slug !== slug
  ) {
    notFound()
  }

  const flat = await prisma.content.findMany({
    where: { section: { courseId: content.section.course.id } },
    select: {
      id: true,
      title: true,
      section: { select: { title: true, order: true } },
    },
    orderBy: [{ section: { order: "asc" } }, { order: "asc" }],
  })

  const session = await getSessionSafe()
  const progress = session
    ? await prisma.progress.findUnique({
        where: {
          userId_contentId: { userId: session.user.id, contentId: content.id },
        },
        select: { isCompleted: true, note: true, checklist: true },
      })
    : null

  const missionDeliverables = content.mission?.deliverables ?? []
  const missionCriteria = Array.isArray(content.mission?.acceptanceCriteria)
    ? (content.mission?.acceptanceCriteria as string[])
    : []
  const checklistGroups = content.mission
    ? [
        ...(missionDeliverables.length > 0
          ? [{ title: "Livrables à produire", items: missionDeliverables }]
          : []),
        ...(missionCriteria.length > 0
          ? [{ title: "Critères de validation", items: missionCriteria }]
          : []),
      ]
    : []

  const checklist = (progress?.checklist as Record<string, boolean> | null) ?? {}

  const index = flat.findIndex((item) => item.id === content.id)
  const previous = index > 0 ? flat[index - 1] : null
  const next = index >= 0 && index < flat.length - 1 ? flat[index + 1] : null

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <Link
          href={`/academy/courses/${slug}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Retour au cours
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em]">
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">
            {content.section.title}
          </span>
          <span className="text-muted-foreground">{content.section.course.title}</span>
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          {content.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" aria-hidden />
            {content.type === "DOCUMENT"
              ? "Lecture"
              : content.type === "QUIZ"
                ? "Quiz"
                : content.type}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {index + 1} / {flat.length}
          </span>
          {content.url?.endsWith(".pdf") && (
            <a
              href={content.url}
              download
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden />
              Télécharger les slides (PDF)
            </a>
          )}
        </div>

        {content.mission && (
          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/[0.05] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Évaluation
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {content.mission.category === "PROJECT"
                  ? "Ce projet se soumet avec un livrable, puis est relu par un reviewer."
                  : "Ce lab se soumet avec un lien de dépôt, puis est relu par un reviewer."}
              </p>
            </div>
            <Link
              href={`/missions/${content.mission.slug}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {content.mission.category === "PROJECT" ? "Soumettre mon projet" : "Ouvrir le lab"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        )}

        <article className="mt-10 border-t border-border pt-8">
          {content.type === "QUIZ" && content.quiz ? (
            <QuizPlayer
              quizId={content.quiz.id}
              contentId={content.id}
              initialPassScore={content.quiz.passScore}
              questions={content.quiz.questions.map((question) => ({
                id: question.id,
                text: question.text,
                options: question.options.map((option) => ({
                  id: option.id,
                  text: option.text,
                })),
              }))}
            />
          ) : content.body ? (
            <MarkdownContent>{content.body}</MarkdownContent>
          ) : (
            <p className="text-sm text-muted-foreground">
              Le contenu de cette leçon n&apos;est pas encore disponible.
            </p>
          )}
        </article>

        <LessonWorkspace
          contentId={content.id}
          initialCompleted={progress?.isCompleted ?? false}
          initialNote={progress?.note ?? ""}
          initialChecklist={checklist}
          checklistGroups={checklistGroups}
          mission={
            content.mission
              ? { slug: content.mission.slug, category: content.mission.category }
              : null
          }
          isAuthenticated={Boolean(session)}
        />

        <nav className="mt-12 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-stretch sm:justify-between">
          {previous ? (
            <Link
              href={`/academy/courses/${slug}/lessons/${previous.id}`}
              className="group flex flex-1 flex-col rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <ArrowLeft className="h-3 w-3" aria-hidden />
                Précédent
              </span>
              <span className="mt-1 text-sm font-bold text-foreground group-hover:text-primary">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span className="hidden flex-1 sm:block" />
          )}

          {next ? (
            <Link
              href={`/academy/courses/${slug}/lessons/${next.id}`}
              className="group flex flex-1 flex-col rounded-2xl border border-border bg-card p-4 text-right transition-colors hover:border-primary/40"
            >
              <span className="inline-flex items-center justify-end gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Suivant
                <ArrowRight className="h-3 w-3" aria-hidden />
              </span>
              <span className="mt-1 text-sm font-bold text-foreground group-hover:text-primary">
                {next.title}
              </span>
            </Link>
          ) : (
            <Link
              href={`/academy/courses/${slug}`}
              className="group flex flex-1 flex-col rounded-2xl border border-primary/20 bg-primary/5 p-4 text-right transition-colors hover:border-primary/40"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Terminé
              </span>
              <span className="mt-1 text-sm font-bold text-foreground group-hover:text-primary">
                Retour au cours
              </span>
            </Link>
          )}
        </nav>
      </div>
    </main>
  )
}
