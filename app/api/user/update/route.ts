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
      twitterUrl,
      linkedinUrl,
      mainObjective,
      secondaryObjectives
    } = body;

    // Pseudo Validation: Alphanumeric and underscores only, 3-20 chars
    if (pseudo) {
      const pseudoRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!pseudoRegex.test(pseudo)) {
        return new NextResponse(
          "Le pseudo doit contenir entre 3 et 20 caractères (lettres, chiffres et '_' uniquement).", 
          { status: 400 }
        );
      }
    }

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
        twitterUrl,
        linkedinUrl,
        mainObjective,
        secondaryObjectives,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("[USER_UPDATE_PATCH]", error);
    
    // Handle Prisma unique constraint violation (P2002)
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      if (field === 'pseudo') {
        return new NextResponse("Ce pseudo est déjà utilisé par un autre talent.", { status: 409 });
      }
    }
    
    return new NextResponse("Erreur lors de la mise à jour", { status: 500 });
  }
}
