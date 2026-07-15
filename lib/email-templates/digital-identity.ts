import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface DigitalIdentityEmailParams {
  name: string;
}

export function getDigitalIdentityEmailContent({ name }: DigitalIdentityEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const content = `
      <h1>Bonne nouvelle, <span class="accent">${escHtml(firstName)}</span> : ton portfolio commence à prendre forme.</h1>
      <p>Après une semaine d'activité, tu commences à accumuler des réalisations concrètes. Chaque projet validé par un mentor devient une <strong>preuve de compétence</strong> (Evidence).</p>
      <p>Bientôt, tu pourras partager ton portfolio avec des recruteurs et partenaires. Ce ne sera pas une simple liste de cours — ce seront des compétences prouvées.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/dossier" class="btn">Voir mon portfolio →</a>
      </div>
      <hr class="divider">
      <p class="note">Continue comme ça. Chaque projet te rend plus visible.</p>
    `;

  const html = generateEmailTemplate(content, "Ton portfolio se construit. Chaque projet compte.");
  return {
    subject: `${escHtml(firstName)}, ton portfolio commence à prendre forme`,
    html,
    text: stripHtml(content),
  };
}
