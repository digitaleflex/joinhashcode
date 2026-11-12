import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface OnboardingCompletedEmailParams {
  name: string;
}

export function getOnboardingCompletedEmailContent({ name }: OnboardingCompletedEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const content = `
      <h1>Génial, <span class="accent">${escHtml(firstName)}</span>. Ton profil est créé.</h1>
      <p>Merci pour ces informations. Elles vont nous permettre de personnaliser ton expérience.</p>
      <p><strong>Place à la pratique.</strong> Choisis ton premier lab et livre une première action concrète : elle sera relue par un pair et deviendra ta première preuve.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Choisir mon premier lab →</a>

      </div>
      <hr class="divider">
      <p class="note">Tu peux aussi, quand tu veux, faire le quiz de profil depuis tes paramètres.</p>
    `;

  const html = generateEmailTemplate(content, "Profil créé ! Prêt pour ton premier lab ?");
  return {
    subject: `Ton profil est créé — prêt pour ton premier lab ?`,
    html,
    text: stripHtml(content),
  };
}
