export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, secretCode } = body;

    // Validation stricte des entrées (Conformité EHAF)
    if (!identifier || !secretCode) {
      return NextResponse.json(
        { error: "Identifiant et code secret requis" },
        { status: 400 }
      );
    }

    // Protection contre l'injection de types de données étranges
    const stringIdentifier = String(identifier).trim();
    const stringSecretCode = String(secretCode).trim();

    // Recherche de l'utilisateur (par email, pseudo ou numéro de membre)
    const memberNum = isNaN(Number(stringIdentifier)) ? -1 : Number(stringIdentifier);
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: stringIdentifier },
          { pseudo: stringIdentifier },
          { memberNumber: memberNum },
        ],
      },
    });

    // 1. Protection contre les attaques de timing (Timing Attacks / User Enumeration)
    // Nous calculons toujours le hash SHA-256 de la clé entrante.
    const incomingHash = crypto.createHash("sha256").update(stringSecretCode).digest("hex");
    
    // Si l'utilisateur n'existe pas ou n'a pas de clé, nous le comparons à un hash factice
    const dummyHash = "0000000000000000000000000000000000000000000000000000000000000000";
    const hashToCompare = user?.cardSecretHash || dummyHash;

    const bufferA = Buffer.from(hashToCompare, "hex");
    const bufferB = Buffer.from(incomingHash, "hex");

    let isMatch = false;
    if (bufferA.length === bufferB.length) {
      isMatch = crypto.timingSafeEqual(bufferA, bufferB);
    }

    // Si pas de correspondance ou utilisateur inexistant : réponse générique de sécurité
    if (!user || !user.cardSecretHash || !isMatch) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // Block banned users — same generic message to avoid leaking ban status to SSO consumers
    if (user.banned) {
      const banExpires = user.banExpires;
      if (!banExpires || banExpires > new Date()) {
        return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
      }
    }

    // 2. Préparation du payload de l'écosystème SSO
    const ssoUser = {
      id: user.id,
      name: user.name,
      pseudo: user.pseudo,
      email: user.email,
      class: user.class,
      level: user.level,
      memberNumber: user.memberNumber,
      cardTier: user.cardTier,
      cardSignature: user.cardSignature,
      badges: user.badges,
      role: user.role,
    };

    // 3. Signature HMAC-SHA256 pour prouver l'authenticité de la validation au site connexe
    const payloadString = JSON.stringify(ssoUser);
    const signature = crypto
      .createHmac("sha256", process.env.BETTER_AUTH_SECRET || "hashcode_ecosystem_default_sign")
      .update(payloadString)
      .digest("hex");

    return NextResponse.json({
      verified: true,
      user: ssoUser,
      signature,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Erreur validation SSO carte membre:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
