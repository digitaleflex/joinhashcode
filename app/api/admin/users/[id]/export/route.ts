export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { collectUserData } from "@/lib/user-export";
import { logActivity } from "@/lib/activity-log";
import JSZip from "jszip";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!admin || !["ADMIN", "MODERATOR"].includes(admin.role)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id: targetUserId } = await params;
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, name: true, email: true },
  });
  if (!targetUser) return new NextResponse("User not found", { status: 404 });

  const format = new URL(req.url).searchParams.get("format") ?? "json";

  logActivity({
    userId: session.user.id,
    action: "ADMIN_USER_EXPORTED",
    entity: "user",
    entityId: targetUserId,
    metadata: { format, targetEmail: targetUser.email, targetName: targetUser.name },
    request: req,
  });
  const data = await collectUserData(targetUserId);
  const safeId = targetUserId.slice(0, 8);
  const date = new Date().toISOString().split("T")[0];

  if (format === "zip") {
    const zip = new JSZip();

    zip.file("README.txt", [
      "HASHCODE — Export de données (généré par l'administration)",
      `Généré le : ${data.exportedAt}`,
      `Utilisateur : ${targetUser.name} (${targetUser.email})`,
      `Exporté par : ${session.user.name} (${session.user.email})`,
      "",
      "Contenu :",
      "  profile.json       — Profil complet",
      "  quiz.json          — Résultats quiz",
      "  missions.json      — Soumissions missions",
      "  checkins.json      — Check-ins quotidiens",
      "  squad.json         — Appartenance squad",
      "  activity.json      — Journal d'activité",
      "  notifications.json — Notifications",
      "  feedback.json      — Feedbacks",
    ].join("\n"));

    zip.file("profile.json", JSON.stringify(data.profile, null, 2));
    zip.file("quiz.json", JSON.stringify(data.quiz, null, 2));
    zip.file("missions.json", JSON.stringify(data.missions, null, 2));
    zip.file("checkins.json", JSON.stringify(data.checkins, null, 2));
    zip.file("squad.json", JSON.stringify(data.squad, null, 2));
    zip.file("activity.json", JSON.stringify(data.activity, null, 2));
    zip.file("notifications.json", JSON.stringify(data.notifications, null, 2));
    zip.file("feedback.json", JSON.stringify(data.feedback, null, 2));

    const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="hashcode-user-${safeId}-${date}.zip"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="hashcode-user-${safeId}-${date}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
