export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { requirePageSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ModuleDiscussions } from "@/components/academy/module-discussions";
import { ArrowLeft, BookOpen, FileText, Video, HelpCircle, Users } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCourse(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      category: true,
      sections: {
        orderBy: { order: "asc" },
        include: {
          contents: { orderBy: { order: "asc" } },
        },
      },
      _count: { select: { enrollments: true } },
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourse(id);
  return { title: course ? `${course.title} — Academy` : "Cours — Academy" };
}

function ContentIcon(type: string) {
  switch (type) {
    case "VIDEO":
      return <Video className="size-4 text-primary" />;
    case "QUIZ":
      return <HelpCircle className="size-4 text-warning" />;
    case "DOCUMENT":
    case "PDF":
      return <FileText className="size-4 text-success" />;
    default:
      return <FileText className="size-4 text-muted-foreground" />;
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  await requirePageSession();

  const { id } = await params;
  const course = await getCourse(id);

  if (!course) notFound();

  const totalContents = course.sections.reduce(
    (acc, s) => acc + s.contents.length,
    0,
  );
  const levelLabel = {
    BEGINNER: "Débutant",
    INTERMEDIATE: "Intermédiaire",
    ADVANCED: "Avancé",
  }[course.level];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header / back */}
      <div className="mb-8">
        <Link
          href="/academy/my-courses"
          className="inline-flex items-center gap-2 text-sm font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest mb-4"
        >
          <ArrowLeft className="size-4" /> Retour aux cours
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">
              {course.title}
            </h1>
            <p className="text-muted-foreground font-medium text-sm max-w-2xl">
              {course.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ModuleDiscussions
              courseId={id}
              showTrigger
            />
          </div>
        </div>
      </div>

      {/* Meta cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="size-4 text-primary" />
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              Catégorie
            </span>
          </div>
          <p className="text-sm font-bold text-foreground">
            {course.category?.name ?? "—"}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="size-4 text-primary" />
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              Inscrits
            </span>
          </div>
          <p className="text-sm font-bold text-foreground">
            {course._count.enrollments}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="size-4 text-primary" />
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              Sections / Contenus
            </span>
          </div>
          <p className="text-sm font-bold text-foreground">
            {course.sections.length} / {totalContents}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              Niveau / Langue
            </span>
          </div>
          <p className="text-sm font-bold text-foreground">
            {levelLabel} · {course.language}
          </p>
        </div>
      </div>

      {/* Status badge */}
      <div className="mb-8">
        <span
          className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${course.isPublished ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
            }`}
        >
          {course.isPublished ? "Publié" : "Brouillon"}
        </span>
      </div>

      {/* Sections + Contents */}
      <div className="space-y-8">
        {course.sections.map((section) => (
          <div key={section.id} className="bg-card border border-border rounded-[2rem] p-8">
            <h2 className="text-xl font-black text-foreground mb-6">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.contents.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/40 border border-border/60"
                >
                  {ContentIcon(content.type)}
                  <span className="text-sm font-medium text-foreground flex-1">
                    {content.title}
                  </span>
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                    {content.type}
                  </span>
                </div>
              ))}
              {section.contents.length === 0 && (
                <p className="text-sm text-muted-foreground font-medium">
                  Aucun contenu pour le moment.
                </p>
              )}
            </div>
          </div>
        ))}
        {course.sections.length === 0 && (
          <div className="text-center py-16 bg-card rounded-[2rem] border border-border">
            <p className="text-sm font-bold text-muted-foreground">
              Aucune section pour ce cours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}