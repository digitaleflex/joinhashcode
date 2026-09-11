"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  level: string;
  category: { name: string } | null;
  instructor: { name: string | null; image: string | null };
  _count: { sections: number };
}

function CourseCardSkeleton() {
  return (
    <div className="border border-border rounded-3xl p-6 space-y-4">
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

function CoursesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-black text-foreground mb-2">Aucun cours disponible</h3>
      <p className="text-muted-foreground text-center max-w-sm font-medium">
        Nous ajouterons bientôt de nouvelles formations. Revenez nous rendre visite.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-black text-foreground mb-2">Impossible de charger le catalogue</h3>
      <p className="text-muted-foreground text-center max-w-sm font-medium mb-6">
        Une erreur est survenue lors de la récupération des formations.
      </p>
      <Button onClick={onRetry} className="rounded-full px-8 font-bold">
        Réessayer
      </Button>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/academy/courses/${course.slug}`}
      className="group bg-card rounded-3xl border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      <div className="aspect-16/10 bg-secondary relative overflow-hidden border-b border-border">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/5 to-transparent">
            <span className="text-primary/20 text-6xl font-black italic">H</span>
          </div>
        )}
        <div className="absolute top-5 left-5 bg-card/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-border">
          <span className="text-[10px] font-black uppercase tracking-wider text-primary">
            {course.level === "BEGINNER" ? "Débutant" : course.level === "INTERMEDIATE" ? "Intermédiaire" : "Avancé"}
          </span>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1 space-y-4">
        <h3 className="text-xl font-black text-foreground leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
        <p className="text-muted-foreground font-medium text-sm line-clamp-2 leading-relaxed">{course.description || "Découvrez les fondamentaux de ce parcours avec nos experts."}</p>
        <div className="pt-4 mt-auto border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-muted rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-muted-foreground">{course.instructor.name?.charAt(0) || "H"}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{course.instructor.name || "HashCode Team"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Voir</span>
            <ArrowRight className="size-3 text-primary" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function AcademyCoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await fetch("/api/academy/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      } else {
        setHasError(true);
        setCourses([]);
      }
    } catch {
      setHasError(true);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-primary rounded-full" />
            <span className="text-[12px] font-black uppercase tracking-[0.2em] text-primary">Catalogue</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Toutes nos formations</h1>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl">Développez vos compétences avec des parcours conçus par des experts et certifiés par l&apos;État.</p>
        </div>

        {loading ? (
          <CoursesLoading />
        ) : hasError ? (
          <ErrorState onRetry={fetchCourses} />
        ) : !courses || courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
