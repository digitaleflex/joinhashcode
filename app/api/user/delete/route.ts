export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { emailService } from "@/lib/email";
import { logActivity } from "@/lib/activity-log";

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

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
}
