import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface OnboardingCompletedEmailParams {
  name: string;
}

export function getOnboardingCompletedEmailContent({ name }: OnboardingCompletedEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1>Profil initial complété, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Excellent travail. Tes objectifs et ton contexte sont désormais synchronisés avec la plateforme.</p>
      <p><strong>Mais ce n'est que le début.</strong> Pour que le système puisse t'assigner les bonnes missions, nous devons identifier ton "archétype de bâtisseur".</p>
      <div class="card">
        <div class="card-label">Étape Suivante</div>
        <div class="card-value">LE QUIZ</div>
      </div>
      <p>Le test de profilage HASHCODE n'est pas un questionnaire classique. Il analyse ta manière de réagir face aux défis réels.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/quiz" class="btn">Passer mon test de profilage →</a>
      </div>
      <hr class="divider">
      <p class="note">Prépare-toi, c'est l'étape qui définit ton parcours.</p>
    `;

  const html = generateEmailTemplate(content, "Onboarding terminé. Passe ton test de profilage pour découvrir ta classe.");
  return {
    subject: "Onboarding validé — Découvre ta classe de bâtisseur 🎯",
    html,
    text: stripHtml(content),
  };
}
