export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { requirePageSession } from "@/lib/auth-guard";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, AlertTriangle, Plus } from "lucide-react";

function CoursesListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border border-border rounded-[2rem] p-6 space-y-4 bg-card">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ isInstructor }: { isInstructor: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-card rounded-[3rem] border border-border">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-black text-foreground mb-2">Aucun cours</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6 font-medium">
        {isInstructor
          ? "Commencez par créer votre premier cours."
          : "Inscrivez-vous à un cours pour commencer à apprendre."}
      </p>
      {isInstructor && (
        <Button asChild className="rounded-full px-8 font-black text-xs uppercase tracking-widest">
          <Link href="/academy/my-courses/new">
            <Plus className="size-4" /> Créer mon premier cours
          </Link>
        </Button>
      )}
    </div>
  );
}

async function CoursesList({ isInstructor, userId }: { isInstructor: boolean; userId?: string }) {
  let courses: { id: string; title: string; isPublished: boolean; updatedAt: Date }[] = [];

  try {
    courses = await prisma.course.findMany({
      where: isInstructor
        ? {}
        : { isPublished: true, enrollments: { some: { userId: userId! } } },
      select: {
        id: true,
        title: true,
        isPublished: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    return (
      <div className="p-8 text-destructive bg-destructive/10 rounded-3xl border border-destructive/20 flex items-center gap-3 font-bold">
        <AlertTriangle className="size-5" /> Erreur lors du chargement des cours.
      </div>
    );
  }

  if (courses.length === 0) {
    return <EmptyState isInstructor={isInstructor} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <div key={course.id} className="bg-card border border-border rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${course.isPublished ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
              {course.isPublished ? "Publié" : "Brouillon"}
            </span>
          </div>
          <h3 className="font-black text-foreground text-lg mb-6">{course.title}</h3>
          <Link
            href={`/academy/my-courses/${course.id}`}
            className="text-sm font-black text-primary hover:text-primary/80 transition-colors"
          >
            {isInstructor ? "Gérer" : "Continuer"} →
          </Link>
        </div>
      ))}
    </div>
  );
}

export default async function AcademyMyCoursesPage() {
  const session = await requirePageSession();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  const isInstructor = user?.role === "INSTRUCTOR" || user?.role === "ADMIN";

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight mb-1">Mes cours</h1>
          <p className="text-muted-foreground font-medium text-sm">
            {isInstructor ? "Gérez vos cours" : "Continuez votre apprentissage"}
          </p>
        </div>
        {isInstructor && (
          <Button asChild className="rounded-full px-8 font-black text-xs uppercase tracking-widest h-11">
            <Link href="/academy/my-courses/new">
              <Plus className="size-4" /> Nouveau cours
            </Link>
          </Button>
        )}
      </div>

      <Suspense fallback={<CoursesListSkeleton />}>
        <CoursesList isInstructor={isInstructor} userId={session.user.id} />
      </Suspense>
    </div>
  );
}
