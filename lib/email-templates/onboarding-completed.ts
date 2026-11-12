import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface OnboardingCompletedEmailParams {
  name: string;
}

export function getOnboardingCompletedEmailContent({ name }: OnboardingCompletedEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const content = `
      <h1>Génial, <span class="accent">${escHtml(firstName)}</span>. Ton profil est créé.</h1>
      <p>Merci pour ces informations. Elles vont nous permettre de personnaliser ton expérience.</p>
      <p><strong>Place à la découverte.</strong> Un quiz de 3 minutes va révéler ton profil de bâtisseur parmi 4 classes. Ce n'est pas un test — c'est un miroir.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Découvrir mon profil →</a>
      </div>
      <hr class="divider">
      <p class="note">Réponds instinctivement. Il n'y a pas de bonne ou de mauvaise réponse.</p>
    `;

  const html = generateEmailTemplate(content, "Profil créé ! Prêt à découvrir ton profil de bâtisseur ?");
  return {
    subject: `Ton profil est créé — prêt à découvrir qui tu es ?`,
    html,
    text: stripHtml(content),
  };
}
