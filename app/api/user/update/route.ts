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
    const { 
      name, 
      pseudo, 
      image, 
      country, 
      city, 
      currentSituation, 
      githubUrl, 
      portfolioUrl,
      mainObjective,
      secondaryObjectives
    } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        pseudo,
        image,
        country,
        city,
        currentSituation,
        githubUrl,
        portfolioUrl,
        mainObjective,
        secondaryObjectives,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_UPDATE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
