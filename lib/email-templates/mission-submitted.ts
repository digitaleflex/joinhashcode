import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface MissionSubmittedEmailParams {
  name: string;
  missionTitle: string;
}

export function getMissionSubmittedEmailContent({ name, missionTitle }: MissionSubmittedEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1>Soumission reçue, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Ta soumission pour <strong>${escHtml(missionTitle)}</strong> a bien été enregistrée. Tu seras notifié(e) par email dès qu'un pair l'aura examinée.</p>
      <p><strong>Et maintenant ?</strong> Un membre de la communauté va prendre en charge ta soumission pour la passer en revue. Le processus prend généralement 24 à 48 heures.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Voir mes missions →</a>
      </div>
      <hr class="divider">
      <p class="note">En attendant, tu peux explorer d'autres labs.</p>
    `;

  const html = generateEmailTemplate(content, `Ta soumission pour "${missionTitle}" est en attente de revue.`);
  return {
    subject: `Soumission reçue — "${escHtml(missionTitle)}"`,
    html,
    text: stripHtml(content),
  };
}
