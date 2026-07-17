export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server";
import { collectUserData } from "@/lib/user-export";
import JSZip from "jszip";
import { strictMutationLimiter, checkRateLimit } from "@/lib/ratelimit";
import { formatYYYYMMDD } from "@/lib/dates";
import { requireSession, AuthError } from "@/lib/auth-guard";

export async function GET(req: Request) {
  try {
    const session = await requireSession();

    const { limited } = await checkRateLimit(strictMutationLimiter, `export:${session.user.id}`);
    if (limited) {
      return NextResponse.json({ message: "Trop de requêtes d'exportation. Réessaie dans une heure." }, { status: 429 });
    }

    const format = new URL(req.url).searchParams.get("format") ?? "json";
    const data = await collectUserData(session.user.id);
    const safeId = session.user.id.slice(0, 8);
    const date = formatYYYYMMDD();

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
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("[USER_EXPORT]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
