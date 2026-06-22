import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface MissionRejectedEmailParams {
  name: string;
  missionTitle: string;
  feedback?: string;
}

export function getMissionRejectedEmailContent({ name, missionTitle, feedback }: MissionRejectedEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> ta soumission n'a pas été retenue.</h1>
      <p>Après examen, la soumission pour <strong>${escHtml(missionTitle)}</strong> n'a pas pu être validée.</p>
      ${feedback ? `
      <div class="card" style="text-align: left;">
        <div class="card-label" style="margin-bottom: 12px;">Retour de l'équipe</div>
        <p style="font-size: 14px; color: #a1a1aa; margin: 0; white-space: pre-wrap;">${escHtml(feedback)}</p>
      </div>` : ""}
      <p>Ce n'est pas une fin — c'est un cap. Les builders qui progressent le plus vite sont ceux qui tirent les leçons de chaque tentative. D'autres missions t'attendent.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Explorer d'autres missions →</a>
      </div>
    `;

  const html = generateEmailTemplate(content, `Ta soumission pour "${missionTitle}" n'a pas été retenue. D'autres missions t'attendent.`);
  return {
    subject: `Résultat de ta soumission — "${escHtml(missionTitle)}"`,
    html,
    text: stripHtml(content),
  };
}
