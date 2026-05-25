export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";

const cardUpdateSchema = z.object({
  customSecretCode: z.string()
    .min(16, "Le code secret personnalisÃ© doit contenir au moins 16 caractÃ¨res pour des raisons de sÃ©curitÃ©.")
    .max(100, "Le code secret personnalisÃ© ne peut pas dÃ©passer 100 caractÃ¨res.")
    .optional()
    .or(z.literal("")),
  customSignature: z.string()
    .regex(/^[a-zA-Z0-9-]{3,20}$/, "La signature doit contenir uniquement des lettres, chiffres et tirets, et faire entre 3 et 20 caractÃ¨res.")
    .optional()
    .or(z.literal("")),
  cardTier: z.enum(["STANDARD", "PREMIUM", "FOUNDER"]).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Non autorisÃ©. Veuillez vous connecter.", { status: 401 });
    }

    const body = await req.json();
    const parsed = cardUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      return new NextResponse(firstError || "DonnÃ©es transmises invalides.", { status: 400 });
    }

    const { customSecretCode, customSignature, cardTier } = parsed.data;
    
    // Objet de mise Ã  jour Ã  construire dynamiquement
    const updateData: any = {};

    // 1. Traitement sÃ©curisÃ© du Code Secret PersonnalisÃ©
    if (customSecretCode) {
      // Hachage cryptographique fort (SHA-256) avant stockage (ConformitÃ© EHAF & RGPD)
      const hash = crypto.createHash("sha256").update(customSecretCode.trim()).digest("hex");
      updateData.cardSecretHash = hash;
      updateData.cardIssuedAt = new Date();
    }

    // 2. Traitement et formatage de la Signature PersonnalisÃ©e
    if (customSignature) {
      const formattedSig = customSignature.trim().toUpperCase();
      
      // Validation de l'unicitÃ© de la signature de carte
      const existingUser = await prisma.user.findFirst({
        where: {
          cardSignature: formattedSig,
          NOT: { id: session.user.id }
        }
      });

      if (existingUser) {
        return new NextResponse("Cette signature de carte est dÃ©jÃ  attribuÃ©e Ã  un autre membre.", { status: 409 });
      }

      updateData.cardSignature = formattedSig;
    }

    // 3. Mise Ã  jour du Tier de la carte
    if (cardTier) {
      updateData.cardTier = cardTier;
    }

    // Si aucune mise Ã  jour n'est requise
    if (Object.keys(updateData).length === 0) {
      return new NextResponse("Aucune donnÃ©e de modification fournie.", { status: 400 });
    }

    // 4. Enregistrement sÃ©curisÃ© en base de donnÃ©es
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // 5. Retour des mÃ©tadonnÃ©es mises Ã  jour, sans JAMAIS renvoyer le secret en clair
    return NextResponse.json({
      success: true,
      cardSignature: updatedUser.cardSignature,
      cardIssuedAt: updatedUser.cardIssuedAt,
      cardTier: updatedUser.cardTier,
      memberNumber: updatedUser.memberNumber,
    });

  } catch (error: any) {
    console.error("[CARD_UPDATE_POST_ERROR]", error);
    return new NextResponse("Une erreur est survenue lors de l'enregistrement de la carte.", { status: 500 });
  }
}
