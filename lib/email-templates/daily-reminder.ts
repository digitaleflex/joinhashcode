import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface DailyReminderEmailParams {
  name: string;
}

export function getDailyReminderEmailContent({ name }: DailyReminderEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const content = `
      <h1>Une petite étape aujourd'hui, <span class="accent">${escHtml(firstName)}</span> ?</h1>
      <p>Tu as un objectif et un parcours. Même 15 minutes suffisent pour progresser.</p>
      <p>Connecte-toi pour voir quelle est la prochaine action recommandée spécialement pour toi.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/dashboard" class="btn">Voir mon parcours →</a>
      </div>
      <hr class="divider">
      <p class="note">Tu ne veux plus recevoir ces rappels ? <a href="${APP_URL}/settings">Gère tes préférences ici.</a></p>
    `;

  const html = generateEmailTemplate(content, "15 minutes suffisent pour avancer. Voir mon parcours.");
  return {
    subject: `${escHtml(firstName)}, une petite étape aujourd'hui ?`,
    html,
    text: stripHtml(content),
  };
}
