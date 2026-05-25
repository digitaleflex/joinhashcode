export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { triggerNotification } from "@/lib/qstash";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";

const postQuizSchema = z.object({
  dreamStatement: z.string().min(1).max(500).optional(),
  currentFocus: z.array(z.string().max(100)).max(5).optional(),
  mainBlocker: z.string().max(300).optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const parsed = postQuizSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("DonnÃ©es invalides", { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
    });

    try {
      await triggerNotification({
        userId: session.user.id,
        type: "SYSTEM",
        title: "Profil SynchronisÃ©",
        message: "Tes paramÃ¨tres de build ont Ã©tÃ© mis Ã  jour.",
        link: "/dashboard",
      });
    } catch (notificationError) {
      console.error("[NOTIFICATION_ERROR]", notificationError);
    }

    logActivity({
      userId: session.user.id,
      action: "POST_QUIZ_COMPLETED",
      entity: "user",
      entityId: session.user.id,
      metadata: { mainBlocker: parsed.data.mainBlocker, focusCount: parsed.data.currentFocus?.length },
      request: req,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[POST_QUIZ_ONBOARDING_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
