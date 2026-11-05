import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { emailService } from "@/lib/email";
import {
  buildUnsubscribeUrl,
  generateUnsubscribeToken,
  isOptedOut,
} from "@/lib/email-consent";
import { APP_URL } from "@/lib/config";
import type { OpsReminderStep } from "@/lib/email-templates/ops-reminder";

export const dynamic = "force-dynamic";

export const POST = withAdminAuth(async (req, admin) => {
  const segments = new URL(req.url).pathname.split("/").filter(Boolean);
  const userId = segments[segments.length - 2];

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      currentSituation: true,
      class: true,
      primaryDomain: true,
      firstActionStartedAt: true,
      emailStatus: true,
      banned: true,
      deactivatedAt: true,
      lastOpsReminderAt: true,
      emailOptOutAt: true,
      emailOptOutToken: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Utilisateur introuvable." }, { status: 404 });
  }
  if (user.banned || user.deactivatedAt) {
    return NextResponse.json(
      { message: "Compte banni ou désactivé : aucune relance." },
      { status: 409 },
    );
  }
  if (user.emailStatus !== "VALID") {
    return NextResponse.json(
      { message: "Email non valide : relance impossible." },
      { status: 409 },
    );
  }
  if (isOptedOut(user)) {
    return NextResponse.json(
      { message: "Ce membre s'est désabonné des relances." },
      { status: 409 },
    );
  }
  if (
    user.lastOpsReminderAt &&
    Date.now() - user.lastOpsReminderAt.getTime() < 24 * 60 * 60 * 1000
  ) {
    return NextResponse.json(
      { message: "Une relance a déjà été envoyée dans les dernières 24 h." },
      { status: 429 },
    );
  }

  const step: OpsReminderStep = !user.currentSituation
    ? "onboarding"
    : !user.class
      ? "quiz"
      : !user.primaryDomain
        ? "domain"
        : "activation";

  // Un lien de désabonnement signé accompagne chaque relance. Le token est
  // généré une seule fois puis réutilisé.
  let optOutToken = user.emailOptOutToken;
  if (!optOutToken) {
    optOutToken = generateUnsubscribeToken();
    await prisma.user.update({
      where: { id: user.id },
      data: { emailOptOutToken: optOutToken },
    });
  }
  const unsubscribeUrl = buildUnsubscribeUrl(APP_URL, user.id, optOutToken);

  const result = await emailService.sendOpsReminder({
    email: user.email,
    name: user.name,
    step,
    unsubscribeUrl,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastOpsReminderAt: new Date() },
  });

  logActivity({
    userId: admin.userId,
    action: "ADMIN_OPS_REMINDER",
    entity: "user",
    entityId: user.id,
    metadata: { step, email: user.email },
    request: req,
  });

  return NextResponse.json({
    ok: true,
    step,
    mocked: "mocked" in result ? Boolean(result.mocked) : false,
  });
});
