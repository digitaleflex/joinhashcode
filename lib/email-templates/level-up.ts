import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface LevelUpEmailParams {
  name: string;
  newLevel: number;
}

export function getLevelUpEmailContent({ name, newLevel }: LevelUpEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> tu viens de passer un cap.</h1>
      <p>Ton travail constant porte ses fruits. Tu as officiellement atteint un nouveau niveau dans l'écosystème HASHCODE.</p>
      <div class="card">
        <div class="card-value">Niveau ${newLevel}</div>
        <div class="card-label">Ton nouveau rang dans la communauté</div>
      </div>
      <p>Ce niveau te donne accès à de nouvelles missions et renforce ta position dans ta guilde. Continue sur cette lancée.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/dashboard" class="btn">Voir mon tableau de bord →</a>
      </div>
    `;

  const html = generateEmailTemplate(content, "Niveau ${newLevel} atteint. De nouvelles missions s'ouvrent à toi.");
  return {
    subject: `${escHtml(firstName)}, tu es maintenant niveau ${newLevel} sur HASHCODE 🎯`,
    html,
    text: stripHtml(content),
  };
}
