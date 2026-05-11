import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { country, currentSituation, mainObjective, language } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        country,
        currentSituation,
        mainObjective,
        language: language || "fr",
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[ONBOARDING_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
