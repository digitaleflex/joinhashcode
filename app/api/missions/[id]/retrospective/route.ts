export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const retrospectiveSchema = z.object({
  projectDescription: z.string().optional(),
  userDifficulty: z.number().min(1).max(5).optional(),
  userRating: z.number().min(1).max(5).optional(),
  userFeedback: z.string().optional(),
  improvementSuggestions: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Accès non autorisé.", { status: 401 });
    }

    const missionId = params.id;
    const body = await req.json();
    const validatedData = retrospectiveSchema.safeParse(body);

    if (!validatedData.success) {
      return new NextResponse("Données de rétrospective invalides.", { status: 400 });
    }

    const { 
      projectDescription,
      userDifficulty,
      userRating,
      userFeedback,
      improvementSuggestions
    } = validatedData.data;

    // Update the submission
    const submission = await prisma.missionSubmission.update({
      where: {
        userId_missionId: {
          userId: session.user.id,
          missionId: missionId
        }
      },
      data: {
        projectDescription,
        userDifficulty,
        userRating,
        userFeedback,
        improvementSuggestions,
      }
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("[MISSION_RETROSPECTIVE]", error);
    return new NextResponse("Erreur interne du système.", { status: 500 });
  }
}
