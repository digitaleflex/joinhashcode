export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { collectUserData } from "@/lib/user-export";
import JSZip from "jszip";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const format = new URL(req.url).searchParams.get("format") ?? "json";
  const data = await collectUserData(session.user.id);
  const safeId = session.user.id.slice(0, 8);
  const date = new Date().toISOString().split("T")[0];

  if (format === "zip") {
    const zip = new JSZip();

    zip.file("README.txt", [
      "HASHCODE — Export de données personnelles",
      `Généré le : ${data.exportedAt}`,
      `Utilisateur : ${data.profile?.name} (${data.profile?.email})`,
      "",
      "Contenu de cette archive :",
      "  profile.json      — Ton profil complet (scores, paramètres, progression)",
      "  quiz.json         — Résultats de tes quiz psychométriques",
      "  missions.json     — Tes soumissions de missions",
      "  checkins.json     — Ton historique de check-ins quotidiens",
      "  squad.json        — Ton appartenance à une squad",
      "  activity.json     — Journal d'activité (connexions, actions)",
      "  notifications.json — Notifications reçues",
      "  feedback.json     — Tes retours et signalements",
      "",
      "Ces données t'appartiennent. Tu peux en demander la suppression à tout moment.",
      "Contact : support@joinhashcode.com",
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
        "Content-Disposition": `attachment; filename="hashcode-data-${safeId}-${date}.zip"`,
        "Cache-Control": "no-store",
      },
    });
  }

  // Default: JSON
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="hashcode-data-${safeId}-${date}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
