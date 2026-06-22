import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface Level5ReachedEmailParams {
  name: string;
}

export function getLevel5ReachedEmailContent({ name }: Level5ReachedEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> tu es désormais un Agent Confirmé.</h1>
      <p>Passer le <strong>Niveau 5</strong> n'est pas une mince affaire. Cela prouve ta constance et ton engagement dans l'écosystème.</p>
      <div class="card">
        <div class="card-value">NIVEAU 5</div>
        <div class="card-label">Nouveau Grade : AGENT CONFIRMÉ</div>
      </div>
      <p>À ce stade, tu débloques des missions plus complexes et ta voix porte davantage au sein de ta guilde. Tu as prouvé que tu n'étais pas là par hasard.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Voir mes nouvelles opportunités →</a>
      </div>
      <hr class="divider">
      <p class="note">L'Afrique Tech a besoin de profils comme le tien. Continue de bâtir.</p>
    `;

  const html = generateEmailTemplate(content, "Félicitations pour ton passage au Niveau 5 ! Tu es désormais un Agent Confirmé.");
  return {
    subject: `🎯 Cap franchi : Bienvenue au Niveau 5, ${escHtml(firstName)} !`,
    html,
    text: stripHtml(content),
  };
}
