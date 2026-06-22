import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface MissionNeedsRevisionEmailParams {
  name: string;
  missionTitle: string;
  feedback: string;
  revisionCount?: number;
}

export function getMissionNeedsRevisionEmailContent({ name, missionTitle, feedback, revisionCount }: MissionNeedsRevisionEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> ta soumission demande quelques ajustements.</h1>
      <p>Ton travail sur <strong>${escHtml(missionTitle)}</strong> a été examiné. Le reviewer a identifié des points à améliorer avant de pouvoir valider.</p>
      <div class="card" style="text-align: left;">
        <div class="card-label" style="margin-bottom: 12px;">Feedback du reviewer</div>
        <p style="font-size: 14px; color: #a1a1aa; margin: 0; white-space: pre-wrap;">${escHtml(feedback)}</p>
      </div>
      <p>Prends le temps de relire ce feedback, apporte les corrections nécessaires, et resoumet ta mission. Chaque itération te rend meilleur(e).</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Retravailler ma soumission →</a>
      </div>
      ${revisionCount && revisionCount >= 2 ? `<hr class="divider"><p class="note">Attention : tu as atteint ${revisionCount}/3 révisions autorisées pour cette mission.</p>` : ""}
    `;

  const html = generateEmailTemplate(content, `Quelques ajustements sont nécessaires pour valider "${missionTitle}".`);
  return {
    subject: `Révision requise — "${escHtml(missionTitle)}"`,
    html,
    text: stripHtml(content),
  };
}
