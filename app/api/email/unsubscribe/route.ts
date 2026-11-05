import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { verifyUnsubscribeSignature } from "@/lib/email-consent";
import { checkRateLimit, publicApiLimiter } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Désabonnement des communications opérationnelles.
 *
 * Route publique : le lien provient d'un email, il n'y a donc pas de session.
 * La protection repose sur une signature HMAC (paramètre `s`) et sur un token
 * opaque stocké en base (`t`). Sans les deux, la requête est rejetée.
 */
const bodySchema = z.object({
  u: z.string().min(1).max(64),
  t: z.string().min(8).max(128),
  s: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const limited = await checkRateLimit(
    publicApiLimiter,
    getClientIp(req.headers),
    { failClosed: true },
  );
  if (limited.limited) {
    return NextResponse.json(
      { message: "Trop de tentatives. Réessaie dans une minute." },
      { status: 429 },
    );
  }

  let parsed;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  const { u, t, s } = parsed;

  if (!verifyUnsubscribeSignature(u, s)) {
    return NextResponse.json({ message: "Lien invalide." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: u },
    select: { id: true, emailOptOutToken: true, emailOptOutAt: true },
  });

  // Message volontairement identique pour un token inconnu et un utilisateur
  // absent : ne pas divulguer l'existence d'un compte.
  if (!user || !user.emailOptOutToken || user.emailOptOutToken !== t) {
    return NextResponse.json({ message: "Lien invalide ou expiré." }, { status: 403 });
  }

  if (!user.emailOptOutAt) {
    await prisma.user.update({
      where: { id: user.id },
      data: { emailOptOutAt: new Date() },
    });

    logActivity({
      userId: user.id,
      action: "EMAIL_OPT_OUT",
      entity: "user",
      entityId: user.id,
      request: req,
    });
  }

  return NextResponse.json({ ok: true });
}
