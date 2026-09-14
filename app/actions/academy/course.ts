"use server";

import { requireRole, requireSession, AuthError } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";

const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  language: z.enum(["FR", "EN"]).default("FR"),
});

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function createCourse(input: z.infer<typeof createCourseSchema>) {
  try {
    const session = await requireRole(["ADMIN", "INSTRUCTOR"]);
    const data = createCourseSchema.parse(input);

    const base = slugify(data.title) || "course";
    const suffix = Math.random().toString(36).substring(2, 6);
    const slug = `${base}-${suffix}`;

    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        slug,
        language: data.language,
        instructorId: session.user.id,
      },
    });

    await logActivity({
      userId: session.user.id,
      action: "CREATE_COURSE",
      entity: "Course",
      entityId: course.id,
      metadata: { title: course.title },
    });

    revalidatePath("/academy/my-courses");
    revalidatePath("/academy/courses");

    return { success: true, data: { id: course.id, slug: course.slug } };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Données invalides" };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "Ce titre est déjà utilisé" };
    }
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur lors de la création du cours" };
  }
}

/**
 * Liste les cours visibles par l'appelant.
 * ADMIN voit tout ; INSTRUCTOR ne voit que ses propres cours.
 */
export async function getCourses() {
   try {
     const session = await requireRole(["ADMIN", "INSTRUCTOR"]);
     const role = (session.user as { role?: string }).role;
 
     const courses = await prisma.course.findMany({
       where: role === "ADMIN" ? {} : { instructorId: session.user.id },
       orderBy: { createdAt: "desc" },
       include: {
         _count: { select: { sections: true, enrollments: true } },
       },
     });
     return { success: true, data: courses };
   } catch (error: unknown) {
     if (error instanceof AuthError) {
       return { success: false, error: error.message };
     }
     return { success: false, error: "Erreur lors du chargement des cours" };
   }
 }

 const enrollSchema = z.object({
   courseId: z.string().min(1),
 });

 export async function enrollInCourse(input: z.infer<typeof enrollSchema>) {
   try {
     const session = await requireSession();
     const data = enrollSchema.parse(input);

     const course = await prisma.course.findUnique({
       where: { id: data.courseId },
       select: { id: true, isPublished: true },
     });

     if (!course || !course.isPublished) {
       return { success: false, error: "Cours introuvable" };
     }

     await prisma.enrollment.upsert({
       where: { userId_courseId: { userId: session.user.id, courseId: data.courseId } },
       update: {},
       create: { userId: session.user.id, courseId: data.courseId },
     });

     revalidatePath("/academy/my-courses");
     revalidatePath(`/academy/courses/${data.courseId}`);

     await logActivity({
       userId: session.user.id,
       action: "ENROLL_COURSE",
       entity: "Course",
       entityId: data.courseId,
     });

     return { success: true };
   } catch (error: unknown) {
     if (error instanceof z.ZodError) {
       return { success: false, error: "Données invalides" };
     }
     if (error instanceof AuthError) {
       return { success: false, error: error.message };
     }
     return { success: false, error: "Erreur lors de l'inscription" };
   }
 }

 export async function isEnrolled(courseId: string) {
   try {
     const session = await requireSession();
     const enrollment = await prisma.enrollment.findUnique({
       where: { userId_courseId: { userId: session.user.id, courseId } },
     });
     return enrollment !== null;
   } catch {
     return false;
   }
 }
