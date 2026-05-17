import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { triggerNotification } from "@/lib/qstash";

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { dreamStatement, currentFocus, mainBlocker } = await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        dreamStatement,
        currentFocus,
        mainBlocker,
      },
    });

    // Trigger notification
    try {
      await triggerNotification({
        userId: session.user.id,
        type: "SYSTEM",
        title: "Profil Synchronisé",
        message: "Tes paramètres de build ont été mis à jour.",
        link: "/dashboard"
      });
    } catch (notificationError) {
      console.error("[NOTIFICATION_ERROR]", notificationError);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[POST_QUIZ_ONBOARDING_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
