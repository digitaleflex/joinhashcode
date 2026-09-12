"use server";

import { requireSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

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

  if (!lessonId && !sectionId) return [];

  try {
    const topics = await prisma.forumTopic.findMany({
      where: {
        forum: { courseId },
        ...(lessonId ? { lessonId } : { sectionId }),
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true, image: true } },
        _count: { select: { posts: true, likes: true } },
      },
    });
    return topics;
  } catch {
    return [];
  }
}
