import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface MissionApprovedEmailParams {
  name: string;
  missionTitle: string;
}

export function getMissionApprovedEmailContent({ name, missionTitle }: MissionApprovedEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1>Lab validé, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Ta soumission pour <strong>${escHtml(missionTitle)}</strong> a été examinée et approuvée. Le travail que tu as fourni fait la différence.</p>
      <div class="card">
        <div class="card-value">Preuve validée</div>
        <div class="card-label">Visible dans ton Portfolio</div>
      </div>
      <p>Continue sur cette lancée. Chaque lab validé est une preuve de compétence que tu peux montrer.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Voir les prochains labs →</a>
      </div>
    `;

  const html = generateEmailTemplate(content, `Ton lab "${missionTitle}" est validé. Une preuve de plus dans ton Portfolio.`);
  return {
    subject: `✓ Lab validé — "${escHtml(missionTitle)}"`,
    html,
    text: stripHtml(content),
  };
}
