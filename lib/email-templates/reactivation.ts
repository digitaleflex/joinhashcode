import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface ReactivationEmailParams {
  name: string;
}

export function getReactivationEmailContent({ name }: ReactivationEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const salutation = firstName ? `, ${escHtml(firstName)}` : "";
  const subjectPrefix = firstName ? `${escHtml(firstName)}, ` : "";
  const content = `
      <h1>Ta première mission se valide maintenant en 15 minutes${salutation}</h1>
      <p>On a changé les règles : la mission d'onboarding n'est plus un formulaire interminable ni une attente de validation.</p>
      <p><strong>Ce qui a changé :</strong></p>
      <ul>
        <li>✅ Tes réponses du diagnostic pré-remplissent déjà une grande partie — tu confirmes, tu ne répètes pas</li>
        <li>⚡ Validation instantanée dès que tu termines : +150 XP immédiatement</li>
        <li>🪪 Ton profil HashCode officiel est généré à la fin</li>
      </ul>
      <p>15 minutes, et tu passes de visiteur à membre officiel avec ton profil.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions/mission-01-decouverte" class="btn">Terminer ma première mission →</a>
      </div>
      <hr class="divider">
      <p class="note">Tu ne veux plus recevoir ces emails ? <a href="${APP_URL}/settings">Gère tes préférences ici.</a></p>
    `;

  const html = generateEmailTemplate(content, "Ta première mission se valide maintenant en 15 minutes.");
  return {
    subject: `${subjectPrefix}ta première mission se valide en 15 min maintenant`,
    html,
    text: stripHtml(content),
  };
}
