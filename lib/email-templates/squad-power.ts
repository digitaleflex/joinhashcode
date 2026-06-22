import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface SquadPowerEmailParams {
  name: string;
}

export function getSquadPowerEmailContent({ name }: SquadPowerEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1>On ne build pas un empire seul, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Tu as commencé à accumuler de l'XP, mais ton évolution plafonnera si tu restes isolé. HASHCODE est conçu pour la <strong>Symbiose Cognitive</strong>.</p>
      <p>Une <strong>Squad complète (5 membres)</strong> progresse 3x plus vite. C'est le point d'équilibre parfait pour une cohésion totale sans surcharge d'information.</p>
      <div class="card">
        <div class="card-label">Accélérateur</div>
        <div class="card-value">SQUAD SYNC</div>
      </div>
      <p>Rejoins des profils complémentaires (Builder, Creator, Strategist, Catalyst). Le score de cohésion boostera tes gains d'XP sur chaque action.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/squad" class="btn">Trouver ma Squad →</a>
      </div>
      <hr class="divider">
      <p class="note">L'union fait la force du build. Ne reste pas seul(e).</p>
    `;

  const html = generateEmailTemplate(content, "Multiplie ton impact. Découvre la puissance des Squads.");
  return {
    subject: `[SYNERGIE] Ne build pas seul(e) — Active ta Squad 🤝`,
    html,
    text: stripHtml(content),
  };
}
