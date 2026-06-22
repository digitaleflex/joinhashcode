import { APP_URL, escHtml, generateEmailTemplate, PROFILE_DATA, stripHtml } from "./base";

export interface QuizResultsEmailParams {
  name: string;
  profileType: string;
}

export function getQuizResultsEmailContent({ name, profileType }: QuizResultsEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const profile = PROFILE_DATA[profileType.toUpperCase()] ?? PROFILE_DATA.BUILDER;

  const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> ${escHtml(profile.headline)}</h1>
      <p>${escHtml(profile.description)}</p>
      <div class="card">
        <div class="card-value">${escHtml(profileType.toUpperCase())}</div>
        <div class="card-label">Ton profil HASHCODE</div>
      </div>
      <p>Ton espace de travail est prêt. Missions, guilde, tableau de bord — tout est calibré pour ton mode d'action.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/dashboard" class="btn">${escHtml(profile.cta)} →</a>
      </div>
      <hr class="divider">
      <p class="note">Tu peux consulter le détail de ton profil à tout moment depuis ton tableau de bord.</p>
    `;

  const html = generateEmailTemplate(content, `${profile.headline} Découvre tes missions.`);
  return {
    subject: `${escHtml(firstName)}, tu es un·e ${escHtml(profileType.toUpperCase())} — voici ce que ça signifie`,
    html,
    text: stripHtml(content),
  };
}
