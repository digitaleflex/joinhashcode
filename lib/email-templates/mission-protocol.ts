import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface MissionProtocolEmailParams {
  name: string;
  userClass: string;
}

export function getMissionProtocolEmailContent({ name, userClass }: MissionProtocolEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const content = `
      <h1>Tu connais ton profil. Maintenant, passons à l'action, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Notre analyse montre que tu as un profil <strong>${escHtml(userClass)}</strong>. C'est un bon point de départ, mais ce n'est que le début.</p>
      <p>Voici la première étape recommandée pour ton parcours : un atelier conçu pour te mettre en situation réelle. Pas de théorie inutile — du concret.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Voir ma première étape →</a>
      </div>
      <hr class="divider">
      <p class="note">Chaque atelier te rapproche de ton objectif 90 jours.</p>
    `;

  const html = generateEmailTemplate(content, "Passe à l'action. Ta première étape t'attend.");
  return {
    subject: `${escHtml(firstName)}, ta première étape t'attend`,
    html,
    text: stripHtml(content),
  };
}
