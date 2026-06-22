import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface DigitalIdentityEmailParams {
  name: string;
}

export function getDigitalIdentityEmailContent({ name }: DigitalIdentityEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1>Fais briller ton signal auprès du monde, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Après une semaine d'activité, ton <strong>Dossier Tactique</strong> commence à devenir impressionnant. Ton Radar d'Évolution montre tes véritables forces.</p>
      <p>Il est temps de transformer ta réputation interne en une autorité externe incontestable.</p>
      <div class="card">
        <div class="card-label">Statut Actuel</div>
        <div class="card-value">AGENT VALIDÉ</div>
      </div>
      <p>Partage ta <strong>Carte de Membre holographique</strong> sur LinkedIn et X. Elle contient tes preuves réelles, pas de simples mots. Utilise ton profil HASHCODE comme ton nouveau portfolio interactif.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/settings" class="btn">Lier mes comptes sociaux →</a>
      </div>
      <hr class="divider">
      <p class="note">Ton travail parle pour toi. Montre-leur ta valeur réelle.</p>
    `;

  const html = generateEmailTemplate(content, "Transforme ton XP en réputation. Partage ton Dossier Tactique.");
  return {
    subject: `[RÉPUTATION] Ta carte de membre est prête à être déployée 🚀`,
    html,
    text: stripHtml(content),
  };
}
