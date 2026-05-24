import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  try {
    // 1. Génération d'une clé secrète de haute entropie (192 bits d'entropie + préfixe)
    const rawSecret = "hc_sec_" + crypto.randomBytes(24).toString("hex");

    // 2. Calcul du hash SHA-256 de cette clé pour stockage sécurisé (RGPD & EHAF conformes)
    const hash = crypto.createHash("sha256").update(rawSecret).digest("hex");

    // 3. Génération d'une signature cryptographique visuelle unique (SIG: XXXX-XXXX-XXXX)
    const rawSig = crypto
      .createHash("sha256")
      .update(session.user.id + Date.now().toString())
      .digest("hex")
      .slice(0, 16)
      .toUpperCase();
    
    // Formatage premium : XXXX-XXXX-XXXX-XXXX
    const cardSignature = rawSig.match(/.{1,4}/g)?.join("-") || rawSig;

    // 4. Enregistrement sécurisé du hash en base de données et activation du tier PREMIUM
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        cardSecretHash: hash,
        cardSignature,
        cardIssuedAt: new Date(),
        cardTier: "PREMIUM",
      },
    });

    // 5. Renvoi de la clé brute à l'utilisateur UNE SEULE FOIS pour affichage
    return NextResponse.json({
      secretKey: rawSecret,
      cardSignature,
      cardIssuedAt: updatedUser.cardIssuedAt,
      cardTier: updatedUser.cardTier,
      memberNumber: updatedUser.memberNumber,
    });
  } catch (error) {
    console.error("Erreur génération clé membre:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
