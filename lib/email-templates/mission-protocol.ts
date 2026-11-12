import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface MissionProtocolEmailParams {
  name: string;
  /** Profil issu du quiz, qui est facultatif (D-030) : absent pour la plupart des nouveaux membres. */
  userClass?: string | null;
}

export function getMissionProtocolEmailContent({ name, userClass }: MissionProtocolEmailParams) {
  const firstName = (name || "").split(" ")[0];

  // Sans quiz, aucune « analyse » n'a eu lieu : on n'annonce donc aucun profil.
  const content = userClass
    ? `
      <h1>Tu connais ton profil. Maintenant, passons à l'action, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Notre analyse montre que tu as un profil <strong>${escHtml(userClass)}</strong>. C'est un bon point de départ, mais ce n'est que le début.</p>
      <p>Voici la première étape recommandée pour ton parcours : un lab conçu pour te mettre en situation réelle. Pas de théorie inutile — du concret.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Voir ma première étape →</a>
      </div>
      <hr class="divider">
      <p class="note">Chaque lab validé est une preuve de plus sur ton profil.</p>
    `
    : `
      <h1>Passons à l'action, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Ton compte est prêt. La meilleure façon de commencer est de choisir un lab et de le livrer : c'est ce qui construit ta première preuve.</p>
      <p>Voici la première étape recommandée : un lab conçu pour te mettre en situation réelle. Pas de théorie inutile — du concret.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Choisir mon premier lab →</a>
      </div>
      <hr class="divider">
      <p class="note">Chaque lab validé est une preuve de plus de ce que tu sais faire.</p>
    `;

  const html = generateEmailTemplate(content, "Passe à l'action. Ta première étape t'attend.");
  return {
    subject: `${escHtml(firstName)}, ta première étape t'attend`,
    html,
    text: stripHtml(content),
  };
}
