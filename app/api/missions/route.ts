export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit";
import { z } from "zod";
import { MissionsService } from "@/lib/services/missions.service";

const submissionSchema = z.object({
  missionId: z.string().min(1),
  content: z.string().url("Le lien de soumission doit être une URL valide (http/https).").startsWith("http", "Seuls les liens HTTP/HTTPS sont acceptés."),
  projectDescription: z.string().optional(),
  userDifficulty: z.number().min(1).max(5).optional(),
  userRating: z.number().min(1).max(5).optional(),
  userFeedback: z.string().optional(),
  improvementSuggestions: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Accès non autorisé. Connecte-toi pour valider ta mission." }, { status: 401 });
    }

    const { limited } = await checkRateLimit(mutationLimiter, session.user.id);
    if (limited) {
      return NextResponse.json({ message: "Trop de soumissions. Réessaie dans une minute." }, { status: 429 });
    }

    const body = await req.json();
    const validatedData = submissionSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ message: "Données d'envoi invalides. Vérifie tes champs." }, { status: 400 });
    }

    try {
      const result = await MissionsService.submitMission({
        userId: session.user.id,
        ...validatedData.data
      });

      return NextResponse.json(result);
    } catch (serviceError: any) {
      const errorMap: Record<string, { message: string, status: number }> = {
        "MISSION_NOT_FOUND": { message: "Mission introuvable dans le système.", status: 404 },
        "USER_NOT_FOUND": { message: "Utilisateur introuvable.", status: 404 },
        "LEVEL_TOO_LOW": { message: "Ton rang est trop bas pour cette mission. Continue de build !", status: 403 },
        "ALREADY_APPROVED": { message: "Cette mission a déjà été validée pour cette période.", status: 409 },
        "SUBMISSION_PENDING": { message: "Ta soumission est déjà en attente de validation. Patience !", status: 400 },
        "MAX_REVISIONS_REACHED": { message: "Nombre maximum de révisions atteint. Contacte un admin.", status: 400 },
      };

      const mapped = errorMap[serviceError.message];
      if (mapped) {
        return NextResponse.json({ message: mapped.message }, { status: mapped.status });
      }
      
      throw serviceError; // Let it be caught by the outer catch for 500
    }
  } catch (error: unknown) {
    console.error("[MISSION_SUBMIT_ROUTE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
