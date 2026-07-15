import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface WelcomeEmailParams {
  name: string;
}

export function getWelcomeEmailContent({ name }: WelcomeEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const content = `
      <h1>Bienvenue dans ton parcours, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Ton compte est prêt. Maintenant, place à l'essentiel : découvrir qui tu es vraiment.</p>
      <p>En quelques minutes, notre diagnostic va analyser ta façon de penser et d'agir pour identifier ton profil dominant parmi 4 classes de bâtisseurs.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/quiz" class="btn">Découvrir mon profil →</a>
      </div>
      <hr class="divider">
      <p class="note">Pas d'inquiétude — il n'y a pas de mauvaise réponse. Sois toi-même.</p>
    `;

  const html = generateEmailTemplate(content, "Bienvenue ! Prêt à découvrir ton profil ?");
  return {
    subject: `Bienvenue dans ton parcours HASHCODE, ${escHtml(firstName)} 🚀`,
    html,
    text: stripHtml(content),
  };
}
