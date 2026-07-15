import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface BetaKeyVerifiedEmailParams {
  name: string;
}

export function getBetaKeyVerifiedEmailContent({ name }: BetaKeyVerifiedEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const content = `
      <h1>Bienvenue dans HASHCODE, <span class="accent">${escHtml(firstName)}</span> 🎉</h1>
      <p>Ton accès est activé. Tu fais partie des premiers à découvrir la plateforme.</p>
      <p><strong>Première étape :</strong> crée ton profil en 5 minutes. Cela nous permettra de comprendre ton niveau, ta situation et tes objectifs.</p>
      <p>Ensuite, un diagnostic personnalisé te révélera ton profil et te proposera une direction adaptée à tes forces.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/onboarding" class="btn">Créer mon profil →</a>
      </div>
      <hr class="divider">
      <p class="note">On commence doucement, mais chaque étape te rapproche de ton objectif.</p>
    `;

  const html = generateEmailTemplate(content, "Bienvenue ! Crée ton profil pour commencer.");
  return {
    subject: `Bienvenue dans HASHCODE, ${escHtml(firstName)} 🎉`,
    html,
    text: stripHtml(content),
  };
}
