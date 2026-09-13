"use server";

import { requireSession, AuthError } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logError } from "@/lib/logger";

interface GetContextTopicsParams {
  courseId: string;
  sectionId?: string;
  lessonId?: string;
}

export async function getContextTopics({
  courseId,
  sectionId,
  lessonId,
}: GetContextTopicsParams) {
  try {
    const session = await requireSession();
    if (!session.user.id) return [];
  } catch {
    return [];
  }

  try {
    const topics = await prisma.forumTopic.findMany({
      where: {
        forum: { courseId },
        // Contexte : leçon > section > discussions générales du cours
        ...(lessonId
          ? { lessonId }
          : sectionId
            ? { sectionId }
            : { lessonId: null, sectionId: null }),
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true, image: true } },
        _count: { select: { posts: true, likes: true } },
      },
    });
    return topics;
  } catch (error) {
    logError("Forum — getContextTopics", error as Error, { courseId });
    return [];
  }
}

/* ─────────────────────────────────────────── */
/*  Actions ajoutées                            */
/* ─────────────────────────────────────────── */

export async function getTopicWithPosts({
  topicId,
}: {
  topicId: string;
}) {
  try {
    await requireSession();
  } catch {
    return null;
  }

  try {
    const topic = await prisma.forumTopic.findUnique({
      where: { id: topicId },
      include: {
        author: { select: { name: true, image: true } },
        forum: { select: { courseId: true } },
        posts: {
          orderBy: { createdAt: "asc" },
          include: { author: { select: { name: true, image: true } } },
        },
      },
    });
    return topic;
  } catch (error) {
    logError("Forum — getTopicWithPosts", error as Error, { topicId });
    return null;
  }
}

const createTopicSchema = z.object({
  courseId: z.string().min(1),
  sectionId: z.string().optional(),
  lessonId: z.string().optional(),
  title: z.string().min(3),
  content: z.string().min(1),
});

export async function createTopic(input: z.infer<typeof createTopicSchema>) {
  try {
    const session = await requireSession();
    const data = createTopicSchema.parse(input);

    if (!data.sectionId && !data.lessonId) {
      return { success: false, error: "Section ou leçon requise" };
    }

    // Assure le forum existe pour ce cours
    await prisma.forum.upsert({
      where: { courseId: data.courseId },
      update: {},
      create: { courseId: data.courseId },
    });

    const forum = await prisma.forum.findUnique({
      where: { courseId: data.courseId },
      select: { id: true },
    });
    if (!forum) {
      return { success: false, error: "Forum introuvable" };
    }

    const topic = await prisma.forumTopic.create({
      data: {
        title: data.title,
        content: data.content,
        forumId: forum.id,
        sectionId: data.sectionId ?? null,
        lessonId: data.lessonId ?? null,
        authorId: session.user.id,
      },
    });

    revalidatePath(`/academy/my-courses/${data.courseId}`);
    return { success: true, data: { id: topic.id } };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Données invalides" };
    }
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }
    logError("Forum — createTopic", error as Error, input);
    return { success: false, error: "Erreur lors de la création du sujet" };
  }
}

const createPostSchema = z.object({
  topicId: z.string().min(1),
  content: z.string().min(1),
});

export async function createPost(input: z.infer<typeof createPostSchema>) {
  try {
    const session = await requireSession();
    const data = createPostSchema.parse(input);

    const topic = await prisma.forumTopic.findUnique({
      where: { id: data.topicId },
      include: { forum: { select: { courseId: true } } },
    });
    if (!topic) {
      return { success: false, error: "Sujet introuvable" };
    }
    if (topic.isLocked) {
      return { success: false, error: "Sujet verrouillé" };
    }

    await prisma.forumPost.create({
      data: {
        content: data.content,
        topicId: data.topicId,
        authorId: session.user.id,
      },
    });

    revalidatePath(`/academy/my-courses/${topic.forum.courseId}/forum/${data.topicId}`);
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Données invalides" };
    }
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }
    logError("Forum — createPost", error as Error, input);
    return { success: false, error: "Erreur lors de la création de la réponse" };
  }
}
