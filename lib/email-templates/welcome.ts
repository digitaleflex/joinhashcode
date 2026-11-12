import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface WelcomeEmailParams {
  name: string;
}

export function getWelcomeEmailContent({ name }: WelcomeEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const content = `
      <h1>Bienvenue dans ton parcours, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Ton compte est prêt. Maintenant, place à l'essentiel : construire ta première preuve.</p>
      <p>Choisis un lab, livre une action concrète et fais-la relire par un pair. C'est ainsi que tes compétences deviennent visibles et vérifiables.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Choisir mon premier lab →</a>

      </div>
      <hr class="divider">
      <p class="note">Tu avances à ton rythme : tu peux soumettre ton travail quand il est prêt.</p>
    `;

  const html = generateEmailTemplate(content, "Bienvenue ! Ton premier lab t'attend");
  return {
    subject: `Bienvenue dans ton parcours HASHCODE, ${escHtml(firstName)} 🚀`,
    html,
    text: stripHtml(content),
  };
}
