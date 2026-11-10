import { APP_URL, escHtml, generateEmailTemplate, PROFILE_DATA, stripHtml } from "./base";

export interface WelcomeProfileEmailParams {
  name: string;
  profileType: string;
}

export function getWelcomeProfileEmailContent({ name, profileType }: WelcomeProfileEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const profile = PROFILE_DATA[profileType.toUpperCase()] ?? PROFILE_DATA.BUILDER;

  const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> ${escHtml(profile.headline)}</h1>
      <p>${escHtml(profile.description)}</p>
      <div class="card">
        <div class="card-value">${escHtml(profileType.toUpperCase())}</div>
        <div class="card-label">Ton profil HASHCODE</div>
      </div>
      <p>Ton espace de travail est prêt. Commence par ta première action : chaque lab validé devient une preuve de compétence dans ton Portfolio.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/dashboard" class="btn">${escHtml(profile.cta)} →</a>
      </div>
      <hr class="divider">
      <p class="note">Tu peux consulter le détail de ton profil à tout moment depuis ton tableau de bord. Reste synchronisé — ton aventure commence maintenant.</p>
    `;

  const html = generateEmailTemplate(content, `${profile.headline} Ton dashboard est prêt.`);
  return {
    subject: `[HASHCODE] ${escHtml(firstName)}, tu es un·e ${escHtml(profileType.toUpperCase())} — bienvenue dans la communauté`,
    html,
    text: stripHtml(content),
  };
}
