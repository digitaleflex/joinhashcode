import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, mutationLimiter } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

interface ProgressBody {
  contentId?: string;
  isCompleted?: boolean;
  note?: string;
  checklist?: Record<string, boolean>;
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ message: "Session expirée." }, { status: 401 });
  }

  const { limited } = await checkRateLimit(mutationLimiter, session.user.id);
  if (limited) {
    return NextResponse.json({ message: "Trop de requêtes." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as ProgressBody | null;
  if (!body?.contentId) {
    return NextResponse.json({ message: "contentId requis." }, { status: 400 });
  }

  const content = await prisma.content.findUnique({
    where: { id: body.contentId },
    select: { id: true },
  });
  if (!content) {
    return NextResponse.json({ message: "Contenu introuvable." }, { status: 404 });
  }

  const data: {
    isCompleted?: boolean;
    note?: string | null;
    checklist?: Record<string, boolean>;
  } = {};
  if (typeof body.isCompleted === "boolean") data.isCompleted = body.isCompleted;
  if (typeof body.note === "string") data.note = body.note.slice(0, 5000);
  if (body.checklist && typeof body.checklist === "object") {
    data.checklist = body.checklist;
  }

  const progress = await prisma.progress.upsert({
    where: {
      userId_contentId: { userId: session.user.id, contentId: body.contentId },
    },
    update: data,
    create: {
      userId: session.user.id,
      contentId: body.contentId,
      isCompleted: data.isCompleted ?? false,
      note: data.note ?? null,
      checklist: data.checklist ?? {},
    },
    select: { isCompleted: true, note: true, checklist: true, updatedAt: true },
  });

  return NextResponse.json({ progress });
}
