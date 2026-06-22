import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface BetaKeyVerifiedEmailParams {
  name: string;
}

export function getBetaKeyVerifiedEmailContent({ name }: BetaKeyVerifiedEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1>Accès validé, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Ta clé d'habilitation a été acceptée. Tu fais maintenant partie des rares agents à avoir accès à la phase de build Alpha de HASHCODE.</p>
      <div class="card">
        <div class="card-value">ACCÈS ALPHA</div>
        <div class="card-label">Statut de ton compte</div>
      </div>
      <p><strong>La prochaine étape ?</strong> Ton onboarding. C'est ici que tu définis qui tu es dans l'écosystème et quels sont tes objectifs prioritaires.</p>
      <p>Une fois l'onboarding terminé, tu passeras ton <strong>test de profilage</strong> pour découvrir ta classe de bâtisseur.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/onboarding" class="btn">Lancer mon Onboarding →</a>
      </div>
      <hr class="divider">
      <p class="note">Besoin d'un guide ? L'interface t'accompagnera pas à pas.</p>
    `;

  const html = generateEmailTemplate(content, "Ta clé a été validée. Prochaine étape : ton onboarding.");
  return {
    subject: "Accès HASHCODE activé — Prochaine étape 🚀",
    html,
    text: stripHtml(content),
  };
}
