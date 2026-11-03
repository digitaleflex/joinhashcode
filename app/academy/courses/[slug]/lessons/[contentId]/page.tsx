import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Clock, FileText } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { MarkdownContent } from "@/components/academy/markdown-content"

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

        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" aria-hidden />
            {content.type === "DOCUMENT" ? "Lecture" : content.type}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {index + 1} / {flat.length}
          </span>
        </div>

        <article className="mt-10 border-t border-border pt-8">
          {content.body ? (
            <MarkdownContent>{content.body}</MarkdownContent>
          ) : (
            <p className="text-sm text-muted-foreground">
              Le contenu de cette leçon n&apos;est pas encore disponible.
            </p>
          )}
        </article>

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
