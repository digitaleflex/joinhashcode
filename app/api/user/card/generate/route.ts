export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new NextResponse("Non autorisÃ©", { status: 401 });
  }

  try {
    // 1. GÃ©nÃ©ration d'une clÃ© secrÃ¨te de haute entropie (192 bits d'entropie + prÃ©fixe)
    const rawSecret = "hc_sec_" + crypto.randomBytes(24).toString("hex");

    // 2. Calcul du hash SHA-256 de cette clÃ© pour stockage sÃ©curisÃ© (RGPD & EHAF conformes)
    const hash = crypto.createHash("sha256").update(rawSecret).digest("hex");

    // 3. GÃ©nÃ©ration d'une signature cryptographique visuelle unique (SIG: XXXX-XXXX-XXXX)
    const rawSig = crypto
      .createHash("sha256")
      .update(session.user.id + Date.now().toString())
      .digest("hex")
      .slice(0, 16)
      .toUpperCase();
    
    // Formatage premium : XXXX-XXXX-XXXX-XXXX
    const cardSignature = rawSig.match(/.{1,4}/g)?.join("-") || rawSig;

    // 4. Enregistrement sÃ©curisÃ© du hash en base de donnÃ©es et activation du tier PREMIUM
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        cardSecretHash: hash,
        cardSignature,
        cardIssuedAt: new Date(),
        cardTier: "PREMIUM",
      },
    });

    // 5. Renvoi de la clÃ© brute Ã  l'utilisateur UNE SEULE FOIS pour affichage
    return NextResponse.json({
      secretKey: rawSecret,
      cardSignature,
      cardIssuedAt: updatedUser.cardIssuedAt,
      cardTier: updatedUser.cardTier,
      memberNumber: updatedUser.memberNumber,
    });
  } catch (error) {
    console.error("Erreur gÃ©nÃ©ration clÃ© membre:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
