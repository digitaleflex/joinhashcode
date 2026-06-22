import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface WelcomeEmailParams {
  name: string;
}

export function getWelcomeEmailContent({ name }: WelcomeEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1>Bienvenue, <span class="accent">${escHtml(firstName)}</span>. Ton signal est actif.</h1>
      <p>HASHCODE n'est pas une plateforme de plus. C'est un réseau de bâtisseurs qui choisissent l'action. Ta calibration est terminée, tu es maintenant prêt à évoluer.</p>
      <p>Mais attention : un signal qui ne vibre pas finit par s'éteindre. Ta priorité absolue aujourd'hui est de maintenir ta <strong>Vibrance</strong>.</p>
      <div class="card">
        <div class="card-label">Action Prioritaire</div>
        <div class="card-value">NEURAL CHECK-IN</div>
      </div>
      <p>Connecte-toi chaque jour pour valider ta présence, gagner tes premiers points d'XP et activer ton multiplicateur de série. Ici, la régularité dépasse l'intensité.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/dashboard" class="btn">Effectuer mon Check-in →</a>
      </div>
      <hr class="divider">
      <p class="note">Reste synchronisé. Ton aventure commence maintenant.</p>
    `;

  const html = generateEmailTemplate(content, "Initialisation de ton signal terminée. Bienvenue dans l'écosystème.");
  return {
    subject: `[HASHCODE] Initialisation terminée — Bienvenue, ${escHtml(firstName)} 👋`,
    html,
    text: stripHtml(content),
  };
}
