export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { emailService } from "@/lib/email";
import { logActivity } from "@/lib/activity-log";
import { requireSession, AuthError, checkCsrfOrigin } from "@/lib/auth-guard";

export async function DELETE(req: Request) {
  try {
    checkCsrfOrigin(req);
    const session = await requireSession();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true, memberNumber: true, progress: { select: { level: true, missionsCompletedCount: true } } },
    });

    // Log before deletion — no PII in metadata (userId becomes null after delete via SetNull)
    logActivity({
      userId: session.user.id,
      action: "ACCOUNT_DELETED",
      entity: "user",
      entityId: session.user.id,
      metadata: { memberNumber: user?.memberNumber, level: user?.progress?.level },
      request: req,
    });

    await prisma.user.delete({ where: { id: session.user.id } });

    if (user) {
      // Confirmation to the user
      emailService.sendAccountDeleted({ email: user.email, name: user.name });

      // Notify all admins
      const admins = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "MODERATOR"] } },
        select: { email: true, name: true },
      });
      for (const admin of admins) {
        emailService.sendAdminAccountDeleted({
          adminEmail: admin.email,
          adminName: admin.name,
          deletedName: user.name,
          deletedEmail: user.email,
          memberNumber: user.memberNumber,
          level: user.progress?.level ?? 1,
          missionsCount: user.progress?.missionsCompletedCount ?? 0,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("[USER_DELETE]", error);
    return NextResponse.json({ message: "Erreur système. Réessaie dans un instant." }, { status: 500 });
  }
}
