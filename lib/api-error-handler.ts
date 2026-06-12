import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Handler d'erreurs global pour les routes d'API Next.js.
 * Centralise le logging côté serveur et standardise les réponses côté client.
 * Garantit qu'aucun détail système sensible ne fuite en production.
 * 
 * @param error L'erreur interceptée
 * @param contextMessage Contexte de l'erreur pour les logs serveur
 */
export function handleApiError(error: unknown, contextMessage: string = "Erreur API") {
  // 1. Log sécurisé côté serveur
  console.error(`🔴 [API_ERROR] ${contextMessage}:`, error);

  // 2. Gestion des erreurs de validation Zod
  if (error instanceof ZodError) {
    const firstError = Object.values(error.flatten().fieldErrors)[0]?.[0] 
      || error.errors[0]?.message 
      || "Certaines données transmises sont invalides.";
    return NextResponse.json(
      { message: firstError, errors: error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // 3. Gestion des erreurs de base de données Prisma connues
  const errorObj = error as any;
  if (errorObj && typeof errorObj === "object") {
    // Code d'erreur unique violé (ex: pseudo ou email dupliqué)
    if (errorObj.code === "P2002") {
      const target = errorObj.meta?.target;
      const field = Array.isArray(target) ? target[0] : typeof target === "string" ? target : "champ";
      return NextResponse.json(
        { message: `Cette valeur pour le champ '${field}' est déjà utilisée.` },
        { status: 409 }
      );
    }
    
    // Enregistrement non trouvé
    if (errorObj.code === "P2025") {
      return NextResponse.json(
        { message: "La ressource demandée est introuvable." },
        { status: 404 }
      );
    }
  }

  // 4. Erreur système générique pour la production
  return NextResponse.json(
    { message: "Le serveur a rencontré une erreur. Réessaie dans un instant." },
    { status: 500 }
  );
}
