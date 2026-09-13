export const dynamic = "force-dynamic";

import { requirePageRole } from "@/lib/auth-guard";
import { Metadata } from "next";
import { CourseCreateForm } from "@/components/academy/course-create-form";

export const metadata: Metadata = { title: "Nouveau cours — Academy" };

export default async function AcademyNewCoursePage() {
  await requirePageRole(["ADMIN", "INSTRUCTOR"]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-foreground tracking-tight mb-1">
          Nouveau cours
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          Remplissez les informations pour créer votre cours
        </p>
      </div>

      <CourseCreateForm />
    </div>
  );
}