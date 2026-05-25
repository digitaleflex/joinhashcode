import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";

const onboardingSchema = z.object({
  country: z.string().min(1).max(100).optional(),
  currentSituation: z.string().min(1).max(200),
  mainObjective: z.string().min(1).max(300).optional(),
  secondaryObjectives: z.array(z.string().max(200)).max(5).optional(),
  language: z.enum(["fr", "en"]).default("fr"),
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
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Données invalides", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...parsed.data,
        secondaryObjectives: parsed.data.secondaryObjectives || [],
      },
    });

    logActivity({
      userId: session.user.id,
      action: "ONBOARDING_COMPLETED",
      entity: "user",
      entityId: session.user.id,
      metadata: { currentSituation: parsed.data.currentSituation, country: parsed.data.country },
      request: req,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[ONBOARDING_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
