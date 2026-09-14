"use client";

import { useState, useTransition } from "react";
import { Loader2, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { enrollInCourse } from "@/app/actions/academy/course";

interface EnrollButtonProps {
  courseId: string;
  initiallyEnrolled: boolean;
}

export function EnrollButton({ courseId, initiallyEnrolled }: EnrollButtonProps) {
  const [enrolled, setEnrolled] = useState(initiallyEnrolled);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleEnroll() {
    setError(null);
    startTransition(async () => {
      const result = await enrollInCourse({ courseId });
      if (result.success) {
        setEnrolled(true);
      } else {
        setError(result.error ?? "Erreur lors de l'inscription");
      }
    });
  }

  if (enrolled) {
    return (
      <div className="space-y-3">
        <Button
          disabled
          className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest"
        >
          <Check className="size-4 mr-2" /> Déjà inscrit
        </Button>
        <Link
          href="/academy/my-courses"
          className="block text-center text-xs font-black text-primary hover:underline uppercase tracking-widest"
        >
          Voir mes cours →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleEnroll}
        disabled={isPending}
        className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 mr-2 animate-spin" />
            Inscription...
          </>
        ) : (
          "S'inscrire au cours"
        )}
      </Button>
      {error && (
        <p className="text-xs font-bold text-destructive text-center">
          {error}
        </p>
      )}
    </div>
  );
}
