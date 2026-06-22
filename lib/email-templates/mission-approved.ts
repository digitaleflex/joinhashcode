import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface MissionApprovedEmailParams {
  name: string;
  missionTitle: string;
  xp: number;
}

export function getMissionApprovedEmailContent({ name, missionTitle, xp }: MissionApprovedEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1>Mission validée, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Ta soumission pour <strong>${escHtml(missionTitle)}</strong> a été examinée et approuvée. Le travail que tu as fourni fait la différence.</p>
      <div class="card">
        <div class="card-value">+${xp} XP</div>
        <div class="card-label">Ajoutés à ton profil</div>
      </div>
      <p>Continue sur cette lancée. Chaque mission validée renforce ta réputation dans la communauté et te rapproche du niveau suivant.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Voir les prochaines missions →</a>
      </div>
    `;

  const html = generateEmailTemplate(content, `+${xp} XP crédités pour "${missionTitle}". Continue sur ta lancée.`);
  return {
    subject: `✓ Mission validée — +${xp} XP pour "${escHtml(missionTitle)}"`,
    html,
    text: stripHtml(content),
  };
}
