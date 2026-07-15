import { APP_URL, escHtml, generateEmailTemplate, PROFILE_DATA, stripHtml } from "./base";

export interface QuizResultsEmailParams {
  name: string;
  profileType: string;
}

export function getQuizResultsEmailContent({ name, profileType }: QuizResultsEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const profile = PROFILE_DATA[profileType.toUpperCase()] ?? PROFILE_DATA.BUILDER;

  const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> ${escHtml(profile.headline)}</h1>
      <p>${escHtml(profile.description)}</p>
      <div class="card">
        <div class="card-value">${escHtml(profileType.toUpperCase())}</div>
        <div class="card-label">Ton profil HASHCODE</div>
      </div>
      <p>Cette connaissance de toi-même n'est que le début. La prochaine étape est cruciale : choisir la spécialisation qui correspond à tes forces et te fixer un objectif concret pour les 90 prochains jours.</p>
      <p>Nous allons te recommander une voie adaptée à ton profil. Tu pourras la valider ou l'ajuster.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/dashboard" class="btn">Choisir ma spécialisation →</a>
      </div>
      <hr class="divider">
      <p class="note">Ton parcours se construit avec toi, pas pour toi.</p>
    `;

  const html = generateEmailTemplate(content, `${profile.headline} Choisis ta spécialisation.`);
  return {
    subject: `${escHtml(firstName)}, ton profil est prêt — choisis ta voie 👉`,
    html,
    text: stripHtml(content),
  };
}
